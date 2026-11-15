"""Project creation must persist creator membership in the same transaction."""
from contextlib import aclosing
from unittest.mock import AsyncMock

import pytest
from sqlalchemy import event, func, select

from app.database import get_db
from app.enums import UserRole
from app.main import app
from app.models import AuditLog, Notification, Project, ProjectMember, User
from app.security import create_access_token
from app.services import AuditService
from app.ws_manager import ws_manager

pytestmark = pytest.mark.asyncio


async def test_project_creation_adds_creator_as_only_member(api):
    client, ids = api
    created = await client.post("projects", json={"name": "Creator is a member", "appsec_ticket_key": "APPSEC-1"})
    assert created.status_code == 201, created.text
    project_id = created.json()["id"]
    assert created.json()["created_by"] == ids["admin"]

    members = await client.get(f"projects/{project_id}/members")
    assert members.status_code == 200, members.text
    assert [member["user_id"] for member in members.json()] == [ids["admin"]]
    duplicate = await client.post(f"projects/{project_id}/members", json={"user_id": ids["admin"]})
    assert duplicate.status_code == 409, duplicate.text

    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(func.count()).select_from(ProjectMember).where(
            ProjectMember.project_id == project_id, ProjectMember.user_id == ids["admin"]
        )) == 1
        assert await db.scalar(select(func.count()).select_from(Notification)) == 0


async def test_project_creator_keeps_access_without_admin_role(api):
    client, ids = api
    created = await client.post("projects", json={"name": "Membership grants access", "appsec_ticket_key": "APPSEC-1"})
    assert created.status_code == 201, created.text
    project_id = created.json()["id"]
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        (await db.get(User, ids["admin"])).role = UserRole.PENTESTER
        await db.commit()

    listing = await client.get("projects")
    assert listing.status_code == 200, listing.text
    assert {project["id"] for project in listing.json()["items"]} == {project_id}
    stats = await client.get("projects/stats")
    assert stats.status_code == 200, stats.text
    assert {row["project_id"] for row in stats.json()} == {project_id}
    assert (await client.get(f"projects/{project_id}")).status_code == 200
    members = await client.get(f"projects/{project_id}/members")
    assert members.status_code == 200
    assert [member["user_id"] for member in members.json()] == [ids["admin"]]

    client.cookies.clear()
    client.cookies.set("access_token", create_access_token(ids["outsider"]))
    assert (await client.get(f"projects/{project_id}")).status_code == 403
    assert (await client.get("projects")).json()["items"] == []


@pytest.mark.parametrize("failure", ["membership", "audit"])
async def test_project_and_creator_membership_roll_back_together(api, monkeypatch, failure):
    client, _ = api
    broadcast = AsyncMock()
    monkeypatch.setattr(ws_manager, "broadcast_projects_index", broadcast)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        models = (Project, ProjectMember, AuditLog)
        before = [await db.scalar(select(func.count()).select_from(model)) for model in models]
        engine = db.bind.sync_engine

        def fail_membership(conn, cursor, statement, parameters, context, executemany):
            if statement.startswith("INSERT INTO project_members"):
                raise RuntimeError("Membership storage unavailable")

        async def fail_audit(*args, **kwargs):
            raise RuntimeError("Audit storage unavailable")

        if failure == "membership":
            event.listen(engine, "before_cursor_execute", fail_membership)
        else:
            monkeypatch.setattr(AuditService, "log", fail_audit)
        try:
            response = await client.post("projects", json={"name": "Must roll back with membership", "appsec_ticket_key": "APPSEC-1"})
        finally:
            if failure == "membership":
                event.remove(engine, "before_cursor_execute", fail_membership)
        assert response.status_code == 500, response.text
        after = [await db.scalar(select(func.count()).select_from(model)) for model in models]
        assert after == before
        broadcast.assert_not_awaited()
