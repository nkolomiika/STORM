"""Exercise STS export, APPSEC browsing and project binding without external I/O."""
import json

import httpx
import pytest

from app.config import get_settings
from app.works import WorksClient

pytestmark = pytest.mark.asyncio


def native_tracker(monkeypatch, handler):
    settings = get_settings()
    for name, value in {
        "works_enabled": True, "works_api_token": "test-only",
        "works_base_url": "https://tracker.example/swtr", "works_space": "STS",
        "works_tasks_space": "APPSEC",
        "works_issue_url_template": "https://tracker.example/swtr/units/current/unit/{key}?space={space}",
        "works_tasks_search_body": {"space": "{space}", "query": "{query}", "page": {"page": 0, "size": 100}},
    }.items():
        monkeypatch.setattr(settings, name, value)

    def init(self):
        self._base = settings.works_base_url
        self._client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    monkeypatch.setattr(WorksClient, "__init__", init)


@pytest.mark.parametrize("link_failure", [False, True])
async def test_finding_export_goes_to_sts_and_links_to_project_appsec_ticket(api, monkeypatch, caplog, link_failure):
    client, ids = api
    calls = []
    def handler(request):
        body = json.loads(request.content)
        calls.append((request.url.path, body))
        if request.url.path.endswith("/bug_appsec/create"):
            return httpx.Response(200, json={"code": "STS-42"})
        if request.url.path.endswith("/unit/v1/link"):
            return httpx.Response(503 if link_failure else 200, json={"ok": not link_failure})
        raise AssertionError(f"Unexpected Task Tracker request: {request.url.path}")
    native_tracker(monkeypatch, handler)
    project = ids["project"]
    response = await client.put(f"projects/{project}", json={
        "appsec_ticket_url": "https://tracker.example/swtr/units/current/unit/APPSEC-7?space=APPSEC",
        "appsec_assignee": "analyst",
        "appsec_versions": [{"code": "v1", "name": "Platform 1.0"}],
    })
    assert response.status_code == 200, response.text
    assert response.json()["appsec_ticket_key"] == "APPSEC-7"
    finding = await client.post(f"projects/{project}/vulnerabilities", json={"title": "Export scenario", "host_id": ids["host"]})
    assert finding.status_code == 201, finding.text
    response = await client.post(f"projects/{project}/vulnerabilities/{finding.json()['id']}/works/export", json={})
    assert response.status_code == 200, response.text
    assert response.json()["works_key"] == "STS-42"
    assert "space=STS" in response.json()["works_url"]
    assert len(calls) == 2
    creation, link = calls[0][1], calls[1][1]
    assert creation["space"] == creation["attributes"]["space"] == "STS"
    assert creation["suit"] == "bug_appsec"
    assert link == {"source": "STS-42", "destination": "APPSEC-7", "type": "plain_connection"}
    if link_failure:
        # Existing partial-success policy: preserve the created STS ticket, but
        # the UI currently has no signal that its APPSEC link was rejected.
        assert "не удалось привязать STS-42 к APPSEC-7" in caplog.text


async def test_tasks_and_project_picker_share_only_appsec_units(api, monkeypatch):
    client, ids = api
    calls = []
    def handler(request):
        body = json.loads(request.content)
        calls.append(body)
        return httpx.Response(200, json={"content": [
            {"code": "APPSEC-7", "summary": "Assessment"},
            {"code": "STS-42", "summary": "Exported vulnerability"},
            {"code": "APPSECX-3", "summary": "Other space"},
        ]})
    native_tracker(monkeypatch, handler)
    response = await client.get("tasks")
    assert response.status_code == 200, response.text
    tasks = response.json()["items"]
    assert [task["key"] for task in tasks] == ["APPSEC-7"]
    assert calls[0]["space"] == "APPSEC"
    assert "/swtr/swtr/" not in tasks[0]["url"]
    assert "space=APPSEC" in tasks[0]["url"]
    response = await client.put(f"projects/{ids['project']}", json={"appsec_ticket_key": tasks[0]["key"], "appsec_ticket_url": tasks[0]["url"]})
    assert response.status_code == 200, response.text
    assert response.json()["appsec_ticket_key"] == "APPSEC-7"
    detail = await client.get("tasks/APPSEC-7")
    assert detail.status_code == 200, detail.text
    assert calls[-1]["filters"]["units"] == ["APPSEC-7"]
    count = len(calls)
    assert (await client.get("tasks/STS-42")).status_code == 404
    assert len(calls) == count


