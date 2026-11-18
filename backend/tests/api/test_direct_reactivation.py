"""Административная разблокировка не зависит от почты и сохраняет аккаунт."""
from contextlib import aclosing
from datetime import UTC, datetime, timedelta
from unittest.mock import AsyncMock

import pytest
from sqlalchemy import func, select

from app.database import get_db
from app.main import app
from app.models import AccountReactivationToken, AuditLog, MailJob, ProjectMember, User
from app.security import create_access_token, hash_password, hash_reactivation_token
from app.services import UserService

pytestmark = pytest.mark.asyncio


async def test_unblock_immediately_allows_login_without_email(api, monkeypatch):
    client, ids = api
    publish = AsyncMock(side_effect=AssertionError('Unblock must never send email'))
    monkeypatch.setattr(UserService, '_publish_mail_job', publish)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        user = await db.get(User, ids['outsider'])
        user.is_locked = True
        user.password_hash = hash_password('existing-password')
        db.add(ProjectMember(project_id=ids['project'], user_id=user.id))
        old_link = AccountReactivationToken(user_id=user.id, token_hash=hash_reactivation_token('old-test-link'), expires_at=datetime.now(UTC)+timedelta(hours=1))
        db.add(old_link)
        await db.commit()
        password_before = user.password_hash
        token_id = old_link.id
    blocked = await client.post('auth/login', json={'username': 'outsider', 'password': 'existing-password'})
    assert blocked.status_code == 401
    response = await client.post(f"users/{ids['outsider']}/reactivate")
    assert response.status_code == 200, response.text
    assert response.json()['is_locked'] is False and response.json()['is_active'] is True
    assert 'email_sent_to' not in response.json()
    assert 'set-cookie' not in response.headers
    publish.assert_not_awaited()
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(func.count()).select_from(MailJob)) == 0
        assert await db.scalar(select(func.count()).select_from(AccountReactivationToken)) == 1
        assert (await db.get(AccountReactivationToken, token_id)).used_at is not None
        assert (await db.get(User, ids['outsider'])).password_hash == password_before
        assert await db.scalar(select(ProjectMember.id).where(ProjectMember.user_id == ids['outsider']))
        assert await db.scalar(select(AuditLog.id).where(AuditLog.entity_type == 'user_reactivated'))
    logged_in = await client.post('auth/login', json={'username': 'outsider', 'password': 'existing-password'})
    assert logged_in.status_code == 200, logged_in.text
    assert (await client.get('users/me')).json()['id'] == ids['outsider']


async def test_non_admin_cannot_unblock_user(api):
    client, ids = api
    client.cookies.set('access_token', create_access_token(ids['outsider']))
    response = await client.post(f"users/{ids['admin']}/reactivate")
    assert response.status_code == 403
