"""Adversarial inputs at real HTTP/SQL boundaries, with no external calls."""
import json

import pytest

pytestmark = pytest.mark.asyncio

RESOURCES = [
    "projects", "projects/{project}/hosts", "projects/{project}/notes",
    "projects/{project}/credentials", "projects/{project}/vulnerabilities",
    "projects/{project}/hosts/{host}/ports", "projects/{project}/hosts/{host}/endpoints",
]


@pytest.mark.parametrize("resource", RESOURCES)
@pytest.mark.parametrize("value", [None, [], 42, "not an object", {"unexpected": True}])
async def test_wrong_json_shapes_are_422(api, resource, value):
    client, ids = api
    result = await client.post(resource.format(**ids), content=json.dumps(value), headers={"Content-Type": "application/json"})
    assert result.status_code == 422, result.text


@pytest.mark.parametrize("resource,payload", [
    ("projects", {"name": "bad\x00name"}),
    ("projects/{project}/hosts", {"hostname": "bad\x00host"}),
    ("projects/{project}/notes", {"title": "bad\x00title"}),
    ("projects/{project}/credentials", {"password": "bad\x00secret"}),
    ("projects/{project}/hosts/{host}/endpoints", {"path": "/bad\x00path", "method": "GET"}),
])
async def test_nul_is_rejected_before_postgresql(api, resource, payload):
    client, ids = api
    result = await client.post(resource.format(**ids), json=payload)
    assert result.status_code == 422, result.text


@pytest.mark.parametrize("value", [str(2**31), str(10**100), "-1", "0", "1 OR 1=1"])
@pytest.mark.parametrize("path", ["projects/{bad}", "projects/{project}/hosts/{bad}", "users/{bad}"])
async def test_invalid_path_ids_never_reach_database(api, path, value):
    client, ids = api
    result = await client.get(path.format(**ids, bad=value))
    assert result.status_code == 422, result.text


@pytest.mark.parametrize("field,value", [("host_id", 10**100), ("host_id", -1), ("host_id", True)])
async def test_invalid_body_resource_ids_are_422(api, field, value):
    client, ids = api
    result = await client.post(f"projects/{ids['project']}/vulnerabilities", json={"title": "Bad ID", field: value})
    assert result.status_code == 422, result.text


@pytest.mark.parametrize("query", [{"page": str(10**100)}, {"page": "nan"}, {"size": "-1"}])
async def test_invalid_pagination_is_rejected(api, query):
    client, _ = api
    result = await client.get("projects", params=query)
    assert result.status_code == 422, result.text


@pytest.mark.parametrize("payload", [b'{"name":', b'{"name":"\xff"}', b'\xef\xbb\xbf{broken}'])
async def test_corrupt_json_and_encoding_are_client_errors(api, payload):
    client, _ = api
    result = await client.post("projects", content=payload, headers={"Content-Type": "application/json"})
    assert result.status_code in {400, 422}, result.text


async def test_extreme_json_nesting_is_a_client_error(api):
    client, _ = api
    result = await client.post("projects", content=b'{"name":' + b'[' * 1500 + b'0' + b']' * 1500 + b'}', headers={"Content-Type": "application/json"})
    assert result.status_code in {400, 413, 422}, result.text


async def test_nonfinite_json_numbers_are_rejected(api):
    client, ids = api
    result = await client.post(f"projects/{ids['project']}/hosts/{ids['host']}/endpoints", content='{"path":"/test","method":"GET","query_params":[{"name":"x","value":NaN}]}', headers={"Content-Type": "application/json"})
    assert result.status_code == 422, result.text


async def test_sql_syntax_in_text_is_stored_as_data(api):
    client, _ = api
    name = "x'; DROP TABLE users; --"
    result = await client.post("projects", json={"name": name})
    assert result.status_code == 201 and result.json()["name"] == name
    assert (await client.get("users/me")).status_code == 200


async def test_authenticated_user_cannot_assign_own_admin_role(api):
    from app.security import create_access_token
    client, ids = api
    client.cookies.clear()
    client.cookies.set("access_token", create_access_token(ids["outsider"]))
    response = await client.patch("users/me", json={"full_name": "Changed", "role": "admin", "is_locked": False})
    assert response.status_code in {200, 422}, response.text
    assert (await client.get("users/me")).json()["role"] == "pentester"


async def test_nul_query_is_rejected(api):
    client, _ = api
    result = await client.get("users/search", params={"q": "bad\x00query"})
    assert result.status_code == 422, result.text


async def test_extreme_sort_order_is_rejected_without_database_overflow(api):
    client, ids = api
    url = f"projects/{ids['project']}/notes"
    item = (await client.post(url, json={"title": "Sort test"})).json()
    result = await client.patch(url + "/reorder", json={"items": [{"id": item["id"], "sort_order": 10**100}]})
    assert result.status_code == 422, result.text


@pytest.mark.parametrize("payload", [
    {"name": "Bad grant", "project_ids": [999999]},
    {"name": "No timezone", "all_projects": True, "expires_at": "2030-01-01T00:00:00"},
])
async def test_invalid_agent_token_configuration_does_not_create_partial_records(api, payload):
    client, _ = api
    result = await client.post("agent-tokens", json=payload)
    assert result.status_code == 422, result.text
    assert (await client.get("agent-tokens")).json() == []
