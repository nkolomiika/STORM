"""SMTP и очередь замоканы; реальные API, воркер и PostgreSQL сохраняют статусы."""
from contextlib import aclosing
from unittest.mock import AsyncMock

import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import async_sessionmaker
from app.config import get_settings
from app.database import get_db
from app.main import app
from app.models import MailJob
from app.services import UserService
from app.worker import mail_worker

pytestmark = pytest.mark.asyncio


@pytest.mark.parametrize('error,code', [(ConnectionRefusedError('SMTP connection refused password=raw-secret'), 'mail_unavailable'),
                                        (RuntimeError('SMTPAuthenticationError 535 password=raw-secret'), 'mail_auth_failed')])
async def test_mail_failure_is_visible_without_diagnostics_and_clears_after_retry(api, monkeypatch, error, code):
    client, _ = api
    monkeypatch.setattr(get_settings(), 'mail_enabled', True)
    monkeypatch.setattr(UserService, '_publish_mail_job', AsyncMock())
    result = await client.post('users/invitations', json={'email':'recipient@example.com'})
    assert result.status_code == 201, result.text
    invitation_id = result.json()['invitation']['id']
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        job = await db.scalar(select(MailJob))
        job_id = job.id
        sessions = async_sessionmaker(db.bind, expire_on_commit=False)
    monkeypatch.setattr(mail_worker, 'SessionLocal', sessions)
    send = AsyncMock(side_effect=error)
    monkeypatch.setattr(mail_worker, 'send_plain_text_email', send)
    await mail_worker.process_mail_job(job_id)
    result = await client.get('users/invitations')
    assert result.status_code == 200, result.text
    invitation = next(item for item in result.json() if item['id'] == invitation_id)
    assert invitation['email_error_code'] == code and invitation['email_status'] in ('pending', 'failed')
    assert invitation['email_error'] and 'raw-secret' not in result.text and 'SMTPAuthenticationError' not in result.text
    assert 'payload' not in invitation and 'last_error' not in invitation
    send.side_effect = None
    await mail_worker.process_mail_job(job_id)
    invitation = (await client.get('users/invitations')).json()[0]
    assert invitation['email_status'] == 'sent' and invitation['email_error'] is None
    assert invitation['email_error_code'] is None


async def test_latest_retry_controls_delivery_state_instead_of_old_failed_job(api, monkeypatch):
    client, _ = api
    monkeypatch.setattr(get_settings(), 'mail_enabled', True)
    monkeypatch.setattr(UserService, '_publish_mail_job', AsyncMock())
    response = await client.post('users/invitations', json={'email':'recipient@example.com'})
    assert response.status_code == 201, response.text
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        old = await db.scalar(select(MailJob))
        old.status = 'failed'
        old.last_error = 'raw old diagnostic'
        await db.commit()
    response = await client.post(f"users/invitations/{response.json()['invitation']['id']}/resend")
    assert response.status_code == 200, response.text
    current = (await client.get('users/invitations')).json()[0]
    assert current['email_error'] is None
