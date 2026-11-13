"""Проверяем HTTP-статусы, ответы и сохранение данных без моков ORM."""
import pytest

pytestmark = pytest.mark.asyncio


def checked(response, status=200):
    assert response.status_code == status, f"{response.request.method} {response.request.url}: {response.status_code} {response.text}"
    return response.json() if response.content else None


@pytest.mark.parametrize("payload", [
    {"hostname": "new.example"}, {"notes": "updated"}, {"status": "up"},
    {"ip_addresses": [{"ip_address": "192.0.2.2", "is_primary": True}]}, {},
])
async def test_update_host(api, payload):
    client, ids = api
    path = f"projects/{ids['project']}/hosts/{ids['host']}"
    data = checked(await client.put(path, json=payload))
    for field in ("hostname", "notes", "status"):
        if field in payload:
            assert data[field] == payload[field]
    assert isinstance(data["endpoints"], list)
    saved = checked(await client.get(path))
    assert saved["hostname"] == data["hostname"]


@pytest.mark.parametrize("payload", [{"hostname": "created.example"}, {"ip_addresses": ["192.0.2.3"]}])
async def test_create_host(api, payload):
    client, ids = api
    path = f"projects/{ids['project']}/hosts"
    data = checked(await client.post(path, json=payload), 201)
    assert data["id"] != ids["host"]
    checked(await client.delete(f"{path}/{data['id']}"), 204)
    checked(await client.get(f"{path}/{data['id']}"), 404)


@pytest.mark.parametrize("resource,create,update", [
    ("projects", {"name": "Created"}, {"name": "Changed"}),
    ("projects/{project}/notes", {"title": "Note", "content": "text"}, {"title": "Changed"}),
    ("projects/{project}/credentials", {"username": "login", "password": "secret"}, {"password": "changed"}),
    ("projects/{project}/hosts/{host}/endpoints", {"path": "/api/test", "method": "GET"}, {"path": "/api/changed"}),
    ("projects/{project}/vulnerabilities", {"host_id": "HOST", "title": "Finding"}, {"title": "Changed"}),
])
async def test_resource_lifecycle(api, resource, create, update):
    client, ids = api
    path = resource.format(**ids)
    payload = {key: ids['host'] if value == "HOST" else value for key, value in create.items()}
    item = checked(await client.post(path, json=payload), 201)
    item_path = f"{path}/{item['id']}"
    changed = checked(await client.put(item_path, json=update))
    for key, value in update.items():
        assert changed[key] == value
    checked(await client.get(path))
    checked(await client.delete(item_path), 204)
    checked(await client.put(item_path, json=update), 404)


async def test_port_and_service_lifecycle(api):
    client, ids = api
    path = f"projects/{ids['project']}/hosts/{ids['host']}/ports"
    payload = {"ip_address_id": ids['ip'], "port_number": 443}
    port = checked(await client.post(path, json=payload), 201)
    checked(await client.post(path, json=payload), 409)
    checked(await client.get(f"{path}/{port['id']}"))
    checked(await client.put(f"{path}/{port['id']}", json={"port_number": 8443}))
    services = f"{path}/{port['id']}/services"
    service = checked(await client.post(services, json={"name": "https"}), 201)
    checked(await client.put(f"{services}/{service['id']}", json={"name": "tls"}))
    assert checked(await client.get(services))[0]["name"] == "tls"
    checked(await client.delete(f"{services}/{service['id']}"), 204)
    checked(await client.delete(f"{path}/{port['id']}"), 204)


@pytest.mark.parametrize("method,suffix,payload,status", [
    ("GET", "", None, 200), ("GET", "/{port}", None, 200),
    ("PUT", "/{port}", {"port_number": 8081}, 200), ("DELETE", "/{port}", None, 204),
])
async def test_port_methods_independently(api, method, suffix, payload, status):
    client, ids = api
    path = f"projects/{ids['project']}/hosts/{ids['host']}/ports" + suffix.format(**ids)
    checked(await client.request(method, path, json=payload), status)


