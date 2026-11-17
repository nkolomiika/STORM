"""IDOR: реальные HTTP/БД, участник A без доступа к B и scoped Agent API token."""
from contextlib import aclosing
import re

import pytest
import pytest_asyncio

from app.config import get_settings
from app.database import get_db
from app.main import app
from app.models import (ProjectMember, ProjectNote, ProjectCredential, WorksIssueLink,
                        File, HostFarmJob, JsFile, Notification)
from app.security import create_access_token, encrypt_secret

pytestmark = pytest.mark.asyncio

PROJECT_CASES = [(method.upper(), path) for path, methods in app.openapi()['paths'].items()
                 if path.startswith('/api/v1/projects/{project_id}')
                 for method in methods if method in ('get', 'post', 'put', 'patch', 'delete')]
assert len(PROJECT_CASES) >= 50, 'Матрица IDOR не должна незаметно опустеть'


@pytest_asyncio.fixture
async def member_api(api, monkeypatch):
    client, ids = api
    monkeypatch.setattr(get_settings(), 'works_enabled', False)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        db.add(ProjectMember(project_id=ids['project'], user_id=ids['outsider']))
        items = {
            'foreign_note': ProjectNote(project_id=ids['foreign_project'], title='private-note-B', content='TOP_SECRET_B', created_by=ids['admin']),
            'foreign_cred': ProjectCredential(project_id=ids['foreign_project'], username='private-login-B', password_encrypted=encrypt_secret('TOP_SECRET_PASSWORD'), created_by=ids['admin']),
            'foreign_file': File(vulnerability_id=ids['foreign_vuln'], original_name='private-file-B.txt', content_type='text/plain', size_bytes=4, minio_bucket='test', minio_key='private-B', uploaded_by=ids['admin']),
            'foreign_job': HostFarmJob(project_id=ids['foreign_project'], created_by=ids['admin'], kind='hosts', raw='private-target-B'),
            'foreign_js': JsFile(project_id=ids['foreign_project'], host_id=ids['foreign_host'], url='https://private.example/private.js'),
            'foreign_notification': Notification(user_id=ids['admin']),
            'own_notification': Notification(user_id=ids['outsider']),
        }
        db.add_all(list(items.values()))
        db.add(WorksIssueLink(vulnerability_id=ids['foreign_vuln'], works_key='STS-999', works_url='https://tracker.example/private-B', created_by=ids['admin']))
        await db.commit()
        ids.update({name: row.id for name, row in items.items()})
    client.cookies.set('access_token', create_access_token(ids['outsider']))
    return client, ids


@pytest.mark.parametrize('method,template', PROJECT_CASES, ids=[f'{method} {path}' for method, path in PROJECT_CASES])
async def test_every_project_endpoint_refuses_foreign_project(member_api, method, template):
    client, ids = member_api
    path = template.replace('{project_id}', str(ids['foreign_project']))
    path = re.sub(r'\{[^}]+\}', '1', path)
    payload = {'user_id': ids['outsider']} if template.endswith('/members') and method == 'POST' else {}
    response = await client.request(method, 'https://test.local'+path, json=payload)
    assert response.status_code == 403, f'{method} {path}: {response.status_code} {response.text}'
    assert 'TOP_SECRET' not in response.text


