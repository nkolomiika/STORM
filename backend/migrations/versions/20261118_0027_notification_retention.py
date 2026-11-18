"""Событие добавления уязвимости и индекс для семи суток хранения уведомлений."""
from alembic import op
import sqlalchemy as sa

revision = "20261118_0027"
down_revision = "20261117_0026"
branch_labels = None
depends_on = None


def upgrade():
    """Добавляет тип уведомления и индекс; старые данные очищаются фоновым обслуживанием."""
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        with op.get_context().autocommit_block():
            op.execute("ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'VULN_CREATED'")
    indexes = {item["name"] for item in sa.inspect(bind).get_indexes("notifications")}
    if "ix_notifications_created_at" not in indexes:
        op.create_index("ix_notifications_created_at", "notifications", ["created_at"])


def downgrade():
    """Сохраняет метку enum PostgreSQL, удаляя события неподдерживаемого старым кодом типа."""
    op.execute("DELETE FROM notifications WHERE type = 'VULN_CREATED'")
    op.drop_index("ix_notifications_created_at", table_name="notifications")