async def test_service_methods_independently(api):
    client, ids = api
    path = f"projects/{ids['project']}/hosts/{ids['host']}/ports/{ids['port']}/services"
    service = checked(await client.post(path, json={"name": "http"}), 201)
    assert checked(await client.put(f"{path}/{service['id']}", json={"version": "2"}))['version'] == '2'
    assert checked(await client.get(path))[0]['id'] == service['id']
    checked(await client.delete(f"{path}/{service['id']}"), 204)


@pytest.mark.parametrize("path", [
    "projects", "projects/stats", "projects/folders", "users", "users/me", "users/search?q=test",
    "notifications", "notifications/unread-count", "audit-logs", "agent-tokens",
    "projects/{project}", "projects/{project}/members", "projects/{project}/activity",
    "projects/{project}/notes", "projects/{project}/notes-activity", "projects/{project}/credentials",
    "projects/{project}/hosts", "projects/{project}/hosts/{host}",
    "projects/{project}/hosts/{host}/ports", "projects/{project}/hosts/{host}/endpoints",
    "projects/{project}/hosts/{host}/vulnerabilities", "projects/{project}/hidden-ips",
    "projects/{project}/js-files", "projects/{project}/vulnerabilities",
])
async def test_read_methods(api, path):
    client, ids = api
    checked(await client.get(path.format(**ids)))


@pytest.mark.parametrize("resource", ["hosts", "notes", "vulnerabilities", "credentials"])
async def test_cross_project_access_denied(api, resource):
    from app.security import create_access_token
    client, ids = api
    client.cookies.set("access_token", create_access_token(ids['outsider']))
    checked(await client.get(f"projects/{ids['project']}/{resource}"), 403)


@pytest.mark.parametrize("resource,payload", [
    ("hosts", {}), ("hosts", {"hostname": "x" * 256}),
    ("notes", {"title": ""}), ("credentials", {"password": ""}),
    ("vulnerabilities", {"title": ""}),
    ("hosts/{host}/ports", {"ip_address_id": 1, "port_number": 65536}),
    ("hosts/{host}/endpoints", {"path": "/", "method": "INVALID"}),
])
async def test_invalid_payloads_are_422(api, resource, payload):
    client, ids = api
    checked(await client.post(f"projects/{ids['project']}/{resource.format(**ids)}", json=payload), 422)


@pytest.mark.parametrize("resource", ["hosts", "vulnerabilities"])
async def test_invalid_status_filter(api, resource):
    client, ids = api
    checked(await client.get(f"projects/{ids['project']}/{resource}?status=invalid"), 422)


async def test_host_update_preserves_ports(api):
    client, ids = api
    path = f"projects/{ids['project']}/hosts/{ids['host']}"
    port = checked(await client.post(path + "/ports", json={"ip_address_id": ids['ip'], "port_number": 80}), 201)
    checked(await client.put(path, json={"hostname": "renamed.example", "ip_addresses": [{"ip_address": "192.0.2.1", "is_primary": True}]}))
    saved = checked(await client.get(path))
    assert saved['ip_addresses'][0]['ports'][0]['id'] == port['id']


@pytest.mark.parametrize("method,path,payload", [
    ("GET", "hosts/{foreign_host}/ports", None),
    ("GET", "hosts/{foreign_host}/ports/{foreign_port}", None),
    ("GET", "hosts/{host}/ports/{foreign_port}/services", None),
    ("GET", "hosts/{foreign_host}/endpoints", None),
    ("PUT", "hosts/{foreign_host}/ports/{foreign_port}", {"port_number": 8443}),
    ("DELETE", "hosts/{foreign_host}/ports/{foreign_port}", None),
    ("DELETE", "hosts/{host}/ports/{foreign_port}/services/{foreign_service}", None),
    ("DELETE", "hosts/{foreign_host}/endpoints/{foreign_endpoint}", None),
    ("GET", "vulnerabilities/{foreign_vuln}/comments", None),
])
async def test_nested_resource_must_belong_to_project(api, method, path, payload):
    from app.security import create_access_token
    client, ids = api
    checked(await client.post(f"projects/{ids['project']}/members", json={"user_id": ids['outsider']}), 201)
    client.cookies.set("access_token", create_access_token(ids['outsider']))
    response = await client.request(method, f"projects/{ids['project']}/{path.format(**ids)}", json=payload)
    checked(response, 404)
    client.cookies.set("access_token", create_access_token(ids['admin']))
    # Отказ должен предшествовать изменению/удалению чужих данных.
    foreign = checked(await client.get(f"projects/{ids['foreign_project']}/hosts/{ids['foreign_host']}"))
    assert foreign['ip_addresses'][0]['ports'][0]['port_number'] == 443
    assert foreign['ip_addresses'][0]['ports'][0]['services'][0]['name'] == 'private'
    assert foreign['endpoints'][0]['path'] == '/private'


