"""Confirmed review defects: real PostgreSQL, no external integrations."""
from contextlib import aclosing
from unittest.mock import AsyncMock

import pytest
from sqlalchemy import event, func, select

from app.database import get_db
from app.main import app
from app.models import AgentApiToken, AuditLog, Host, Notification, ProjectNote, RefreshToken, User, Vulnerability
from app.services import AuditService
from app.ws_manager import ws_manager

pytestmark = pytest.mark.asyncio


@pytest.mark.parametrize("field,value", [("is_active", False), ("is_locked", True)])
async def test_agent_token_of_disabled_owner_cannot_read_or_write(api, field, value):
    client, ids = api
    issued = await client.post("agent-tokens", json={"name": "Owner status", "scopes": ["projects:read", "notes:write"], "all_projects": True})
    assert issued.status_code == 201, issued.text
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        owner = await db.get(User, ids["admin"])
        setattr(owner, field, value)
        await db.commit()
    headers = {"Authorization": "Bearer " + issued.json()["token"]}
    assert (await client.get("https://test.local/api/v2/projects", headers=headers)).status_code == 401
    assert (await client.post(f"https://test.local/api/v2/projects/{ids['project']}/notes", headers=headers, json={"title": "Forbidden"})).status_code == 401
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert (await db.get(AgentApiToken, issued.json()["id"])).last_used_at is None
        assert await db.scalar(select(func.count()).select_from(ProjectNote)) == 0


async def test_host_null_notes_clear_and_missing_notes_preserve(api):
    client, ids = api
    url = f"projects/{ids['project']}/hosts/{ids['host']}"
    assert (await client.put(url, json={"notes": "Original"})).status_code == 200
    unchanged = await client.put(url, json={"hostname": "renamed.example"})
    assert unchanged.status_code == 200 and unchanged.json()["notes"] == "Original"
    cleared = await client.put(url, json={"notes": None})
    assert cleared.status_code == 200 and cleared.json()["notes"] is None
    assert (await client.get(url)).json()["notes"] is None


async def test_project_host_count_excludes_ip_origin_rows(api):
    client, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        db.add(Host(project_id=ids["project"], origin="ip", ip_address="192.0.2.2"))
        await db.commit()
    stats = (await client.get("projects/stats")).json()
    current = next(item for item in stats if item["project_id"] == ids["project"])
    assert current["hosts_count"] == 1


@pytest.mark.parametrize("nested", [False, True])
async def test_note_delete_conflict_is_409_and_preserves_entire_tree(api, nested):
    client, ids = api
    url = f"projects/{ids['project']}/notes"
    async def create(title, parent=None):
        response = await client.post(url, json={"title": title, "parent_id": parent, "content": title + " content"})
        assert response.status_code == 201, response.text
        return response.json()["id"]
    parent = await create("Parent") if nested else None
    sibling = await create("Report", parent)
    folder = await create("Folder", parent)
    child = await create("Report", folder)
    grandchild = await create("Details", child)
    response = await client.delete(f"{url}/{folder}")
    assert response.status_code == 409, response.text
    rows = {row["id"]: row for row in (await client.get(url)).json()}
    assert rows[child]["parent_id"] == folder
    assert rows[grandchild]["parent_id"] == child
    assert rows[sibling]["content"] == "Report content"
    assert rows[folder]["parent_id"] == parent


async def test_note_delete_promotes_children_when_names_do_not_conflict(api):
    client, ids = api
    url = f"projects/{ids['project']}/notes"
    parent = (await client.post(url, json={"title": "Parent"})).json()["id"]
    folder = (await client.post(url, json={"title": "Folder", "parent_id": parent})).json()["id"]
    child = (await client.post(url, json={"title": "Child", "parent_id": folder})).json()["id"]
    response = await client.delete(f"{url}/{folder}")
    assert response.status_code == 204, response.text
    rows = {row["id"]: row for row in (await client.get(url)).json()}
    assert folder not in rows and rows[child]["parent_id"] == parent


@pytest.mark.parametrize("resource,payload", [
    ("projects", {"name": "Must roll back"}),
    ("projects/{project}/hosts", {"hostname": "rollback.example"}),
    ("projects/{project}/hosts/{host}/ports", {"ip_address_id": "IP", "port_number": 3333}),
    ("projects/{project}/hosts/{host}/ports/{port}/services", {"name": "rollback"}),
    ("projects/{project}/hosts/{host}/endpoints", {"path": "/rollback", "method": "GET"}),
    ("projects/{project}/notes", {"title": "Must roll back"}),
    ("projects/{project}/credentials", {"password": "test-only"}),
    ("projects/{project}/vulnerabilities", {"title": "Must roll back", "host_id": "HOST"}),
])
async def test_create_does_not_persist_when_audit_fails(api, monkeypatch, resource, payload):
    client, ids = api
    url = resource.format(**ids)
    before = (await client.get(url)).json()
    def items(value):
        return value.get("items", []) if isinstance(value, dict) else value
    async def fail(*args, **kwargs):
        raise RuntimeError("Audit unavailable")
    monkeypatch.setattr(AuditService, "log", fail)
    broadcast = AsyncMock()
    monkeypatch.setattr(ws_manager, "broadcast", broadcast)
    monkeypatch.setattr(ws_manager, "broadcast_projects_index", broadcast)
    payload = {k: ids["ip"] if v == "IP" else ids["host"] if v == "HOST" else v for k, v in payload.items()}
    response = await client.post(url, json=payload)
    assert response.status_code == 500
    after = (await client.get(url)).json()
    assert items(after) == items(before), "Failed writes must not leave a committed entity"
    broadcast.assert_not_awaited()


