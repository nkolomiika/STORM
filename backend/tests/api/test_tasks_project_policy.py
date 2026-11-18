"""Роли создания, приватные связи Tasks и настоящая пагинация AS21 без внешней сети."""
import asyncio
from contextlib import aclosing
import json

import httpx
import pytest
from sqlalchemy import func, select

from app.config import get_settings
from app.database import get_db
from app.enums import ProjectRole, UserRole
from app.main import app
from app.models import Project, ProjectMember, User
from app.security import create_access_token
from app.task_tracker import TaskTrackerService
from app.works import WorksClient

pytestmark = pytest.mark.asyncio


@pytest.mark.parametrize('role,project_role,expected', [
    (UserRole.ADMIN, ProjectRole.PENTESTER, 201),
    (UserRole.PENTESTER, ProjectRole.LEAD, 201),
    (UserRole.PENTESTER, ProjectRole.PENTESTER, 403),
])
async def test_only_admin_or_lead_can_create_project(api, role, project_role, expected):
    client, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        actor = await db.get(User, ids['outsider'])
        actor.role, actor.project_role = role, project_role
        await db.commit()
    client.cookies.set('access_token', create_access_token(ids['outsider']))
    response = await client.post('projects', json={'name': 'Project from task', 'appsec_ticket_key': 'APPSEC-123'})
    assert response.status_code == expected, response.text
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        projects = list(await db.scalars(select(Project).where(Project.name == 'Project from task')))
        if expected == 403:
            assert projects == []
        else:
            assert len(projects) == 1 and projects[0].created_by == ids['outsider']
            assert await db.scalar(select(ProjectMember.id).where(ProjectMember.project_id == projects[0].id,
                ProjectMember.user_id == ids['outsider'])) is not None
            assert (await client.get(f"projects/{projects[0].id}")).status_code == 200
            if role != UserRole.ADMIN:
                assert (await client.get(f"projects/{ids['foreign_project']}")).status_code == 403


async def test_task_links_reveal_only_accessible_project_ids(api, monkeypatch):
    client, ids = api
    units = [{'code': f'APPSEC-{i}', 'summary': f'Ticket {i}'} for i in range(1, 4)]
    async def request(self, **kwargs):
        return {'content': units, 'hasNext': False, 'totalElements': 3}
    monkeypatch.setattr(TaskTrackerService, '_request', request)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        (await db.get(Project, ids['project'])).appsec_ticket_key = 'APPSEC-1'
        (await db.get(Project, ids['foreign_project'])).appsec_ticket_key = 'APPSEC-2'
        db.add(ProjectMember(project_id=ids['project'], user_id=ids['outsider']))
        await db.commit()
    client.cookies.set('access_token', create_access_token(ids['outsider']))
    response = await client.get('tasks')
    assert response.status_code == 200, response.text
    own, private, missing = response.json()['items']
    assert own['project_exists'] and own['project_id'] == ids['project']
    assert private['project_exists'] and private['project_id'] is None
    assert missing['project_exists'] is False and missing['project_id'] is None
    assert 'Private project' not in response.text
    detail = await client.get('tasks/APPSEC-2')
    assert detail.status_code == 200 and detail.json()['project_id'] is None
    assert (await client.get(f"projects/{ids['foreign_project']}")).status_code == 403


async def test_native_tasks_are_requested_in_pages_of_twenty(api, monkeypatch):
    client, _ = api
    settings = get_settings()
    for name, value in {'works_enabled': True, 'works_tasks_demo_file': '', 'works_api_token': 'test',
                        'works_base_url': 'https://tracker.example/swtr',
                        'works_tasks_search_path': '/rest/api/unit/v3/find/tql',
                        'works_tasks_search_body': {'space': '{space}', 'page': {'page': 7, 'size': 100}}}.items():
        monkeypatch.setattr(settings, name, value)
    calls = []
    def handler(request):
        page = json.loads(request.content)['page']
        calls.append(page)
        start = page['page'] * 20
        content = [{'unit': {'code': f'APPSEC-{i+1}', 'summary': f'Ticket {i+1}'}, 'attributes': []}
                   for i in range(start, min(start+20, 45))]
        return httpx.Response(200, json={'content': content, 'hasNext': start+20 < 45,
                                         'pageNumber': page['page'], 'totalElements': 45})
    def init(self):
        self._base = settings.works_base_url
        self._client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    monkeypatch.setattr(WorksClient, '__init__', init)
    pages = [(await client.get('tasks', params={'page_number': page})).json() for page in range(3)]
    assert [len(page['items']) for page in pages] == [20, 20, 5]
    assert [page['next_page_token'] for page in pages] == ['1', '2', None]
    assert [page['is_last'] for page in pages] == [False, False, True]
    assert all(page['total'] == 45 for page in pages)
    assert calls == [{'page': page, 'size': 20} for page in range(3)]
    assert settings.works_tasks_search_body['page'] == {'page': 7, 'size': 100}
    assert len({task['key'] for page in pages for task in page['items']}) == 45
    for invalid in [-1, 1_000_001, 'bad']:
        assert (await client.get('tasks', params={'page_number': invalid})).status_code == 422
    assert len(calls) == 3


async def test_ticket_cannot_be_bound_to_two_projects_even_in_parallel(api):
    client, _ = api
    responses = await asyncio.gather(*[client.post('projects', json={'name': f'Parallel {i}', 'appsec_ticket_key': 'APPSEC-123'}) for i in range(2)])
    assert sorted(response.status_code for response in responses) == [201, 409], [r.text for r in responses]
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert await db.scalar(select(func.count()).select_from(Project).where(Project.appsec_ticket_key == 'APPSEC-123')) == 1
    winner = next(response.json() for response in responses if response.status_code == 201)
    update = await client.put(f"projects/{winner['id']}", json={'appsec_ticket_key': 'APPSEC-123'})
    assert update.status_code == 200, update.text


@pytest.mark.parametrize('kind,expected', [('admin', 204), ('lead_member', 204), ('creator', 204), ('member', 403), ('lead_outsider', 403)])
async def test_project_deletion_is_limited_to_admin_creator_or_member_lead(api, kind, expected):
    client, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        user = await db.get(User, ids['outsider'])
        if kind == 'admin':
            user.role = UserRole.ADMIN
        if kind.startswith('lead'):
            user.project_role = ProjectRole.LEAD
        if kind not in {'lead_outsider', 'creator'}:
            db.add(ProjectMember(project_id=ids['project'], user_id=user.id))
        if kind == 'creator':
            (await db.get(Project, ids['project'])).created_by = user.id
        await db.commit()
    client.cookies.set('access_token', create_access_token(ids['outsider']))
    response = await client.delete(f"projects/{ids['project']}")
    assert response.status_code == expected, response.text
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        assert ((await db.get(Project, ids['project'])) is None) is (expected == 204)
