"""HTTP/БД: ошибка одной зашифрованной записи не уничтожает остальные данные."""
from contextlib import aclosing

import pytest
from sqlalchemy import select

from app.config import get_settings
from app.database import get_db
from app.main import app
from app.models import ProjectCredential, User, RefreshToken
from app.security import create_2fa_pending_token, encrypt_secret

pytestmark = pytest.mark.asyncio


async def saved_credential(ids, ciphertext):
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        row = ProjectCredential(project_id=ids['project'], username='legacy-user', host='db.internal',
                                password_encrypted=ciphertext, created_by=ids['admin'])
        db.add(row)
        await db.commit()
        return row.id


async def ciphertext_for(credential_id):
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        return (await db.get(ProjectCredential, credential_id)).password_encrypted


async def test_mixed_vault_lists_unreadable_password_and_keeps_ciphertext(api, monkeypatch, caplog):
    client, ids = api
    settings = get_settings()
    monkeypatch.setattr(settings, 'data_encryption_key', 'different-data-key-' * 3)
    monkeypatch.setattr(settings, 'data_encryption_previous_keys', [])
    secret = 'private-original-password'
    with monkeypatch.context() as prior:
        prior.setattr(settings, 'data_encryption_key', 'retired-key-' * 4)
        ciphertext = encrypt_secret(secret)
    legacy_id = await saved_credential(ids, ciphertext)
    path = f"projects/{ids['project']}/credentials"
    healthy = await client.post(path, json={'username': 'current', 'password': 'readable'})
    assert healthy.status_code == 201
    response = await client.get(path)
    assert response.status_code == 200, response.text
    by_id = {row['id']: row for row in response.json()}
    assert by_id[legacy_id]['password'] is None and by_id[legacy_id]['password_available'] is False
    assert by_id[legacy_id]['username'] == 'legacy-user'
    assert by_id[healthy.json()['id']]['password'] == 'readable'
    assert by_id[healthy.json()['id']]['password_available'] is True
    assert await ciphertext_for(legacy_id) == ciphertext
    assert secret not in caplog.text and ciphertext not in caplog.text
    assert 'credential_decryption_failed' in caplog.text
    # Метаданные можно править без уничтожения старого пароля.
    changed = await client.put(f'{path}/{legacy_id}', json={'host': 'changed.internal'})
    assert changed.status_code == 200 and changed.json()['password_available'] is False
    assert await ciphertext_for(legacy_id) == ciphertext
    # Возвращение ключа восстанавливает чтение без перезаписи записи.
    monkeypatch.setattr(settings, 'data_encryption_previous_keys', ['retired-key-' * 4])
    restored = await client.get(path)
    assert restored.json()[0]['password'] == secret
    assert await ciphertext_for(legacy_id) == ciphertext
    monkeypatch.setattr(settings, 'data_encryption_previous_keys', [])
    replaced = await client.put(f'{path}/{legacy_id}', json={'password': 'replacement'})
    assert replaced.status_code == 200 and replaced.json()['password'] == 'replacement'
    assert replaced.json()['password_available'] is True
    assert await ciphertext_for(legacy_id) != ciphertext
    assert (await client.delete(f'{path}/{legacy_id}')).status_code == 204


@pytest.mark.parametrize('kind', ['pp', 'szi'])
async def test_report_refuses_to_export_unreadable_password(api, kind):
    client, ids = api
    await saved_credential(ids, 'corrupt-ciphertext')
    response = await client.post(f"projects/{ids['project']}/reports/{kind}")
    assert response.status_code == 503, response.text
    assert response.json()['code'] == 'secret_decryption_failed'
    assert 'corrupt-ciphertext' not in response.text


@pytest.mark.parametrize('enabled', [False, True])
async def test_unreadable_totp_never_issues_session_or_enables_2fa(api, enabled):
    client, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        user = await db.get(User, ids['admin'])
        user.totp_enabled = enabled
        user.totp_secret = 'unreadable-secret'
        await db.commit()
    if enabled:
        client.cookies.clear()
        client.cookies.set('twofa_token', create_2fa_pending_token(ids['admin']))
        response = await client.post('auth/2fa/verify', json={'code': '123456'})
    else:
        response = await client.post('users/me/2fa/confirm', json={'code': '123456'})
    assert response.status_code == 503, response.text
    assert response.json()['code'] == 'secret_decryption_failed'
    assert 'access_token' not in response.headers.get('set-cookie', '')
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert (await db.get(User, ids['admin'])).totp_enabled is enabled
        assert await db.scalar(select(RefreshToken.id).where(RefreshToken.user_id == ids['admin'])) is None


async def test_restored_previous_key_allows_valid_2fa_without_rewriting_secret(api, monkeypatch):
    import pyotp
    client, ids = api
    settings = get_settings()
    monkeypatch.setattr(settings, 'data_encryption_key', 'active-data-key-' * 4)
    monkeypatch.setattr(settings, 'data_encryption_previous_keys', ['retired-data-key-' * 4])
    totp = pyotp.random_base32()
    with monkeypatch.context() as prior:
        prior.setattr(settings, 'data_encryption_key', 'retired-data-key-' * 4)
        ciphertext = encrypt_secret(totp)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        user = await db.get(User, ids['admin'])
        user.totp_enabled = True
        user.totp_secret = ciphertext
        await db.commit()
    client.cookies.clear()
    client.cookies.set('twofa_token', create_2fa_pending_token(ids['admin']))
    response = await client.post('auth/2fa/verify', json={'code': pyotp.TOTP(totp).now()})
    assert response.status_code == 200, response.text
    assert 'access_token' in response.headers.get('set-cookie', '')
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert (await db.get(User, ids['admin'])).totp_secret == ciphertext
        assert await db.scalar(select(RefreshToken.id).where(RefreshToken.user_id == ids['admin'])) is not None
