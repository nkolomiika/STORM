"""Новая миграция индексов: реальные PostgreSQL CONCURRENTLY, up/down/idempotency."""
from contextlib import aclosing
import importlib.util
from pathlib import Path

from alembic.migration import MigrationContext
from alembic.operations import Operations
import pytest
from sqlalchemy import inspect, text

from app.database import get_db
from app.main import app


@pytest.mark.asyncio
async def test_asset_lookup_indexes_upgrade_downgrade(api):
    path = Path(__file__).resolve().parents[2] / "migrations/versions/20261110_0020_asset_lookup_indexes.py"
    spec = importlib.util.spec_from_file_location("asset_lookup_indexes", path)
    migration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(migration)
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        async with db.bind.connect() as conn:
            schema = await conn.scalar(text("SELECT current_schema()"))
            assert schema.startswith("test_")
            await conn.rollback()

            def exercise(connection):
                context = MigrationContext.configure(connection)
                with context.begin_transaction(), Operations.context(context):
                    migration.downgrade()
                    assert "ix_ports_host_id" not in {index["name"] for index in inspect(connection).get_indexes("ports")}
                    assert "ix_services_port_id" not in {index["name"] for index in inspect(connection).get_indexes("services")}
                    migration.upgrade()
                    migration.upgrade()
                    assert "ix_ports_host_id" in {index["name"] for index in inspect(connection).get_indexes("ports")}
                    assert "ix_services_port_id" in {index["name"] for index in inspect(connection).get_indexes("services")}

            await conn.run_sync(exercise)
