"""Generic mention contexts and duplicate-safe deadline reminders."""
from alembic import op
import sqlalchemy as sa

revision = "d2e3f4a5b6c7"
down_revision = "c9d1e2f3a4b5"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        with op.get_context().autocommit_block():
            op.execute("ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'PROJECT_DEADLINE'")
    columns = {column["name"] for column in sa.inspect(bind).get_columns("notifications")}
    if "context_data" not in columns:
        op.add_column("notifications", sa.Column("context_data", sa.JSON(), nullable=True))
    if "dedupe_key" not in columns:
        op.add_column("notifications", sa.Column("dedupe_key", sa.String(255), nullable=True))
    indexes = {index["name"] for index in sa.inspect(bind).get_indexes("notifications")}
    if "ix_notifications_dedupe_key" not in indexes:
        op.create_index("ix_notifications_dedupe_key", "notifications", ["dedupe_key"], unique=True)


def downgrade():
    # Enum labels remain for PostgreSQL compatibility, as with earlier revisions.
    op.execute("DELETE FROM notifications WHERE type = 'PROJECT_DEADLINE'")
    op.drop_index("ix_notifications_dedupe_key", table_name="notifications")
    op.drop_column("notifications", "dedupe_key")
    op.drop_column("notifications", "context_data")