NESTED_CASES = [
    ('GET', 'hosts/{foreign_host}', None),
    ('GET', 'hosts/{host}/ports/{foreign_port}', None),
    ('PUT', 'hosts/{host}/ports/{port}/services/{foreign_service}', {'name': 'overwrite'}),
    ('PUT', 'hosts/{host}/endpoints/{foreign_endpoint}', {'path': '/overwrite'}),
    ('GET', 'notes/{foreign_note}', None),
    ('PUT', 'notes/{foreign_note}', {'title': 'overwrite'}),
    ('DELETE', 'notes/{foreign_note}', None),
    ('GET', 'vulnerabilities/{foreign_vuln}', None),
    ('GET', 'vulnerabilities/{foreign_vuln}/comments', None),
    ('POST', 'vulnerabilities/{foreign_vuln}/comments', {'content': 'overwrite'}),
    ('GET', 'vulnerabilities/{foreign_vuln}/files', None),
    ('DELETE', 'vulnerabilities/{foreign_vuln}/files/{foreign_file}', None),
    ('GET', 'vulnerabilities/{foreign_vuln}/works', None),
    ('PUT', 'credentials/{foreign_cred}', {'username': 'overwrite'}),
    ('DELETE', 'credentials/{foreign_cred}', None),
    ('GET', 'host-farm/jobs/{foreign_job}', None),
    ('GET', 'ip-farm/jobs/{foreign_job}', None),
    ('GET', 'js-farm/jobs/{foreign_job}', None),
    ('GET', 'scanner/subdomains/jobs/{foreign_job}', None),
    ('GET', 'scanner/port-scan/jobs/{foreign_job}', None),
    ('GET', 'scanner/reverse/jobs/{foreign_job}', None),
]


@pytest.mark.parametrize('method,suffix,payload', NESTED_CASES)
async def test_foreign_child_cannot_be_read_or_mutated_under_own_project(member_api, method, suffix, payload):
    client, ids = member_api
    full_path = f"/api/v1/projects/{ids['project']}/"+suffix.format(**ids)
    assert any(method.lower() in methods and re.fullmatch(re.sub(r'\{[^}]+\}', '[^/]+', template), full_path)
               for template, methods in app.openapi()['paths'].items()), f'Проверьте маршрут теста: {method} {full_path}'
    response = await client.request(method, f"projects/{ids['project']}/"+suffix.format(**ids), json=payload)
    assert response.status_code == 404, f'{method} {suffix}: {response.status_code} {response.text}'
    assert 'TOP_SECRET' not in response.text and 'private-B' not in response.text


async def test_notifications_and_file_downloads_are_owner_scoped(member_api):
    client, ids = member_api
    response = await client.get(f"files/{ids['foreign_file']}/download")
    assert response.status_code == 403
    response = await client.patch(f"notifications/{ids['foreign_notification']}/read")
    assert response.status_code == 404
    assert (await client.patch('notifications/read-all')).status_code == 204
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert (await db.get(Notification, ids['foreign_notification'])).is_read is False
        assert (await db.get(Notification, ids['own_notification'])).is_read is True


async def test_scoped_agent_token_cannot_cross_project_or_forge_parent(member_api):
    client, ids = member_api
    created = await client.post('agent-tokens', json={'name': 'IDOR audit', 'project_ids': [ids['project']],
        'scopes': ['projects:read', 'assets:read', 'notes:read', 'notes:write', 'vulns:read', 'vulns:write']})
    assert created.status_code == 201, created.text
    headers = {'Authorization': 'Bearer '+created.json()['token']}
    base = 'https://test.local/api/v2/projects/'
    assert (await client.get(base+str(ids['project']), headers=headers)).status_code == 200
    assert (await client.get(base+str(ids['foreign_project']), headers=headers)).status_code == 403
    for suffix in [f"hosts/{ids['foreign_host']}", f"notes/{ids['foreign_note']}"]:
        response = await client.get(base+str(ids['project'])+'/'+suffix, headers=headers)
        assert response.status_code == 404, response.text


async def test_foreign_sts_link_is_denied_before_any_tt_request(member_api, monkeypatch):
    from unittest.mock import Mock
    client, ids = member_api
    monkeypatch.setattr(get_settings(), 'works_enabled', True)
    monkeypatch.setattr(get_settings(), 'works_api_token', 'test-only')
    monkeypatch.setattr(get_settings(), 'works_base_url', 'https://tracker.example/swtr')
    external = Mock(side_effect=AssertionError('Permission must be checked before TT'))
    monkeypatch.setattr('app.services.WorksClient', external)
    response = await client.get(f"projects/{ids['project']}/vulnerabilities/{ids['foreign_vuln']}/works")
    assert response.status_code == 404
    external.assert_not_called()