@pytest.mark.parametrize("patch", [
    {"appsec_ticket_key": "STS-42"},
    {"appsec_ticket_url": "https://tracker.example/STS-42?space=STS"},
    {"appsec_ticket_url": "https://tracker.example/APPSEC-7?space=STS"},
    {"appsec_ticket_url": "https://tracker.example/APPSEC-7", "appsec_ticket_key": "APPSEC-8"},
    {"appsec_ticket_url": "http://[bad/APPSEC-7"},
])
async def test_wrong_space_or_conflicting_project_binding_does_not_change_project(api, patch):
    client, ids = api
    response = await client.put(f"projects/{ids['project']}", json=patch)
    assert response.status_code == 422, response.text
    project = (await client.get(f"projects/{ids['project']}")).json()
    assert project["appsec_ticket_key"] is None
    assert project["appsec_ticket_url"] is None


async def test_project_binding_can_be_replaced_and_cleared(api):
    client, ids = api
    root = f"projects/{ids['project']}"
    for key in ["APPSEC-1", "APPSEC-2"]:
        response = await client.put(root, json={"appsec_ticket_key": key})
        assert response.status_code == 200, response.text
        project = response.json()
        assert project["appsec_ticket_key"] == key
        assert key in project["appsec_ticket_url"]
    for patch in [{"appsec_ticket_key": None}, {"appsec_ticket_url": "  "}, {"appsec_ticket_key": None, "appsec_ticket_url": None}]:
        response = await client.put(root, json=patch)
        assert response.status_code == 200, response.text
        project = (await client.get(root)).json()
        assert project["appsec_ticket_key"] is None
        assert project["appsec_ticket_url"] is None


@pytest.mark.parametrize("ticket", [
    {}, {"appsec_ticket_key": None}, {"appsec_ticket_url": None},
    {"appsec_ticket_key": "   "}, {"appsec_ticket_url": "\t"},
    {"appsec_ticket_key": "", "appsec_ticket_url": ""},
])
async def test_project_creation_without_appsec_ticket_creates_membership_and_audit(api, ticket):
    from contextlib import aclosing
    from sqlalchemy import func, select
    from app.database import get_db
    from app.main import app
    from app.models import Project, ProjectMember, AuditLog
    client, _ = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        models = (Project, ProjectMember, AuditLog)
        before = [await db.scalar(select(func.count()).select_from(model)) for model in models]
        response = await client.post("projects", json={"name": "Optional ticket", **ticket})
        assert response.status_code == 201, response.text
        assert response.json()["appsec_ticket_key"] is None
        assert response.json()["appsec_ticket_url"] is None
        after = [await db.scalar(select(func.count()).select_from(model)) for model in models]
        assert after == [count + 1 for count in before]


@pytest.mark.parametrize("ticket", [
    {"appsec_ticket_key": "APPSEC-10"},
    {"appsec_ticket_url": "https://tracker.example/swtr/units/current/unit/APPSEC-10?space=APPSEC"},
])
async def test_project_creation_accepts_appsec_key_or_url(api, ticket):
    client, _ = api
    response = await client.post("projects", json={"name": "Required ticket", **ticket})
    assert response.status_code == 201, response.text
    assert response.json()["appsec_ticket_key"] == "APPSEC-10"


async def test_legacy_project_without_ticket_can_be_read_but_not_exported(api, monkeypatch):
    client, ids = api
    def unexpected(_request):
        raise AssertionError("Missing APPSEC ticket must block all external requests")
    native_tracker(monkeypatch, unexpected)
    root = f"projects/{ids['project']}"
    assert (await client.get(root)).status_code == 200
    # Unrelated partial API changes remain available for old projects.
    assert (await client.put(root, json={"name": "Legacy project"})).status_code == 200
    finding = await client.post(root + "/vulnerabilities", json={"title": "Legacy finding", "host_id": ids["host"]})
    assert finding.status_code == 201, finding.text
    response = await client.post(root + f"/vulnerabilities/{finding.json()['id']}/works/export", json={"assignee": "analyst"})
    assert response.status_code == 422, response.text
    assert "APPSEC" in response.json()["detail"]


