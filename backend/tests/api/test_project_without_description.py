"""Проекты больше не хранят описание; остальные сущности сохраняют свой текст."""
from contextlib import aclosing

import pytest
from sqlalchemy import func, inspect, select

from app.database import get_db
from app.main import app
from app.models import Project

pytestmark = pytest.mark.asyncio


async def test_project_crud_and_database_have_no_description(api):
    client, _ = api
    response = await client.post('projects', json={'name': 'No description', 'appsec_ticket_key': 'APPSEC-21'})
    assert response.status_code == 201, response.text
    project = response.json()
    assert 'description' not in project
    root = f"projects/{project['id']}"
    response = await client.put(root, json={'name': 'Renamed without description'})
    assert response.status_code == 200 and 'description' not in response.json()
    assert 'description' not in (await client.get(root)).json()
    assert all('description' not in item for item in (await client.get('projects')).json()['items'])
    host = await client.post(root + '/hosts', json={'hostname': 'description.example'})
    assert host.status_code == 201, host.text
    endpoint = await client.post(root + f"/hosts/{host.json()['id']}/endpoints", json={'path': '/retained', 'method': 'GET', 'description': 'Endpoint description stays'})
    assert endpoint.status_code == 201, endpoint.text
    assert endpoint.json()['description'] == 'Endpoint description stays'
    finding = await client.post(root + '/vulnerabilities', json={'title': 'Description stays', 'host_id': host.json()['id'], 'description': 'Finding description stays'})
    assert finding.status_code == 201, finding.text
    assert finding.json()['description'] == 'Finding description stays'
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        async with db.bind.connect() as conn:
            def verify(connection):
                schema = inspect(connection)
                assert 'description' not in {column['name'] for column in schema.get_columns('projects')}
                for table in ('endpoints', 'vulnerabilities'):
                    assert 'description' in {column['name'] for column in schema.get_columns(table)}
            await conn.run_sync(verify)


@pytest.mark.parametrize('value', ['Removed text', '', None])
async def test_removed_description_is_rejected_without_writes(api, value):
    client, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        before = await db.scalar(select(func.count()).select_from(Project))
        created = await client.post('projects', json={'name': 'Must not create', 'appsec_ticket_key': 'APPSEC-22', 'description': value})
        assert created.status_code == 422, created.text
        assert await db.scalar(select(func.count()).select_from(Project)) == before
    root = f"projects/{ids['project']}"
    original = (await client.get(root)).json()
    updated = await client.put(root, json={'name': 'Must not change', 'description': value})
    assert updated.status_code == 422, updated.text
    assert (await client.get(root)).json()['name'] == original['name']


async def test_project_openapi_schemas_do_not_expose_description(api):
    from app.schemas import ProjectCreate, ProjectUpdate, ProjectOut
    for schema in (ProjectCreate, ProjectUpdate, ProjectOut):
        assert 'description' not in schema.model_json_schema()['properties']