@pytest.mark.parametrize("method,payload", [("PUT", {"hostname": "must-not-change.example"}), ("DELETE", None)])
async def test_host_mutation_rolls_back_when_audit_fails(api, monkeypatch, method, payload):
    client, ids = api
    url = f"projects/{ids['project']}/hosts/{ids['host']}"
    before = (await client.get(url)).json()
    async def fail(*args, **kwargs):
        raise RuntimeError("Audit unavailable")
    monkeypatch.setattr(AuditService, "log", fail)
    response = await client.request(method, url, json=payload)
    assert response.status_code == 500
    after = await client.get(url)
    assert after.status_code == 200 and after.json() == before


async def test_actual_audit_insert_failure_rolls_back_host(api):
    client, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        engine = db.bind.sync_engine
        def fail_audit(conn, cursor, statement, parameters, context, executemany):
            if statement.startswith("INSERT INTO audit_logs"):
                raise RuntimeError("Audit storage unavailable")
        event.listen(engine, "before_cursor_execute", fail_audit)
        try:
            response = await client.post(f"projects/{ids['project']}/hosts", json={"hostname": "rollback-real.example"})
        finally:
            event.remove(engine, "before_cursor_execute", fail_audit)
        assert response.status_code == 500
        assert await db.scalar(select(Host.id).where(Host.hostname == "rollback-real.example")) is None


async def test_second_status_audit_failure_does_not_commit_first_audit_or_status(api, monkeypatch):
    client, ids = api
    original = AuditService.log
    async def fail_second(self, action, **kwargs):
        if action == "STATUS_CHANGE":
            raise RuntimeError("Second audit failed")
        await original(self, action, **kwargs)
    monkeypatch.setattr(AuditService, "log", fail_second)
    url = f"projects/{ids['project']}"
    before = (await client.get(url)).json()
    response = await client.put(url, json={"status": "freeze"})
    assert response.status_code == 500
    assert (await client.get(url)).json() == before
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(func.count()).select_from(AuditLog).where(AuditLog.entity_id == ids["project"], AuditLog.entity_type == "project")) == 0


@pytest.mark.parametrize("kind", ["vulnerabilities", "notes"])
async def test_failed_comment_audit_does_not_leave_mentions_or_send_notifications(api, monkeypatch, kind):
    client, ids = api
    assert (await client.post(f"projects/{ids['project']}/members", json={"user_id": ids["outsider"]})).status_code == 201
    body = {"title": "Discussion"}
    if kind == "vulnerabilities":
        body["host_id"] = ids["host"]
    item = await client.post(f"projects/{ids['project']}/{kind}", json=body)
    assert item.status_code == 201, item.text
    url = f"projects/{ids['project']}/{kind}/{item.json()['id']}/comments"
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        before_count = await db.scalar(select(func.count()).select_from(Notification))
    async def fail(*args, **kwargs):
        raise RuntimeError("Audit unavailable")
    monkeypatch.setattr(AuditService, "log", fail)
    notify = AsyncMock()
    monkeypatch.setattr(ws_manager, "notify_user", notify)
    result = await client.post(url, json={"content": "@outsider please check"})
    assert result.status_code == 500
    assert (await client.get(url)).json()["total"] == 0
    notify.assert_not_awaited()
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(func.count()).select_from(Notification)) == before_count


async def test_failed_login_audit_does_not_leave_a_refresh_session(api, monkeypatch):
    client, _ = api
    client.cookies.clear()
    async def fail(*args, **kwargs):
        raise RuntimeError("Audit unavailable")
    monkeypatch.setattr(AuditService, "log", fail)
    response = await client.post("auth/login", json={"username": "tester", "password": "test-password"})
    assert response.status_code == 500
    assert "set-cookie" not in response.headers
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(func.count()).select_from(RefreshToken)) == 0


async def test_failed_import_audit_rolls_back_imported_hosts(api, monkeypatch):
    client, ids = api
    async def fail(*args, **kwargs):
        raise RuntimeError("Audit unavailable")
    monkeypatch.setattr(AuditService, "log", fail)
    content = b'{"hosts":[{"hostname":"rollback-import.example"}]}'
    response = await client.post(f"projects/{ids['project']}/import", files={"file": ("assets.json", content, "application/json")})
    assert response.status_code == 500
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(Host.id).where(Host.hostname == "rollback-import.example")) is None


async def test_finding_pages_with_identical_timestamps_are_stably_ordered(api):
    from datetime import UTC, datetime
    client, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        timestamp = datetime(2026, 1, 1, tzinfo=UTC)
        db.add_all([Vulnerability(project_id=ids["project"], created_by=ids["admin"], title=f"Finding {i}", created_at=timestamp) for i in range(237)])
        await db.commit()
    items = []
    for page in (1, 2, 3):
        response = await client.get(f"projects/{ids['project']}/vulnerabilities", params={"page": page, "size": 100})
        assert response.status_code == 200
        assert response.json()["total"] == 237
        items.extend(response.json()["items"])
    keys = [item["id"] for item in items]
    assert len(keys) == len(set(keys)) == 237
    assert keys == sorted(keys, reverse=True)
