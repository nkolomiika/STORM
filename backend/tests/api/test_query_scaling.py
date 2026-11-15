"""Регрессии N+1: SQL не растёт с размером страницы, данные не теряются."""
from contextlib import aclosing, contextmanager

import pytest
from sqlalchemy import event

from app.database import get_db
from app.enums import AssetType, NotificationType
from app.main import app
from app.models import (
    Comment, CommentMention, Endpoint, Host, JsFile, Notification, ProjectNote,
    ProjectNoteComment, Vulnerability, VulnerabilityAsset,
)

pytestmark = pytest.mark.asyncio


@contextmanager
def count_queries(engine):
    statements = []

    def record(conn, cursor, statement, parameters, context, executemany):
        statements.append(statement)

    event.listen(engine.sync_engine, "before_cursor_execute", record)
    try:
        yield statements
    finally:
        event.remove(engine.sync_engine, "before_cursor_execute", record)


async def test_comment_page_batches_mentions(api):
    client, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        vuln = Vulnerability(project_id=ids["project"], title="Many comments", created_by=ids["admin"])
        db.add(vuln)
        await db.flush()
        for i in range(100):
            comment = Comment(vulnerability_id=vuln.id, user_id=ids["admin"], content=f"Comment {i}")
            db.add(comment)
            await db.flush()
            if i % 2 == 0:
                db.add_all([CommentMention(comment_id=comment.id, user_id=ids["admin"]),
                            CommentMention(comment_id=comment.id, user_id=ids["outsider"])])
        await db.commit()
        path = f"projects/{ids['project']}/vulnerabilities/{vuln.id}/comments"
        with count_queries(db.bind) as small:
            one = await client.get(path, params={"size": 1})
        with count_queries(db.bind) as large:
            hundred = await client.get(path, params={"size": 100})
        assert one.status_code == hundred.status_code == 200
        assert len(large) == len(small)
        result = hundred.json()
        assert result["total"] == 100
        assert len(result["items"]) == 100
        for item in result["items"]:
            index = int(item["content"].split()[-1])
            assert {m["username"] for m in item["mentions"]} == ({"tester", "outsider"} if index % 2 == 0 else set())


async def test_notification_page_batches_all_context_types(api):
    client, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        vuln = Vulnerability(project_id=ids["project"], title="Finding context", created_by=ids["admin"])
        note = ProjectNote(project_id=ids["project"], title="Note context", created_by=ids["admin"])
        db.add_all([vuln, note])
        await db.flush()
        comment = Comment(vulnerability_id=vuln.id, user_id=ids["admin"], content="Mention")
        note_comment = ProjectNoteComment(project_id=ids["project"], note_id=note.id, user_id=ids["admin"], content="Note mention")
        db.add_all([comment, note_comment,
                    VulnerabilityAsset(vulnerability_id=vuln.id, asset_type=AssetType.HOST, asset_id=ids["host"])])
        await db.flush()
        for _ in range(20):
            db.add_all([
                Notification(user_id=ids["admin"], type=NotificationType.MENTION, comment_id=comment.id),
                Notification(user_id=ids["admin"], type=NotificationType.MENTION, note_comment_id=note_comment.id),
                Notification(user_id=ids["admin"], type=NotificationType.PROJECT_MEMBER_ADDED, project_id=ids["project"], actor_id=ids["outsider"]),
                Notification(user_id=ids["admin"], type=NotificationType.VULN_STATUS_CHANGED, vulnerability_id=vuln.id, actor_id=ids["admin"], status="confirmed"),
                Notification(user_id=ids["admin"], type=NotificationType.MENTION),
            ])
        # Чужое уведомление не должно попасть ни в страницу, ни в total.
        db.add(Notification(user_id=ids["outsider"], type=NotificationType.MENTION))
        await db.commit()
        with count_queries(db.bind) as queries:
            response = await client.get("notifications", params={"size": 100})
        assert response.status_code == 200, response.text
        assert len(queries) <= 6
        result = response.json()
        assert result["total"] == 100
        assert len(result["items"]) == 100
        for item in result["items"]:
            context = item["context"]
            if item["comment_id"]:
                assert context["vulnerability_title"] == "Finding context"
                assert context["host_id"] == ids["host"]
                assert context["commenter_username"] == "tester"
            elif item["note_comment_id"]:
                assert context["note_title"] == "Note context"
                assert context["commenter_username"] == "tester"
            elif item["type"] == "project_member_added":
                assert context["project_name"] == "API test"
                assert context["commenter_username"] == "outsider"
            elif item["type"] == "vuln_status_changed":
                assert context["vulnerability_title"] == "Finding context"
                assert context["project_id"] == ids["project"]
                assert context["project_name"] == "API test"
                assert context["status"] == "confirmed"
            else:
                assert context is None
        assert (await client.get("notifications", params={"page": 2, "size": 100})).json()["items"] == []


