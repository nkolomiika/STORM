"""Агентский API: запись активов, чтение секретов, scopes и межпроектная изоляция."""
from contextlib import aclosing

import pytest
from sqlalchemy import select

from app.database import get_db
from app.main import app
from app.models import AuditLog, HostIpAddress, ProjectCredential
from app.security import create_access_token

pytestmark = pytest.mark.asyncio


async def agent(client, ids, scopes=None):
    payload = {"name": "Inventory agent", "project_ids": [ids["project"]]}
    if scopes is not None:
        payload["scopes"] = scopes
    result = await client.post("agent-tokens", json=payload)
    assert result.status_code == 201, result.text
    return {"Authorization": "Bearer " + result.json()["token"]}


def base(ids):
    return f"https://test.local/api/v2/projects/{ids['project']}"


async def test_agent_creates_host_endpoint_and_reads_structured_request(api):
    client, ids = api
    headers = await agent(client, ids, ["assets:read", "assets:write"])
    # V2 работает по bearer без пользовательской сессии и CSRF-заголовка.
    client.cookies.clear()
    client.headers.pop("Origin", None)
    host = await client.post(base(ids) + "/hosts", headers=headers,
                             json={"hostname": "agent.example", "ip_addresses": ["192.0.2.15", "2001:db8::15"]})
    assert host.status_code == 201, host.text
    host = host.json()
    assert [row["ip_address"] for row in host["ip_addresses"]] == ["192.0.2.15", "2001:db8::15"]
    path = base(ids) + f"/hosts/{host['id']}"
    endpoint = await client.post(path + "/endpoints", headers=headers, json={
        "request_raw": "POST /agent?q=hello HTTP/1.1\r\nHost: agent.example\r\nContent-Type: application/json\r\n\r\n{\"ok\":true}",
    })
    assert endpoint.status_code == 201, endpoint.text
    item = endpoint.json()
    assert item["path"] == "/agent" and item["method"] == "POST"
    assert item["query_params"][0]["name"] == "q"
    assert item["request_body"] == '{"ok":true}'
    assert (await client.get(path + f"/endpoints/{item['id']}", headers=headers)).json() == item
    assert (await client.get(path + "/endpoints", headers=headers)).json() == [item]
    assert (await client.get(path, headers=headers)).json()["endpoints"][0]["id"] == item["id"]
    duplicate = await client.post(path + "/endpoints", headers=headers, json={"path": "/agent", "method": "POST"})
    assert duplicate.status_code == 201 and duplicate.json()["id"] == item["id"]
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        events = list(await db.scalars(select(AuditLog).where(AuditLog.entity_type == "endpoint", AuditLog.entity_id == item["id"])))
        assert events and all(row.user_id == ids["admin"] for row in events)


async def test_agent_ip_inventory_primary_dedup_pagination_and_standalone(api):
    client, ids = api
    headers = await agent(client, ids, ["assets:read", "assets:write"])
    path = base(ids) + "/ip-addresses"
    secondary = await client.post(path, headers=headers, json={"host_id": ids["host"], "ip_address": "2001:0db8::2", "label": "secondary"})
    assert secondary.status_code == 201, secondary.text
    secondary = secondary.json()
    assert secondary["ip_address"] == "2001:db8::2" and not secondary["is_primary"]
    duplicate = await client.post(path, headers=headers, json={"host_id": ids["host"], "ip_address": "2001:db8::2", "is_primary": True})
    assert duplicate.status_code == 201 and duplicate.json() == secondary
    primary = await client.post(path, headers=headers, json={"host_id": ids["host"], "ip_address": "192.0.2.5", "is_primary": True})
    assert primary.status_code == 201, primary.text
    host = (await client.get(base(ids) + f"/hosts/{ids['host']}", headers=headers)).json()
    assert host["ip_address"] == "192.0.2.5"
    assert sum(ip["is_primary"] for ip in host["ip_addresses"]) == 1
    assert host["ip_addresses"][0]["ports"][0]["id"] == ids["port"]
    standalone = await client.post(path, headers=headers, json={"ip_address": "198.51.100.5"})
    assert standalone.status_code == 201, standalone.text
    standalone = standalone.json()
    assert standalone["is_primary"] and standalone["host_id"] != ids["host"]
    parents = (await client.get(base(ids) + "/hosts?origin=ip", headers=headers)).json()["items"]
    assert parents[0]["id"] == standalone["host_id"] and parents[0]["origin"] == "ip"
    assert (await client.get(path + f"/{standalone['id']}", headers=headers)).json() == standalone
    pages = [(await client.get(path, headers=headers, params={"page": page, "size": 2})).json() for page in (1, 2, 3)]
    assert [len(row["items"]) for row in pages] == [2, 2, 0]
    assert all(row["total"] == 4 for row in pages)
    assert len({ip["id"] for row in pages for ip in row["items"]}) == 4
    filtered = await client.get(path, headers=headers, params={"host_id": ids["host"]})
    assert filtered.json()["total"] == 3
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        event = await db.scalar(select(AuditLog).where(AuditLog.entity_type == "host_ip_address", AuditLog.entity_id == standalone["id"]))
        assert event.user_id == ids["admin"] and event.details["ip_address"] == "198.51.100.5"


