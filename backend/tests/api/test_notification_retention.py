"""Семь суток хранения: HTTP, счётчик, пакетное удаление и новые находки."""
import asyncio
from contextlib import aclosing
from datetime import UTC, datetime, timedelta
from unittest.mock import AsyncMock

import pytest
from sqlalchemy import func, select

from app import notification_events
from app.database import get_db
from app.enums import NotificationType
from app.main import app
from app.models import Notification, ProjectMember, User, Vulnerability
from app.security import create_access_token
from app.services import AuditService
from app.ws_manager import ws_manager

pytestmark = pytest.mark.asyncio


async def test_retention_filters_pages_unread_and_read_actions_before_cleanup(api, monkeypatch):
    client, ids = api
    now = datetime(2026, 11, 18, 12, tzinfo=UTC)
    cutoff = now - timedelta(days=7)
    monkeypatch.setattr(notification_events, "notification_cutoff", lambda now=None: cutoff)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        old = Notification(user_id=ids["admin"], is_read=False, created_at=cutoff - timedelta(microseconds=1))
        boundary = Notification(user_id=ids["admin"], is_read=False, created_at=cutoff)
        recent_read = Notification(user_id=ids["admin"], is_read=True, created_at=cutoff + timedelta(days=1))
        recent = Notification(user_id=ids["admin"], is_read=False, created_at=cutoff + timedelta(days=1))
        foreign = Notification(user_id=ids["outsider"], created_at=cutoff + timedelta(days=1))
        db.add_all([old, boundary, recent_read, recent, foreign])
        await db.commit()
        old_id, foreign_id = old.id, foreign.id
        expected = [recent.id, recent_read.id, boundary.id]
    pages = [(await client.get("notifications", params={"page": page, "size": 1})).json() for page in (1, 2, 3, 4)]
    assert [row["id"] for page in pages for row in page["items"]] == expected
    assert all(page["total"] == 3 for page in pages)
    assert (await client.get("notifications", params={"is_read": False})).json()["total"] == 2
    assert (await client.get("notifications/unread-count")).json()["count"] == 2
    for item_id in (old_id, foreign_id):
        assert (await client.patch(f"notifications/{item_id}/read")).status_code == 404
    assert (await client.patch("notifications/read-all")).status_code == 204
    assert (await client.get("notifications/unread-count")).json()["count"] == 0
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert (await db.get(Notification, old_id)).is_read is False
        assert (await db.get(Notification, foreign_id)).is_read is False


async def test_cleanup_deletes_only_expired_rows_in_bounded_batches(api):
    _, ids = api
    now = datetime(2026, 11, 18, 12, tzinfo=UTC)
    cutoff = now - timedelta(days=7)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        expired = [Notification(user_id=user_id, is_read=read, created_at=cutoff - timedelta(seconds=1))
                   for user_id, read in [(ids["admin"], False), (ids["admin"], True), (ids["outsider"], False)]]
        boundary = Notification(user_id=ids["admin"], created_at=cutoff)
        db.add_all([*expired, boundary])
        await db.commit()
        boundary_id = boundary.id
        assert await notification_events.delete_expired_notifications(db, now, batch_size=2) == 2
        await db.commit()
        assert await db.scalar(select(func.count()).select_from(Notification)) == 2
        assert await notification_events.delete_expired_notifications(db, now, batch_size=2) == 1
        await db.commit()
        assert list(await db.scalars(select(Notification.id))) == [boundary_id]
        assert await notification_events.delete_expired_notifications(db, now) == 0


async def test_concurrent_cleanup_skips_locked_rows(api):
    _, ids = api
    now = datetime.now(UTC)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        db.add_all([Notification(user_id=ids["admin"], created_at=now-timedelta(days=8)) for _ in range(4)])
        db.add(Notification(user_id=ids["admin"], created_at=now))
        await db.commit()
    barrier = asyncio.Barrier(2)

    async def cleanup():
        async with aclosing(app.dependency_overrides[get_db]()) as stream:
            db = await anext(stream)
            deleted = await notification_events.delete_expired_notifications(db, now, batch_size=2)
            await barrier.wait()
            await db.commit()
            return deleted

    assert await asyncio.wait_for(asyncio.gather(cleanup(), cleanup()), timeout=10) == [2, 2]
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(func.count()).select_from(Notification)) == 1


async def add_member(api):
    client, ids = api
    result = await client.post(f"projects/{ids['project']}/members", json={"user_id": ids["outsider"]})
    assert result.status_code == 201


async def test_vulnerability_creation_notifies_only_active_project_members(api, monkeypatch):
    client, ids = api
    await add_member(api)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        db.add(ProjectMember(project_id=ids["project"], user_id=ids["admin"]))
        for username, member, flags in [("locked", True, {"is_locked": True}), ("inactive", True, {"is_active": False}), ("foreign", False, {})]:
            user = User(username=username, email=f"{username}@example.com", password_hash="unused", **flags)
            db.add(user)
            await db.flush()
            if member:
                db.add(ProjectMember(project_id=ids["project"], user_id=user.id))
        await db.commit()
    delivery = AsyncMock()
    monkeypatch.setattr(ws_manager, "notify_user", delivery)
    response = await client.post(f"projects/{ids['project']}/vulnerabilities", json={"title": "New finding", "host_id": ids["host"]})
    assert response.status_code == 201, response.text
    vuln_id = response.json()["id"]
    delivery.assert_awaited_once()
    assert delivery.await_args.args[0] == ids["outsider"]
    assert delivery.await_args.args[1]["data"]["type"] == "vuln_created"
    client.cookies.set("access_token", create_access_token(ids["outsider"]))
    events = (await client.get("notifications")).json()["items"]
    created = [row for row in events if row["type"] == "vuln_created"]
    assert len(created) == 1
    assert created[0]["context"]["vulnerability_id"] == vuln_id
    assert created[0]["context"]["vulnerability_title"] == "New finding"
    assert created[0]["context"]["commenter_username"] == "tester"
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(func.count()).select_from(Notification).where(Notification.type == NotificationType.VULN_CREATED)) == 1


async def test_creation_and_explicit_mention_are_distinct_notifications(api):
    client, ids = api
    await add_member(api)
    response = await client.post(f"projects/{ids['project']}/vulnerabilities", json={
        "title": "Tagged finding", "host_id": ids["host"], "description": "@outsider @outsider @tester review",
    })
    assert response.status_code == 201, response.text
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        events = list(await db.scalars(select(Notification).where(Notification.vulnerability_id == response.json()["id"])))
        assert sorted(row.type.value for row in events) == ["mention", "vuln_created"]
        assert {row.user_id for row in events} == {ids["outsider"]}


async def test_failed_creation_audit_rolls_back_both_notifications(api, monkeypatch):
    client, ids = api
    await add_member(api)
    delivery = AsyncMock()
    monkeypatch.setattr(ws_manager, "notify_user", delivery)

    async def fail(*args, **kwargs):
        raise RuntimeError("Audit unavailable")

    monkeypatch.setattr(AuditService, "log", fail)
    response = await client.post(f"projects/{ids['project']}/vulnerabilities", json={
        "title": "Rollback new finding", "host_id": ids["host"], "description": "@outsider review",
    })
    assert response.status_code == 500
    delivery.assert_not_awaited()
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(Vulnerability.id).where(Vulnerability.title == "Rollback new finding")) is None
        assert await db.scalar(select(func.count()).select_from(Notification).where(Notification.type.in_([NotificationType.MENTION, NotificationType.VULN_CREATED]))) == 0