async def test_port_read_does_not_hydrate_host_endpoints(api):
    client, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        db.add_all([Endpoint(host_id=ids["host"], path=f"/api/{i}", method="GET") for i in range(200)])
        await db.commit()
        with count_queries(db.bind) as queries:
            response = await client.get(f"projects/{ids['project']}/hosts/{ids['host']}/ports")
        assert response.status_code == 200, response.text
        assert len(response.json()) == 1
        assert not any("FROM endpoints" in sql or "FROM host_ip_addresses" in sql for sql in queries)


async def test_js_hostname_lookup_is_limited_to_page(api):
    client, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        db.add(JsFile(project_id=ids["project"], host_id=ids["host"], url="https://old.example/main.js"))
        await db.commit()
        with count_queries(db.bind) as queries:
            response = await client.get(f"projects/{ids['project']}/js-files")
        assert response.status_code == 200, response.text
        assert response.json()["items"][0]["hostname"] == "old.example"
        host_queries = [sql for sql in queries if "FROM hosts" in sql]
        assert len(host_queries) == 1
        assert "hosts.id IN" in host_queries[0]


async def test_vulnerability_list_has_host_link_without_card_request(api):
    client, ids = api
    response = await client.post(f"projects/{ids['project']}/vulnerabilities", json={"title": "List host", "host_id": ids["host"]})
    assert response.status_code == 201, response.text
    page = await client.get(f"projects/{ids['project']}/vulnerabilities")
    assert page.status_code == 200, page.text
    assert page.json()["items"][0]["affected_host_id"] == ids["host"]


async def test_host_creation_times_match_full_list_without_loading_children(api):
    from datetime import datetime, UTC
    client, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        same_time = datetime(2020, 1, 1, tzinfo=UTC)
        db.add_all([
            Host(project_id=ids["project"], hostname="same-time.example", created_at=same_time),
            Host(project_id=ids["project"], ip_address="192.0.2.40", origin="ip", created_at=same_time),
            Host(project_id=ids["foreign_project"], hostname="foreign.example", created_at=datetime(2019, 1, 1, tzinfo=UTC)),
        ])
        db.add_all([Endpoint(host_id=ids["host"], path=f"/chart/{i}", method="GET") for i in range(200)])
        await db.commit()
        full = await client.get(f"projects/{ids['project']}/hosts", params={"origin": "all", "size": 200})
        assert full.status_code == 200, full.text
        expected = [host["created_at"] for host in full.json()["items"]]
        with count_queries(db.bind) as queries:
            response = await client.get(f"projects/{ids['project']}/host-creation-times")
        assert response.status_code == 200, response.text
        assert response.json() == expected
        assert len(response.json()) == 3  # Служебный IP включён, чужой проект исключён.
        assert response.json().count("2020-01-01T00:00:00Z") == 2
        assert len(queries) <= 3
        assert not any(f"FROM {table}" in query for table in ("endpoints", "host_ip_addresses", "ports", "services") for query in queries)


async def test_host_creation_times_empty_and_project_access(api):
    from app.security import create_access_token
    client, ids = api
    created = await client.post("projects", json={"name": "Empty chart", "appsec_ticket_key": "APPSEC-1"})
    assert created.status_code == 201, created.text
    response = await client.get(f"projects/{created.json()['id']}/host-creation-times")
    assert response.status_code == 200 and response.json() == []
    client.cookies.set("access_token", create_access_token(ids["outsider"]))
    response = await client.get(f"projects/{ids['project']}/host-creation-times")
    assert response.status_code == 403, response.text
