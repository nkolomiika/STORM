"""Индексы FK для загрузки портов и сервисов без полного сканирования."""
from alembic import op

revision = "b8c9d1e2f3a4"
down_revision = "a7b8c9d1e2f3"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # CONCURRENTLY не блокирует запись в большие таблицы; PostgreSQL требует
    # выполнять его вне транзакции миграции.
    with op.get_context().autocommit_block():
        op.execute("CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_ports_host_id ON ports (host_id)")
        op.execute("CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_services_port_id ON services (port_id)")


def downgrade() -> None:
    with op.get_context().autocommit_block():
        op.execute("DROP INDEX CONCURRENTLY IF EXISTS ix_services_port_id")
        op.execute("DROP INDEX CONCURRENTLY IF EXISTS ix_ports_host_id")
