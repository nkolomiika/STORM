"""Public one-time links, password/2FA sessions and invitation management.

Only PostgreSQL is real. Mail delivery and queue publishing are mocked.
"""
import asyncio
from contextlib import aclosing
from datetime import UTC, datetime, timedelta
from unittest.mock import AsyncMock

import pytest
from sqlalchemy import func, select

from app.config import get_settings
from app.database import get_db
from app.main import app
from app.models import AccountReactivationToken, Invitation, MailJob, PasswordResetToken, RefreshToken, User
from app.security import hash_invitation_token, hash_password_reset_token, hash_reactivation_token, verify_password
from app.services import UserService

pytestmark = pytest.mark.asyncio


async def seed_link(api, kind, state="valid"):
    _, ids = api
    raw = "test-only-link-token"
    now = datetime.now(UTC)
    expires = now + timedelta(hours=1) if state != "expired" else now - timedelta(hours=1)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        if kind == "invitations":
            row = Invitation(email="invited@example.com", invited_by=ids["admin"], token_hash=hash_invitation_token(raw), expires_at=expires, status="accepted" if state == "used" else "pending")
        else:
            cls, digest = (PasswordResetToken, hash_password_reset_token) if kind == "password-reset" else (AccountReactivationToken, hash_reactivation_token)
            row = cls(user_id=ids["outsider"], token_hash=digest(raw), expires_at=expires, used_at=now if state == "used" else None)
            if kind == "reactivate":
                (await db.get(User, ids["outsider"])).is_locked = True
        if state != "missing":
            db.add(row)
        await db.commit()
    return raw


def submission(kind):
    if kind == "invitations":
        return "/accept", {"username": "Invited User", "password": "new-password-123"}
    return "", {"password": "new-password-123"} if kind == "password-reset" else {}


@pytest.mark.parametrize("kind", ["invitations", "password-reset", "reactivate"])
@pytest.mark.parametrize("state", ["missing", "expired", "used"])
async def test_invalid_public_link_cannot_mutate_account(api, kind, state):
    client, _ = api
    raw = await seed_link(api, kind, state)
    client.cookies.clear()
    url = f"auth/{kind}/{raw}"
    info = await client.get(url)
    assert info.status_code == 200 and info.json()["valid"] is False
    assert info.json()["reason"] == ("not_found" if state == "missing" else state)
    suffix, payload = submission(kind)
    denied = await client.post(url + suffix, json=payload)
    assert denied.status_code == 401, denied.text


@pytest.mark.parametrize("kind", ["invitations", "password-reset", "reactivate"])
async def test_public_link_is_consumed_exactly_once(api, kind):
    client, ids = api
    raw = await seed_link(api, kind)
    client.cookies.clear()
    url = f"auth/{kind}/{raw}"
    assert (await client.get(url)).json()["valid"] is True
    suffix, payload = submission(kind)
    result = await client.post(url + suffix, json=payload)
    assert result.status_code == {"invitations": 201, "password-reset": 204, "reactivate": 200}[kind], result.text
    assert (await client.get(url)).json()["reason"] == "used"
    assert (await client.post(url + suffix, json=payload)).status_code == 401
    if kind != "password-reset":
        assert (await client.get("users/me")).status_code == 200
    else:
        assert (await client.get("users/me")).status_code == 401
        async with aclosing(app.dependency_overrides[get_db]()) as stream:
            db = await anext(stream)
            user = await db.get(User, ids["outsider"])
            assert verify_password("new-password-123", user.password_hash)


@pytest.mark.parametrize("kind", ["invitations", "password-reset", "reactivate"])
async def test_parallel_submissions_cannot_reuse_one_time_link(api, kind):
    client, _ = api
    raw = await seed_link(api, kind)
    client.cookies.clear()
    suffix, payload = submission(kind)
    url = f"auth/{kind}/{raw}{suffix}"
    results = await asyncio.gather(client.post(url, json=payload), client.post(url, json=payload))
    success = {"invitations": 201, "password-reset": 204, "reactivate": 200}[kind]
    assert sorted(r.status_code for r in results) == sorted([success, 401]), [r.text for r in results]


async def test_invitation_availability_revoke_and_list(api):
    client, _ = api
    raw = await seed_link(api, "invitations")
    url = f"auth/invitations/{raw}/username-available"
    assert (await client.get(url, params={"username": "tester"})).json() == {"available": False}
    assert (await client.get(url, params={"username": "New User"})).json() == {"available": True}
    listed = await client.get("users/invitations")
    assert listed.status_code == 200 and len(listed.json()) == 1
    invite_id = listed.json()[0]["id"]
    assert (await client.delete(f"users/invitations/{invite_id}")).status_code == 204
    assert (await client.get(f"auth/invitations/{raw}")).json()["valid"] is False
    assert (await client.get(url, params={"username": "New User"})).status_code == 401
    assert (await client.get("users/invitations")).json() == []


async def test_create_and_resend_invitation_enqueue_mail_without_external_delivery(api, monkeypatch):
    client, _ = api
    monkeypatch.setattr(get_settings(), "mail_enabled", True)
    publish = AsyncMock()
    monkeypatch.setattr(UserService, "_publish_mail_job", publish)
    created = await client.post("users/invitations", json={"email": "fresh@example.com"})
    assert created.status_code == 201, created.text
    invite_id = created.json()["invitation"]["id"]
    sent = await client.post(f"users/invitations/{invite_id}/resend")
    assert sent.status_code == 200, sent.text
    assert publish.await_count == 2
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(func.count()).select_from(MailJob)) == 2
        assert await db.scalar(select(func.count()).select_from(User).where(User.email == "fresh@example.com")) == 0


async def test_password_reset_request_does_not_reveal_unknown_email(api, monkeypatch):
    client, ids = api
    monkeypatch.setattr(get_settings(), "mail_enabled", True)
    publish = AsyncMock()
    monkeypatch.setattr(UserService, "_publish_mail_job", publish)
    known = await client.post("auth/password-reset/request", json={"email": "tester@example.com"})
    unknown = await client.post("auth/password-reset/request", json={"email": "missing@example.com"})
    assert known.status_code == unknown.status_code == 200
    assert known.json() == unknown.json()
    publish.assert_awaited_once()
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(func.count()).select_from(PasswordResetToken).where(PasswordResetToken.user_id == ids["admin"])) == 1
