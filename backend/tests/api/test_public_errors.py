"""Пользовательские ответы и технические логи проверяются раздельно."""
from contextlib import aclosing
from unittest.mock import AsyncMock
import logging

import pytest
from sqlalchemy import func, select
from app.config import get_settings
from app.database import get_db
from app.main import app
from app.models import Invitation, MailJob
from app.observability import configure_logging
from app.services import ProjectService

pytestmark = pytest.mark.asyncio


@pytest.mark.parametrize('enabled,host', [(False, 'mail.test'), (True, ''), (True, '  ')])
async def test_unconfigured_mail_is_friendly_and_creates_no_invitation(api, monkeypatch, enabled, host):
    client, _ = api
    monkeypatch.setattr(get_settings(), 'mail_enabled', enabled)
    monkeypatch.setattr(get_settings(), 'smtp_host', host)
    response = await client.post('users/invitations', json={'email':'new@example.com'})
    assert response.status_code == 503, response.text
    assert response.json() == {'detail':'Отправка писем пока не настроена. Обратитесь к администратору.', 'code':'mail_not_configured', 'request_id': response.headers['x-request-id']}
    assert response.headers['x-request-id']
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        for model in (Invitation, MailJob):
            assert await db.scalar(select(func.count()).select_from(model)) == 0


async def test_reset_with_disabled_mail_does_not_disclose_account_existence(api):
    client, _ = api
    known = await client.post('auth/password-reset/request', json={'email':'tester@example.com'})
    unknown = await client.post('auth/password-reset/request', json={'email':'unknown@example.com'})
    assert known.status_code == unknown.status_code == 503
    assert {k:v for k,v in known.json().items() if k != 'request_id'} == {k:v for k,v in unknown.json().items() if k != 'request_id'}


async def test_unexpected_error_is_safe_and_correlated_with_debug_log(api, monkeypatch, caplog):
    client, _ = api
    configure_logging()
    caplog.set_level(logging.INFO)
    monkeypatch.setattr(ProjectService, 'list_projects', AsyncMock(side_effect=RuntimeError('asyncpg failure password=raw-secret')))
    response = await client.get('projects')
    assert response.status_code == 500, response.text
    data = response.json()
    assert data['code'] == 'internal_error'
    assert data['request_id'] == response.headers['x-request-id']
    assert 'asyncpg' not in response.text and 'raw-secret' not in response.text
    assert data['request_id'] in caplog.text
    assert 'RuntimeError' in caplog.text and 'raw-secret' not in caplog.text
    assert 'route=/projects' in caplog.text and 'duration_ms=' in caplog.text


async def test_validation_does_not_echo_password_or_raw_pydantic_diagnostics(api):
    client, _ = api
    response = await client.post('auth/login', json={'username':[], 'password':{'secret':'do-not-echo'}})
    assert response.status_code == 422
    assert 'do-not-echo' not in response.text and 'Input should' not in response.text
    assert 'Введите текст' in response.json()['detail']
