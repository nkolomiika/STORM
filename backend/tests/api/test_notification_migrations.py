from contextlib import aclosing
import importlib.util
from pathlib import Path

from alembic.migration import MigrationContext
from alembic.operations import Operations
import pytest
from sqlalchemy import inspect, text

from app.database import get_db
from app.main import app


def load(name):
    path=Path(__file__).resolve().parents[2]/'migrations/versions'/name
    spec=importlib.util.spec_from_file_location(name[:-3],path)
    module=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.mark.asyncio
async def test_notification_retention_migration_upgrades_legacy_enum_and_preserves_old_events(api):
    from app.enums import NotificationType
    migration = load("20261118_0027_notification_retention.py")
    _, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        async with db.bind.connect() as conn:
            assert (await conn.scalar(text("SELECT current_schema()"))).startswith("test_")
            # Воспроизводим старую БД, где тип нового события и индекс ещё отсутствуют.
            await conn.execute(text("DROP INDEX ix_notifications_created_at"))
            await conn.execute(text("ALTER TYPE notification_type RENAME TO notification_type_before_test"))
            labels = ", ".join("'" + item.name + "'" for item in NotificationType if item != NotificationType.VULN_CREATED)
            await conn.execute(text("CREATE TYPE notification_type AS ENUM (" + labels + ")"))
            await conn.execute(text("ALTER TABLE notifications ALTER COLUMN type TYPE notification_type USING type::text::notification_type"))
            await conn.execute(text("DROP TYPE notification_type_before_test"))
            await conn.commit()

            def exercise(connection):
                context = MigrationContext.configure(connection)
                with context.begin_transaction(), Operations.context(context):
                    migration.upgrade()
                    migration.upgrade()
                    indexes = {item["name"] for item in inspect(connection).get_indexes("notifications")}
                    assert "ix_notifications_created_at" in indexes
                    for kind in ("MENTION", "VULN_CREATED"):
                        connection.execute(text("INSERT INTO notifications (user_id, type, is_read) VALUES (:user_id, CAST(:kind AS notification_type), false)"),
                                           {"user_id": ids["admin"], "kind": kind})
                    migration.downgrade()
                    assert connection.scalar(text("SELECT count(*) FROM notifications")) == 1
                    assert connection.scalar(text("SELECT type::text FROM notifications")) == "MENTION"
                    assert "ix_notifications_created_at" not in {item["name"] for item in inspect(connection).get_indexes("notifications")}
                    migration.upgrade()
                    assert "ix_notifications_created_at" in {item["name"] for item in inspect(connection).get_indexes("notifications")}
                    assert connection.scalar(text("SELECT count(*) FROM notifications")) == 1

            await conn.run_sync(exercise)


@pytest.mark.asyncio
async def test_project_description_migration_only_removes_the_requested_column(api):
    migration = load('20261115_0025_remove_project_description.py')
    _, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        async with db.bind.begin() as conn:
            assert (await conn.scalar(text('SELECT current_schema()'))).startswith('test_')
            def exercise(connection):
                with Operations.context(MigrationContext.configure(connection)):
                    original = connection.scalar(text('SELECT name FROM projects WHERE id=:id'), {'id': ids['project']})
                    migration.downgrade()
                    connection.execute(text("UPDATE projects SET description='Removed project field' WHERE id=:id"), {'id': ids['project']})
                    migration.upgrade()
                    migration.upgrade()
                    assert 'description' not in {column['name'] for column in inspect(connection).get_columns('projects')}
                    assert connection.scalar(text('SELECT name FROM projects WHERE id=:id'), {'id': ids['project']}) == original
                    for table in ('endpoints', 'vulnerabilities'):
                        assert 'description' in {column['name'] for column in inspect(connection).get_columns(table)}
                    migration.downgrade()
                    assert connection.scalar(text('SELECT description FROM projects WHERE id=:id'), {'id': ids['project']}) is None
                    migration.upgrade()
            await conn.run_sync(exercise)


@pytest.mark.asyncio
async def test_project_version_array_migration_preserves_legacy_and_multiple_versions(api):
    migration = load('20261115_0024_project_tracker_metadata.py')
    _, ids = api
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db = await anext(stream)
        async with db.bind.begin() as conn:
            assert (await conn.scalar(text('SELECT current_schema()'))).startswith('test_')
            def exercise(connection):
                with Operations.context(MigrationContext.configure(connection)):
                    migration.downgrade()
                    connection.execute(text("UPDATE projects SET appsec_version_code='legacy', appsec_version_name='Platform 1' WHERE id=:id"), {'id': ids['project']})
                    migration.upgrade()
                    assert connection.scalar(text("SELECT appsec_versions->0->>'code' FROM projects WHERE id=:id"), {'id': ids['project']}) == 'legacy'
                    connection.execute(text("UPDATE projects SET appsec_versions='[{\"code\":\"v1\",\"name\":\"One\"},{\"code\":\"v2\",\"name\":\"Two\"}]'::json WHERE id=:id"), {'id': ids['project']})
                    migration.upgrade()
                    assert connection.scalar(text('SELECT json_array_length(appsec_versions) FROM projects WHERE id=:id'), {'id': ids['project']}) == 2
            await conn.run_sync(exercise)


@pytest.mark.asyncio
async def test_notification_columns_migrate_and_reapply(api):
    migration=load('20261114_0022_notification_context_deadlines.py')
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db=await anext(stream)
        async with db.bind.connect() as conn:
            assert (await conn.scalar(text('SELECT current_schema()'))).startswith('test_')
            await conn.rollback()
            def exercise(connection):
                context=MigrationContext.configure(connection)
                with context.begin_transaction(),Operations.context(context):
                    migration.downgrade()
                    assert 'context_data' not in {col['name'] for col in inspect(connection).get_columns('notifications')}
                    migration.upgrade()
                    migration.upgrade()
                    assert {'context_data','dedupe_key'} <= {col['name'] for col in inspect(connection).get_columns('notifications')}
                    indexes=inspect(connection).get_indexes('notifications')
                    assert any(index['name']=='ix_notifications_dedupe_key' and index['unique'] for index in indexes)
            await conn.run_sync(exercise)


@pytest.mark.asyncio
async def test_retired_tracker_storage_preserves_rows_and_reapplies(api):
    migration=load('20261114_0023_retire_legacy_tracker_tables.py')
    async with aclosing(app.dependency_overrides[get_db]()) as stream:
        db=await anext(stream)
        async with db.bind.begin() as conn:
            assert (await conn.scalar(text('SELECT current_schema()'))).startswith('test_')
            def exercise(connection):
                context=MigrationContext.configure(connection)
                with Operations.context(context):
                    for old,_ in migration.TABLES:
                        connection.execute(text(f'CREATE TABLE {old} (id INTEGER PRIMARY KEY, value TEXT)'))
                        connection.execute(text(f"INSERT INTO {old} VALUES (1,'preserved')"))
                    migration.upgrade()
                    migration.upgrade()
                    for _,new in migration.TABLES:
                        assert connection.scalar(text(f'SELECT value FROM {new} WHERE id=1'))=='preserved'
                    migration.downgrade()
                    for old,_ in migration.TABLES:
                        assert connection.scalar(text(f'SELECT value FROM {old} WHERE id=1'))=='preserved'
                    migration.upgrade()
            await conn.run_sync(exercise)