@pytest.mark.parametrize("present", [(), ("ticket",), ("assignee",), ("versions",), ("ticket", "assignee"), ("ticket", "versions"), ("assignee", "versions")])
async def test_sts_export_reports_every_missing_project_field_before_network(api, monkeypatch, present):
    client, ids = api
    def unexpected(_request):
        raise AssertionError("Incomplete project must not contact Task Tracker")
    native_tracker(monkeypatch, unexpected)
    values = {"ticket": {"appsec_ticket_key": "APPSEC-1"}, "assignee": {"appsec_assignee": "analyst"},
              "versions": {"appsec_versions": [{"code": "v1", "name": "Platform 1.0"}]}}
    payload = {key: value for field in present for key, value in values[field].items()}
    root = f"projects/{ids['project']}"
    if payload:
        response = await client.put(root, json=payload)
        assert response.status_code == 200, response.text
    finding = await client.post(root + "/vulnerabilities", json={"title": "Incomplete project", "host_id": ids["host"]})
    assert finding.status_code == 201, finding.text
    response = await client.post(root + f"/vulnerabilities/{finding.json()['id']}/works/export", json={"assignee": "override.cannot.bypass.project"})
    assert response.status_code == 422, response.text
    missing = [label for field, label in (("ticket", "APPSEC-тикет"), ("assignee", "исполнитель"), ("versions", "затронутые версии")) if field not in present]
    assert response.json()["detail"] == "Заполните данные по проекту. Не заполнено: " + ", ".join(missing)


async def test_missing_appsec_scope_in_search_configuration_fails_before_network(api, monkeypatch):
    client, _ = api
    def unexpected(_request):
        raise AssertionError("An unscoped search must not reach Task Tracker")
    native_tracker(monkeypatch, unexpected)
    monkeypatch.setattr(get_settings(), "works_tasks_search_body", {"space": "STS"})
    response = await client.get("tasks")
    assert response.status_code == 503
    assert "APPSEC" in response.json()["detail"]


async def test_native_card_to_project_to_sts_keeps_login_and_every_version(api, monkeypatch):
    client, ids = api
    versions = [{'code': 'v-one', 'name': 'Platform V Stack 1.0.2'}, {'code': 'v-two', 'name': 'Platform V Stack 1.0.2-beta2'}]
    calls = []
    def handler(request):
        body = json.loads(request.content)
        calls.append((request.url.path, body))
        if request.url.path.endswith('/find'):
            assert body['filters']['units'] == ['APPSEC-70']
            return httpx.Response(200, json={'content': [{'code': 'APPSEC-70', 'summary': 'Assessment', 'attributes': {'assigned_to': {'username': 'analyst.login', 'displayName': 'Иван Иванов'}, 'affects_version_s_crpv': versions}}]})
        if request.url.path.endswith('/bug_appsec/create'):
            assert body['attributes']['assigned_to'] == 'analyst.login'
            assert body['attributes']['affects_version_s_crpv'] == [{'code': item['code'], 'name': item['name'], 'title': item['name']} for item in versions]
            return httpx.Response(200, json={'code': 'STS-80'})
        if request.url.path.endswith('/link'):
            assert body['destination'] == 'APPSEC-70'
            return httpx.Response(200, json={})
        raise AssertionError(request.url.path)
    native_tracker(monkeypatch, handler)
    task = await client.get('tasks/APPSEC-70')
    assert task.status_code == 200, task.text
    data = task.json()
    assert data['assignee_username'] == 'analyst.login' and data['affected_versions'] == versions
    response = await client.post('projects', json={'name': 'From native task', 'appsec_ticket_key': data['key'], 'appsec_ticket_url': data['url'], 'appsec_assignee': data['assignee_username'], 'appsec_assignee_name': data['assignee'], 'appsec_versions': data['affected_versions']})
    assert response.status_code == 201, response.text
    project = response.json()
    assert project['appsec_versions'] == versions
    assert project['appsec_assignee_name'] == 'Иван Иванов'
    root = f"projects/{project['id']}"
    # An unrelated edit must not truncate the array to its legacy first item.
    saved = await client.put(root, json={'name': 'Preserve both versions'})
    assert saved.status_code == 200 and saved.json()['appsec_versions'] == versions
    host = await client.post(root + '/hosts', json={'hostname': 'export.example'})
    assert host.status_code == 201, host.text
    finding = await client.post(root + '/vulnerabilities', json={'title': 'Export all versions', 'host_id': host.json()['id']})
    assert finding.status_code == 201, finding.text
    exported = await client.post(root + f"/vulnerabilities/{finding.json()['id']}/works/export", json={})
    assert exported.status_code == 200, exported.text
    assert [path.rsplit('/', 1)[-1] for path, _ in calls] == ['find', 'create', 'link']
    cleared = await client.put(root, json={'appsec_versions': []})
    assert cleared.status_code == 200 and cleared.json()['appsec_versions'] == []
    assert cleared.json()['appsec_version_code'] is None and cleared.json()['appsec_version_name'] is None