async def test_first_ip_of_empty_host_is_primary(api):
    client, ids = api
    headers = await agent(client, ids, ["assets:write", "assets:read"])
    host = await client.post(base(ids) + "/hosts", headers=headers, json={"hostname": "empty.example"})
    result = await client.post(base(ids) + "/ip-addresses", headers=headers,
                               json={"host_id": host.json()["id"], "ip_address": "192.0.2.100"})
    assert result.status_code == 201 and result.json()["is_primary"] is True


async def test_agent_credentials_require_separate_scope_and_never_log_secrets(api, caplog):
    client, ids = api
    created = await client.post(f"projects/{ids['project']}/credentials", json={"username": "vault-user", "password": "only-in-response-secret"})
    assert created.status_code == 201
    item = created.json()
    headers = await agent(client, ids, ["credentials:read"])
    client.cookies.clear()
    for suffix in ("/credentials", f"/credentials/{item['id']}"):
        response = await client.get(base(ids) + suffix, headers=headers)
        assert response.status_code == 200, response.text
        assert response.headers["cache-control"] == "no-store"
        data = response.json()[0] if suffix == "/credentials" else response.json()
        assert data["password"] == "only-in-response-secret" and data["password_available"]
    assert "only-in-response-secret" not in caplog.text
    assert (await client.get(base(ids) + "/hosts", headers=headers)).status_code == 403


async def test_unreadable_agent_credential_does_not_break_list(api):
    client, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        row = ProjectCredential(project_id=ids["project"], created_by=ids["admin"], password_encrypted="broken-ciphertext")
        db.add(row)
        await db.commit()
        row_id = row.id
    headers = await agent(client, ids, ["credentials:read"])
    for suffix in ("/credentials", f"/credentials/{row_id}"):
        response = await client.get(base(ids) + suffix, headers=headers)
        assert response.status_code == 200
        item = response.json()[0] if suffix == "/credentials" else response.json()
        assert item["password"] is None and item["password_available"] is False
        assert "broken-ciphertext" not in response.text


CASES = [
    ("POST", "/hosts", {"hostname": "blocked.example"}, "assets:write"),
    ("POST", "/hosts/{host}/endpoints", {"path": "/blocked"}, "assets:write"),
    ("POST", "/ip-addresses", {"ip_address": "192.0.2.8"}, "assets:write"),
    ("GET", "/hosts/{host}/endpoints", None, "assets:read"),
    ("GET", "/hosts/{host}/endpoints/99999", None, "assets:read"),
    ("GET", "/ip-addresses", None, "assets:read"),
    ("GET", "/ip-addresses/{ip}", None, "assets:read"),
    ("GET", "/credentials", None, "credentials:read"),
    ("GET", "/credentials/99999", None, "credentials:read"),
]


@pytest.mark.parametrize("method,suffix,payload,scope", CASES)
async def test_new_routes_enforce_scopes_and_grants(api, method, suffix, payload, scope):
    client, ids = api
    no_scope = await agent(client, ids, ["projects:read"])
    suffix = suffix.format(**ids)
    response = await client.request(method, base(ids) + suffix, json=payload, headers=no_scope)
    assert response.status_code == 403, response.text
    scoped = await agent(client, ids, [scope])
    foreign = base(ids).rsplit("/", 1)[0] + f"/{ids['foreign_project']}" + suffix
    response = await client.request(method, foreign, json=payload, headers=scoped)
    assert response.status_code == 403, response.text
    response = await client.request(method, base(ids) + suffix, json=payload)
    assert response.status_code == 401  # Cookie администратора не заменяет bearer.


