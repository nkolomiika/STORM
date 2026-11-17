"""Upgrade существующих проектов сохраняет старый компонент и остальные данные."""
from contextlib import aclosing
from pathlib import Path
import importlib.util

import pytest
from alembic.migration import MigrationContext
from alembic.operations import Operations
from sqlalchemy import inspect, text

from app.database import get_db
from app.main import app


@pytest.mark.asyncio
async def test_project_product_migration_is_idempotent_and_keeps_components(api):
    _, ids = api
    path = Path(__file__).resolve().parents[2]/'migrations/versions/20261117_0026_project_product_code.py'
    spec = importlib.util.spec_from_file_location('project_product_migration', path)
    migration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(migration)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        async with db.bind.begin() as conn:
            assert (await conn.scalar(text('SELECT current_schema()'))).startswith('test_')
            def exercise(connection):
                context = MigrationContext.configure(connection)
                with Operations.context(context):
                    migration.downgrade()
                    connection.execute(text("UPDATE projects SET appsec_component_code='old-id', appsec_component_name='Old component' WHERE id=:id"), {'id': ids['project']})
                    migration.upgrade()
                    migration.upgrade()
                    row = connection.execute(text('SELECT name, appsec_product_code, appsec_components FROM projects WHERE id=:id'), {'id': ids['project']}).one()
                    assert row.name == 'API test' and row.appsec_product_code is None
                    assert row.appsec_components == [{'code': 'old-id', 'name': 'Old component'}]
                    assert {'appsec_product_code', 'appsec_components'} <= {column['name'] for column in inspect(connection).get_columns('projects')}
                    connection.execute(text("UPDATE projects SET appsec_components='[{\"code\":\"one\",\"name\":\"One\"},{\"code\":\"two\",\"name\":\"Two\"}]' WHERE id=:id"), {'id': ids['project']})
                    migration.upgrade()
                    values = connection.scalar(text('SELECT appsec_components FROM projects WHERE id=:id'), {'id': ids['project']})
                    assert len(values) == 2
            await conn.run_sync(exercise)
