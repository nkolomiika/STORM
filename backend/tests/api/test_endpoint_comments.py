"""Обсуждение эндпоинта: реальное сохранение, доступ, пагинация и каскад."""
from contextlib import aclosing

import pytest
from sqlalchemy import func, select

from app.database import get_db
from app.main import app
from app.models import AuditLog, EndpointComment
from app.security import create_access_token
from test_query_scaling import count_queries

pytestmark = pytest.mark.asyncio


async def endpoint_path(api):
    client, ids = api
    host_path = f"projects/{ids['project']}/hosts/{ids['host']}/endpoints"
    response = await client.post(host_path, json={"path": "/discussion", "method": "GET"})
    assert response.status_code == 201, response.text
    return f"{host_path}/{response.json()['id']}", response.json()["id"]


async def test_post_comment_persists_with_author_and_audit(api):
    client, ids = api
    path, endpoint_id = await endpoint_path(api)
    empty = await client.get(path + "/comments")
    assert empty.status_code == 200 and empty.json()["items"] == []
    posted = await client.post(path + "/comments", json={"content": "  Проверено\nЕсть замечание  "})
    assert posted.status_code == 201, posted.text
    saved = posted.json()
    assert saved["content"] == "Проверено\nЕсть замечание"
    assert saved["endpoint_id"] == endpoint_id
    assert saved["user_id"] == ids["admin"]
    assert saved["username"] == "tester"
    reloaded = await client.get(path + "/comments")
    assert reloaded.status_code == 200
    assert reloaded.json()["items"] == [saved]
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        audit = await db.scalar(select(AuditLog).where(AuditLog.entity_type == "endpoint_comment", AuditLog.entity_id == saved["id"]))
        assert audit.details["endpoint_id"] == str(endpoint_id)
        assert audit.details["project_id"] == str(ids["project"])


@pytest.mark.parametrize("content", ["", " \n\t", None])
async def test_empty_comment_is_rejected(api, content):
    client, _ = api
    path, _ = await endpoint_path(api)
    response = await client.post(path + "/comments", json={"content": content})
    assert response.status_code == 422, response.text
    assert (await client.get(path + "/comments")).json()["total"] == 0


@pytest.mark.parametrize("method", ["GET", "POST"])
@pytest.mark.parametrize("foreign_part", ["host", "endpoint"])
async def test_nested_comment_path_cannot_cross_project_or_host(api, method, foreign_part):
    client, ids = api
    _, own_endpoint_id = await endpoint_path(api)
    host_id = ids["foreign_host"] if foreign_part == "host" else ids["host"]
    endpoint_id = own_endpoint_id if foreign_part == "host" else ids["foreign_endpoint"]
    path = f"projects/{ids['project']}/hosts/{host_id}/endpoints/{endpoint_id}/comments"
    response = await client.request(method, path, json={"content": "Must not persist"} if method == "POST" else None)
    assert response.status_code == 404, response.text


@pytest.mark.parametrize("method", ["GET", "POST"])
async def test_nonmember_cannot_read_or_write_comments(api, method):
    client, ids = api
    path, _ = await endpoint_path(api)
    client.cookies.set("access_token", create_access_token(ids["outsider"]))
    response = await client.request(method, path + "/comments", json={"content": "Not allowed"} if method == "POST" else None)
    assert response.status_code == 403, response.text


async def test_project_member_can_post_comment(api):
    client, ids = api
    path, _ = await endpoint_path(api)
    added = await client.post(f"projects/{ids['project']}/members", json={"user_id": ids["outsider"]})
    assert added.status_code == 201, added.text
    client.cookies.set("access_token", create_access_token(ids["outsider"]))
    response = await client.post(path + "/comments", json={"content": "Member comment"})
    assert response.status_code == 201, response.text
    assert response.json()["username"] == "outsider"


async def test_deleting_endpoint_cascades_comments(api):
    client, _ = api
    path, endpoint_id = await endpoint_path(api)
    response = await client.post(path + "/comments", json={"content": "Saved"})
    assert response.status_code == 201
    deleted = await client.delete(path)
    assert deleted.status_code == 204, deleted.text
    assert (await client.get(path + "/comments")).status_code == 404
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(func.count()).select_from(EndpointComment).where(EndpointComment.endpoint_id == endpoint_id)) == 0


async def test_pagination_is_stable_and_authors_are_not_n_plus_one(api):
    client, ids = api
    path, endpoint_id = await endpoint_path(api)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        db.add_all([EndpointComment(endpoint_id=endpoint_id, user_id=ids["admin"], content=f"Comment {i}") for i in range(110)])
        await db.commit()
        with count_queries(db.bind) as small:
            first = await client.get(path + "/comments", params={"size": 1})
        with count_queries(db.bind) as large:
            page = await client.get(path + "/comments", params={"size": 100})
        assert first.status_code == page.status_code == 200
        assert len(small) == len(large) <= 5
        second = await client.get(path + "/comments", params={"size": 100, "page": 2})
        data = page.json()
        assert data["total"] == 110 and data["pages"] == 2
        rows = data["items"] + second.json()["items"]
        assert len(rows) == len({row["id"] for row in rows}) == 110
        assert [row["id"] for row in rows] == sorted((row["id"] for row in rows), reverse=True)
        assert all(row["username"] == "tester" for row in rows)


async def test_failed_audit_does_not_commit_comment(api, monkeypatch):
    from app import endpoint_comments
    client, _ = api
    path, _ = await endpoint_path(api)
    def fail_audit(*args, **kwargs):
        raise RuntimeError("Simulated audit failure")
    monkeypatch.setattr(endpoint_comments, "AuditLog", fail_audit)
    response = await client.post(path + "/comments", json={"content": "Must roll back"})
    assert response.status_code == 500
    page = await client.get(path + "/comments")
    assert page.status_code == 200 and page.json()["total"] == 0


async def test_endpoint_comment_migration_preserves_existing_rows_and_can_recreate_table(api):
    import importlib.util
    from pathlib import Path
    from alembic.migration import MigrationContext
    from alembic.operations import Operations
    from sqlalchemy import inspect, text
    client, _ = api
    path, _ = await endpoint_path(api)
    posted = await client.post(path + "/comments", json={"content": "Keep on upgrade"})
    assert posted.status_code == 201
    filename = Path(__file__).resolve().parents[2] / "migrations/versions/20261111_0021_endpoint_comments.py"
    spec = importlib.util.spec_from_file_location("endpoint_comment_migration", filename)
    migration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(migration)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        async with db.bind.begin() as conn:
            assert (await conn.scalar(text("SELECT current_schema()"))).startswith("test_")
            def exercise(connection):
                context = MigrationContext.configure(connection)
                with Operations.context(context):
                    migration.upgrade()
                    assert connection.scalar(select(func.count()).select_from(EndpointComment)) == 1
                    migration.downgrade()
                    assert not inspect(connection).has_table("endpoint_comments")
                    migration.upgrade()
                    migration.upgrade()
                    assert {index["name"] for index in inspect(connection).get_indexes("endpoint_comments")} == {
                        "ix_endpoint_comments_endpoint_id", "ix_endpoint_comments_user_id",
                    }
                    assert all(fk["options"].get("ondelete") == "CASCADE" for fk in inspect(connection).get_foreign_keys("endpoint_comments"))
            await conn.run_sync(exercise)
