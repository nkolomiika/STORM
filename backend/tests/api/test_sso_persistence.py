"""SSO callback сохраняет пользователя/сессию в PostgreSQL и выдаёт его Users API."""
from contextlib import aclosing
from unittest.mock import AsyncMock
from urllib.parse import parse_qs, urlsplit

import pytest
from sqlalchemy import func, select

from app.config import get_settings
from app.database import get_db
from app.main import app
from app.models import RefreshToken, User
from app.oidc import OidcClient, OidcIdentity
from app.security import create_access_token
from app.services import AuthService

pytestmark = pytest.mark.asyncio


def identity_provider(monkeypatch):
    settings = get_settings()
    for key, value in {'sso_enabled': True, 'sso_client_id': 'test-client',
                       'sso_issuer': 'https://idp.example/realm', 'sso_metadata_url': '',
                       'sso_auto_create_users': True, 'sso_default_role': 'pentester',
                       'app_base_url': 'https://test.local', 'sso_redirect_base': '',
                       'sso_callback_path': '/auth/callback', 'cookie_secure': True}.items():
        monkeypatch.setattr(settings, key, value)
    monkeypatch.setattr(OidcClient, '_metadata', AsyncMock(return_value={
        'authorization_endpoint': 'https://idp.example/authorize'}))
    exchange = AsyncMock(return_value=OidcIdentity(
        subject='idp-user-123', email='sso-user@example.com', username='sso.user',
        full_name='SSO Test User', email_verified=True))
    monkeypatch.setattr(OidcClient, 'exchange_code', exchange)
    return exchange


async def browser_login(client):
    start = await client.get('auth/sso/login')
    assert start.status_code == 303
    state = parse_qs(urlsplit(start.headers['location']).query)['state'][0]
    return await client.get('https://test.local/auth/callback', params={'state': state, 'code': 'test-code'})


async def test_successful_sso_user_is_committed_listed_and_searchable_without_duplicates(api, monkeypatch):
    client, ids = api
    identity_provider(monkeypatch)
    seen = []
    for _ in range(2):
        response = await browser_login(client)
        assert response.status_code == 303 and response.headers['location'] == 'https://test.local/projects'
        me = await client.get('users/me')
        assert me.status_code == 200, me.text
        user = me.json()
        assert user['username'] == 'sso.user' and user['full_name'] == 'SSO Test User'
        assert user['is_sso'] is True and user['role'] == 'pentester' and user['is_active'] is True
        seen.append(user['id'])
        search = await client.get('users/search', params={'q': 'SSO Test'})
        assert search.status_code == 200
        assert any(item['username'] == 'sso.user' for item in search.json())
    assert seen[0] == seen[1] and seen[0] != ids['admin']
    users = await client.get('users', headers={'Cookie': 'access_token='+create_access_token(ids['admin'])})
    assert users.status_code == 200, users.text
    assert sum(item['id'] == seen[0] for item in users.json()['items']) == 1
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(func.count()).select_from(User).where(User.email == 'sso-user@example.com')) == 1
        assert await db.scalar(select(func.count()).select_from(RefreshToken).where(RefreshToken.user_id == seen[0])) == 2


async def test_failed_sso_session_does_not_commit_a_half_created_user(api, monkeypatch):
    client, _ = api
    identity_provider(monkeypatch)
    monkeypatch.setattr(AuthService, '_issue_session', AsyncMock(side_effect=RuntimeError('session failure')))
    response = await browser_login(client)
    assert response.status_code == 303 and response.headers['location'].endswith('/login?sso_error=failed')
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(func.count()).select_from(User).where(User.email == 'sso-user@example.com')) == 0


@pytest.mark.parametrize('email', ['not-an-email', 'user@localhost', 'user@example.test', 'x'*256+'@example.com'])
async def test_invalid_idp_email_cannot_poison_users_list(api, monkeypatch, email):
    client, ids = api
    exchange = identity_provider(monkeypatch)
    exchange.return_value = OidcIdentity(subject='invalid-email-user', email=email,
        username='invalid.email.user', full_name='Invalid Email User', email_verified=True)
    response = await browser_login(client)
    assert response.status_code == 303 and response.headers['location'].endswith('/login?sso_error=denied')
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(func.count()).select_from(User).where(User.username == 'invalid.email.user')) == 0
    response = await client.get('users', headers={'Cookie': 'access_token='+create_access_token(ids['admin'])})
    assert response.status_code == 200