@pytest.mark.parametrize("method,suffix,payload", [
    ("GET", "/hosts/{foreign_host}/endpoints", None),
    ("GET", "/hosts/{host}/endpoints/{foreign_endpoint}", None),
    ("POST", "/hosts/{foreign_host}/endpoints", {"path": "/should-not-exist"}),
    ("GET", "/ip-addresses?host_id={foreign_host}", None),
    ("POST", "/ip-addresses", {"ip_address": "192.0.2.33", "host_id": "FOREIGN"}),
])
async def test_agent_rejects_forged_host_and_endpoint_parent(api, method, suffix, payload):
    client, ids = api
    headers = await agent(client, ids, ["assets:read", "assets:write"])
    if payload and payload.get("host_id") == "FOREIGN":
        payload = {**payload, "host_id": ids["foreign_host"]}
    response = await client.request(method, base(ids) + suffix.format(**ids), headers=headers, json=payload)
    assert response.status_code == 404, response.text


async def test_foreign_ip_and_credential_ids_do_not_leak(api):
    client, ids = api
    credential = await client.post(f"projects/{ids['foreign_project']}/credentials", json={"password": "foreign-secret"})
    assert credential.status_code == 201
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        foreign_ip_id = await db.scalar(select(HostIpAddress.id).where(HostIpAddress.host_id == ids["foreign_host"]))
    headers = await agent(client, ids, ["assets:read", "credentials:read"])
    for suffix in (f"/ip-addresses/{foreign_ip_id}", f"/credentials/{credential.json()['id']}"):
        response = await client.get(base(ids) + suffix, headers=headers)
        assert response.status_code == 404 and "foreign-secret" not in response.text


async def test_default_token_stays_read_only_and_member_loss_revokes_new_capabilities(api):
    client, ids = api
    default = await agent(client, ids)
    for suffix, payload in (("/hosts", {"hostname": "blocked.example"}), ("/ip-addresses", {"ip_address": "192.0.2.1"})):
        assert (await client.post(base(ids) + suffix, json=payload, headers=default)).status_code == 403
    assert (await client.get(base(ids) + "/credentials", headers=default)).status_code == 403
    assert (await client.post(f"projects/{ids['project']}/members", json={"user_id": ids["outsider"]})).status_code == 201
    client.cookies.set("access_token", create_access_token(ids["outsider"]))
    headers = await agent(client, ids, ["assets:write", "credentials:read"])
    assert (await client.post(base(ids) + "/hosts", headers=headers, json={"hostname": "member.example"})).status_code == 201
    client.cookies.set("access_token", create_access_token(ids["admin"]))
    assert (await client.delete(f"projects/{ids['project']}/members/{ids['outsider']}")).status_code == 204
    for method, suffix, payload in (("POST", "/hosts", {"hostname": "denied.example"}), ("GET", "/credentials", None)):
        assert (await client.request(method, base(ids) + suffix, headers=headers, json=payload)).status_code == 403


@pytest.mark.parametrize("payload", [
    {}, {"ip_address": "localhost"}, {"ip_address": "127.0.0.1;id"}, {"ip_address": "https://192.0.2.1"},
    {"ip_address": "192.0.2.1/24"}, {"ip_address": True}, {"ip_address": "192.0.2.1", "host_id": True},
    {"ip_address": "192.0.2.1", "origin": "host"},
])
async def test_agent_ip_bad_input_is_422(api, payload):
    client, ids = api
    headers = await agent(client, ids, ["assets:write"])
    response = await client.post(base(ids) + "/ip-addresses", headers=headers, json=payload)
    assert response.status_code == 422, response.text
    assert response.json()["request_id"]


@pytest.mark.parametrize("suffix,payload", [("/hosts", {}), ("/hosts/{host}/endpoints", {}), ("/hosts/{host}/endpoints", {"path": "/", "method": "INVALID"})])
async def test_agent_asset_bad_input_is_422(api, suffix, payload):
    client, ids = api
    headers = await agent(client, ids, ["assets:write"])
    assert (await client.post(base(ids) + suffix.format(**ids), headers=headers, json=payload)).status_code == 422


@pytest.mark.parametrize("query", ["page=0", "size=201", "host_id=0"])
async def test_agent_ip_pagination_is_bounded(api, query):
    client, ids = api
    headers = await agent(client, ids, ["assets:read"])
    assert (await client.get(base(ids) + "/ip-addresses?" + query, headers=headers)).status_code == 422