async def test_legacy_single_version_is_accepted_and_exposed_as_array(api):
    client, _ = api
    response = await client.post('projects', json={'name': 'Old client', 'appsec_ticket_key': 'APPSEC-1', 'appsec_version_code': 'v1', 'appsec_version_name': 'Platform 1'})
    assert response.status_code == 201, response.text
    assert response.json()['appsec_versions'] == [{'code': 'v1', 'name': 'Platform 1'}]


@pytest.mark.parametrize('versions', [None, 'version', ['v1'], [{'code': None, 'name': 'One'}], [{'code': '', 'name': 'One'}]])
async def test_invalid_project_version_arrays_are_422_and_leave_old_data(api, versions):
    client, ids = api
    root = f"projects/{ids['project']}"
    response = await client.put(root, json={'appsec_versions': versions})
    assert response.status_code == 422, response.text
    assert (await client.get(root)).json()['appsec_versions'] == []


async def test_demo_tasks_render_native_fields_and_block_external_exports(api, monkeypatch, tmp_path):
    client, ids = api
    target = tmp_path / 'tasks.json'
    target.write_text(json.dumps({'content': [{'code': 'APPSEC-900001', 'summary': '[DEMO] Assessment', 'attributes': {'assigned_to': {'username': 'tester', 'displayName': 'Test Analyst'}, 'affects_version_s_crpv': [{'code': 'v1', 'name': 'One'}, {'code': 'v2', 'name': 'Two'}]}}]}))
    monkeypatch.setattr(get_settings(), 'works_tasks_demo_file', str(target))
    monkeypatch.setattr(get_settings(), 'works_enabled', False)
    def unexpected(*args, **kwargs):
        raise AssertionError('Demo mode must not create any external HTTP clients')
    monkeypatch.setattr(WorksClient, '__init__', unexpected)
    response = await client.get('tasks')
    assert response.status_code == 200, response.text
    task = response.json()['items'][0]
    assert task['is_demo'] and len(task['affected_versions']) == 2
    assert task['assignee_username'] == 'tester'
    assert '/tasks/APPSEC-900001' in task['url']
    assert (await client.get('tasks/APPSEC-900001')).status_code == 200
    options = await client.get('works/versions', params={'q': 'Two'})
    assert options.status_code == 200 and options.json() == [{'code': 'v2', 'name': 'Two'}]
    assert (await client.get('works/config')).json()['enabled'] is False
    response = await client.post(f"projects/{ids['project']}/vulnerabilities/1/works/export", json={})
    assert response.status_code == 422
    monkeypatch.setattr(get_settings(), 'works_enabled', True)
    assert (await client.get('tasks')).status_code == 503


@pytest.mark.parametrize('content', ['not JSON', 'null', '[]' + ' ' * (1024 * 1024)])
async def test_invalid_demo_file_has_an_explicit_503(api, monkeypatch, tmp_path, content):
    client, _ = api
    target = tmp_path / 'tasks.json'
    target.write_text(content)
    monkeypatch.setattr(get_settings(), 'works_tasks_demo_file', str(target))
    monkeypatch.setattr(get_settings(), 'works_enabled', False)
    assert (await client.get('tasks')).status_code == 503


async def test_demo_seed_adds_stable_native_tickets_without_duplicate_projects(api, tmp_path):
    from contextlib import aclosing
    from sqlalchemy import func, select
    from app.database import get_db
    from app.main import app
    from app.models import Project
    from scripts.seed_ui_demo import seed_task_units
    _, ids = api
    target = tmp_path / 'tasks.json'
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        before = await db.scalar(select(func.count()).select_from(Project))
        for _ in range(2):
            result = await seed_task_units(db, ids['project'], target=target)
            await db.commit()
            assert result['demo_tickets'] == 9
            units = json.loads(target.read_text())['content']
            assert len(units) == 9 and len({unit['code'] for unit in units}) == 9
            assert len(units[1]['attributes']['affects_version_s_crpv']) == 2
            assert len(units[3]['attributes']['affects_version_s_crpv']) == 3
        assert await db.scalar(select(func.count()).select_from(Project)) == before