async def test_folders_and_members(api):
    client, ids = api
    folder = checked(await client.post("projects/folders", json={"name": "Folder"}), 201)
    child = checked(await client.post("projects/folders", json={"name": "Child", "parent_id": folder['id']}), 201)
    checked(await client.patch(f"projects/folders/{child['id']}/move", json={"parent_id": None}))
    checked(await client.patch(f"projects/folders/{folder['id']}/move", json={"parent_id": folder['id']}), 422)
    checked(await client.delete(f"projects/folders/{folder['id']}"))
    path = f"projects/{ids['project']}/members"
    checked(await client.post(path, json={"user_id": ids['outsider']}), 201)
    checked(await client.get(path))
    checked(await client.delete(f"{path}/{ids['outsider']}"), 204)


async def test_notes_and_comments(api):
    client, ids = api
    path = f"projects/{ids['project']}/notes"
    note = checked(await client.post(path, json={"title": "Parent"}), 201)
    child = checked(await client.post(path, json={"title": "Child", "parent_id": note['id']}), 201)
    checked(await client.get(f"{path}/{note['id']}"))
    checked(await client.patch(f"{path}/{child['id']}/move", json={"parent_id": None}))
    checked(await client.patch(f"{path}/reorder", json={"parent_id": None, "items": [{"id": child['id'], "sort_order": 0}, {"id": note['id'], "sort_order": 1}]}))
    comments = f"{path}/{note['id']}/comments"
    comment = checked(await client.post(comments, json={"content": "hello"}), 201)
    checked(await client.put(f"{comments}/{comment['id']}", json={"content": "changed"}))
    checked(await client.get(comments))
    checked(await client.delete(f"{comments}/{comment['id']}"), 204)
    checked(await client.delete(f"{path}/{note['id']}"), 204)


async def test_vulnerability_comments_status_assets(api):
    client, ids = api
    path = f"projects/{ids['project']}/vulnerabilities"
    vuln = checked(await client.post(path, json={"host_id": ids['host'], "title": "Finding"}), 201)
    path += f"/{vuln['id']}"
    checked(await client.get(path))
    assert checked(await client.patch(path + "/status", json={"status": "resolved"}))["status"] == "resolved"
    checked(await client.get(path + "/assets"))
    comment = checked(await client.post(path + "/comments", json={"content": "hello"}), 201)
    checked(await client.put(f"{path}/comments/{comment['id']}", json={"content": "changed"}))
    checked(await client.get(path + "/comments"))
    checked(await client.delete(f"{path}/comments/{comment['id']}"), 204)


async def test_hidden_ips(api):
    client, ids = api
    path = f"projects/{ids['project']}/hidden-ips"
    for _ in range(2):
        checked(await client.post(path, json={"ip_address": "192.0.2.1"}), 204)
    assert checked(await client.get(path)) == ["192.0.2.1"]
    checked(await client.delete(path + "/192.0.2.1"), 204)
    assert checked(await client.get(path)) == []


@pytest.mark.parametrize("kind", ["szi", "pp"])
async def test_word_report_without_external_files(api, kind):
    from io import BytesIO
    from zipfile import ZipFile
    client, ids = api
    response = await client.post(f"projects/{ids['project']}/reports/{kind}")
    assert response.status_code == 200, response.text
    assert "wordprocessingml" in response.headers['content-type']
    assert "word/document.xml" in ZipFile(BytesIO(response.content)).namelist()


