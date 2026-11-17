"""Реальная БД: безопасный перенос старых ключей, откат и повторный запуск."""
from contextlib import aclosing

from cryptography.fernet import InvalidToken
import pytest
from sqlalchemy import select

from app.config import get_settings
from app.database import get_db
from app.main import app
from app.models import ProjectCredential, User
from app.secret_rotation import SecretRotationError, rotate_stored_secrets
from app.security import _fernet, decrypt_secret, encrypt_secret

pytestmark = pytest.mark.asyncio


async def seed_rotation(ids, *, corrupt=False, count=2):
    """Старые credentials и TOTP, одна уже новая запись; никаких реальных секретов."""
    settings = get_settings()
    legacy = _fernet(settings.jwt_secret_key)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        for index in range(count):
            db.add(ProjectCredential(project_id=ids['project'], username=f'user-{index}',
                password_encrypted=legacy.encrypt(f'password-{index}'.encode()).decode(), created_by=ids['admin']))
        db.add(ProjectCredential(project_id=ids['project'], username='new-user',
                                password_encrypted=encrypt_secret('current-password'), created_by=ids['admin']))
        if corrupt:
            db.add(ProjectCredential(project_id=ids['project'], username='broken', password_encrypted='corrupt', created_by=ids['admin']))
        user = await db.get(User, ids['admin'])
        user.totp_secret = legacy.encrypt(b'TOTP-SECRET').decode()
        await db.commit()


async def snapshot():
    """Снимает значения и даты для проверки отсутствия непреднамеренных изменений."""
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        credentials = (await db.execute(select(ProjectCredential.id, ProjectCredential.password_encrypted, ProjectCredential.updated_at).order_by(ProjectCredential.id))).all()
        users = (await db.execute(select(User.id, User.totp_secret, User.updated_at).order_by(User.id))).all()
        return credentials, users


@pytest.mark.parametrize('apply', [False, True])
async def test_rotation_is_atomic_and_idempotent(api, apply):
    _, ids = api
    await seed_rotation(ids)
    before = await snapshot()
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        result = await rotate_stored_secrets(await anext(stream), legacy_keys=[get_settings().jwt_secret_key], apply=apply)
    assert result.examined == 4 and result.already_current == 1 and result.to_rotate == 3
    assert result.unreadable == 0 and result.applied is apply
    after = await snapshot()
    if not apply:
        assert after == before
        return
    assert after != before
    assert [row.updated_at for row in after[0]] == [row.updated_at for row in before[0]]
    assert [row.updated_at for row in after[1]] == [row.updated_at for row in before[1]]
    for row in after[0]:
        assert decrypt_secret(row.password_encrypted).startswith(('password-', 'current-'))
        with pytest.raises(InvalidToken):
            _fernet(get_settings().jwt_secret_key).decrypt(row.password_encrypted.encode())
    assert decrypt_secret(after[1][0].totp_secret) == 'TOTP-SECRET'
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        repeated = await rotate_stored_secrets(await anext(stream), apply=True)
    assert repeated.to_rotate == 0 and repeated.already_current == 4
    assert await snapshot() == after


@pytest.mark.parametrize('failure', ['corrupt', 'missing-key'])
async def test_rotation_rolls_back_all_rows_on_any_unreadable_secret(api, failure):
    _, ids = api
    await seed_rotation(ids, corrupt=failure == 'corrupt')
    before = await snapshot()
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        with pytest.raises(SecretRotationError) as error:
            await rotate_stored_secrets(await anext(stream), legacy_keys=[get_settings().jwt_secret_key] if failure == 'corrupt' else [], apply=True)
    assert error.value.result.unreadable > 0
    assert await snapshot() == before


async def test_rotation_reads_beyond_first_page(api):
    _, ids = api
    await seed_rotation(ids, count=501)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        result = await rotate_stored_secrets(await anext(stream), legacy_keys=[get_settings().jwt_secret_key], apply=True)
    assert result.examined == 503 and result.to_rotate == 502 and result.unreadable == 0
    credentials, _ = await snapshot()
    assert len(credentials) == 502
    assert all(decrypt_secret(row.password_encrypted) for row in credentials)