async def test_local_login_refresh_logout(api):
    client, ids = api
    client.cookies.clear()
    checked(await client.post("auth/login", json={"username": "tester", "password": "wrong"}), 401)
    checked(await client.post("auth/login", json={"username": "tester", "password": "test-password"}))
    assert checked(await client.get("users/me"))["id"] == ids['admin']
    checked(await client.post("auth/refresh"))
    checked(await client.post("auth/logout"), 204)
    checked(await client.get("users/me"), 401)


async def test_user_profile_password_and_admin_management(api):
    client, ids = api
    checked(await client.get("users/me/profile"))
    checked(await client.patch("users/me", json={"full_name": "Test User"}))
    checked(await client.patch("users/me/password", json={"current_password": "test-password", "new_password": "new-password"}))
    checked(await client.get(f"users/{ids['outsider']}"))
    updated = checked(await client.put(f"users/{ids['outsider']}", json={"full_name": "Changed", "project_role": "lead"}))
    assert updated['full_name'] == 'Changed'
    checked(await client.delete(f"users/{ids['outsider']}"), 204)
    assert checked(await client.get(f"users/{ids['outsider']}"))['is_locked'] is True


async def test_two_factor_lifecycle(api):
    import pyotp
    client, ids = api
    setup = checked(await client.post("users/me/2fa/setup"))
    confirmed = checked(await client.post("users/me/2fa/confirm", json={"code": pyotp.TOTP(setup['secret']).now()}))
    assert confirmed['totp_enabled'] is True
    disabled = checked(await client.post("users/me/2fa/disable", json={"password": "test-password"}))
    assert disabled['totp_enabled'] is False
    checked(await client.post(f"users/{ids['outsider']}/2fa/reset"))


async def test_agent_token_and_v2_lifecycle(api):
    client, ids = api
    token = checked(await client.post("agent-tokens", json={"name": "API test", "scopes": ["projects:read", "assets:read", "notes:read", "notes:write", "vulns:read", "vulns:write"], "project_ids": [ids['project']]}), 201)
    headers = {"Authorization": "Bearer " + token['token']}
    base = f"https://test.local/api/v2/projects/{ids['project']}"
    checked(await client.get("https://test.local/api/v2/projects", headers=headers))
    for suffix in ["", "/hosts", f"/hosts/{ids['host']}", "/notes", f"/hosts/{ids['host']}/vulnerabilities"]:
        checked(await client.get(base + suffix, headers=headers))
    note = checked(await client.post(base + "/notes", headers=headers, json={"title": "Agent note"}), 201)
    checked(await client.get(base + f"/notes/{note['id']}", headers=headers))
    checked(await client.put(base + f"/notes/{note['id']}", headers=headers, json={"title": "Updated"}))
    vuln = checked(await client.post(base + "/vulnerabilities", headers=headers, json={"host_id": ids['host'], "title": "Agent finding"}), 201)
    checked(await client.put(base + f"/vulnerabilities/{vuln['id']}", headers=headers, json={"title": "Updated"}))
    checked(await client.get(base + f"/hosts/{ids['host']}/vulnerabilities/{vuln['id']}", headers=headers))
    checked(await client.delete(f"agent-tokens/{token['id']}"), 204)
    checked(await client.get(base, headers=headers), 401)


async def test_notification_methods(api):
    from app.security import create_access_token
    client, ids = api
    checked(await client.post(f"projects/{ids['project']}/members", json={"user_id": ids['outsider']}), 201)
    client.cookies.set("access_token", create_access_token(ids['outsider']))
    items = checked(await client.get("notifications"))['items']
    assert len(items) == 1
    assert checked(await client.get("notifications/unread-count"))['count'] == 1
    checked(await client.patch(f"notifications/{items[0]['id']}/read"))
    checked(await client.patch("notifications/read-all"), 204)
    assert checked(await client.get("notifications/unread-count"))['count'] == 0


async def test_openapi_import_export(api):
    import json
    client, ids = api
    path = f"projects/{ids['project']}/hosts/{ids['host']}"
    spec = {"openapi": "3.0.0", "info": {"title": "Test", "version": "1"}, "paths": {"/ping": {"get": {"responses": {"200": {"description": "OK"}}}}}}
    checked(await client.post(path + "/import-openapi", files={"file": ("openapi.json", json.dumps(spec), "application/json")}))
    exported = checked(await client.get(path + "/export-openapi"))
    assert '/ping' in exported['paths']


@pytest.mark.parametrize("path", ["projects?status=invalid", "projects/{project}/vulnerabilities?severity=invalid", "projects/{project}/hosts/{host}/vulnerabilities?status=invalid"])
async def test_invalid_enum_filters(api, path):
    client, ids = api
    checked(await client.get(path.format(**ids)), 422)


async def test_js_cleanup_methods(api):
    client, ids = api
    path = f"projects/{ids['project']}/js-files"
    assert checked(await client.post(path + "/bulk-delete", json={"ids": [999999]})) == {"deleted": 0}
    checked(await client.delete(path + f"/hosts/{ids['host']}"), 204)


@pytest.mark.parametrize("content,status", [
    (b'{"hosts": [{"hostname": "imported.example", "ip_address": "192.0.2.7"}]}', 200),
    (b'{"hosts": [{"hostname": "name-only.example"}]}', 200),
    (b'{"hosts": [{"hostname": "ports.example", "ip_address": "192.0.2.8", "ports": [{"port_number": 443, "services": [{"name": "https"}]}]}]}', 200),
    (b"not json", 422), (b'{"hosts": "invalid"}', 422),
])
async def test_json_import(api, content, status):
    client, ids = api
    data = checked(await client.post(f"projects/{ids['project']}/import", files={"file": ("assets.json", content, "application/json")}), status)
    if status == 200:
        assert data['hosts_created'] == 1
        import json
        expected = json.loads(content)['hosts'][0]
        hosts = checked(await client.get(f"projects/{ids['project']}/hosts"))['items']
        host = next(item for item in hosts if item['hostname'] == expected['hostname'])
        if expected.get('ip_address'):
            assert host['ip_addresses'][0]['ip_address'] == expected['ip_address']
        if expected.get('ports'):
            assert host['ip_addresses'][0]['ports'][0]['services'][0]['name'] == 'https'


@pytest.mark.parametrize("resource", ["hosts", "notes", "credentials", "vulnerabilities"])
async def test_missing_entities_are_404(api, resource):
    client, ids = api
    path = f"projects/{ids['project']}/{resource}/999999"
    checked(await client.put(path, json={}), 404)
    checked(await client.delete(path), 404)


@pytest.mark.parametrize("method", ["POST", "TRACE", "QUERY"])
async def test_raw_request_edit_updates_endpoint_and_clears_removed_fields(api, method):
    client, ids = api
    path = f"projects/{ids['project']}/hosts/{ids['host']}/endpoints"
    item = checked(await client.post(path, json={"path": "/before", "method": "POST", "request_body": "old body", "request_content_type": "text/plain"}), 201)
    raw = f"{method} /changed?key=value HTTP/1.1\nHost: old.example\nX-Test: yes\n\n"
    changed = checked(await client.put(f"{path}/{item['id']}", json={"request_raw": raw}))
    assert changed['path'] == '/changed'
    assert changed['method'] == method
    assert changed['query_params'][0]['name'] == 'key'
    assert changed['request_body'] is None
    assert changed['request_content_type'] is None
    assert changed['request_headers'] == [{'name': 'X-Test', 'value': 'yes'}]
    saved = next(row for row in checked(await client.get(path)) if row['id'] == item['id'])
    assert saved['path'] == '/changed'
    assert saved['method'] == method


async def test_ip_responses_have_no_cloudflare_field(api):
    from app.models import HostIpAddress
    client, ids = api
    host = checked(await client.get(f"projects/{ids['project']}/hosts/{ids['host']}"))
    assert "is_cloudflare" not in host['ip_addresses'][0]
    assert "is_cloudflare" not in HostIpAddress.__table__.columns
