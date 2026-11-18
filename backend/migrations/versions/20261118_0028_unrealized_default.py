"""Критичность новой находки без CVSS по умолчанию UNREALIZED."""
from alembic import op

revision = "20261118_0028"
down_revision = "20261118_0027"
branch_labels = None
depends_on = None


def upgrade():
    """Меняет DEFAULT, сохраняя критичность существующих находок."""
    if op.get_bind().dialect.name == "postgresql":
        with op.get_context().autocommit_block():
            op.execute("ALTER TYPE vuln_severity ADD VALUE IF NOT EXISTS 'UNREALIZED'")
        op.execute("ALTER TABLE vulnerabilities ALTER COLUMN severity SET DEFAULT 'UNREALIZED'")
    else:
        with op.batch_alter_table("vulnerabilities") as batch:
            batch.alter_column("severity", server_default="UNREALIZED")


def downgrade():
    """Возвращает прежний DEFAULT INFO без изменения существующих данных."""
    if op.get_bind().dialect.name == "postgresql":
        op.execute("ALTER TABLE vulnerabilities ALTER COLUMN severity SET DEFAULT 'INFO'")
    else:
        with op.batch_alter_table("vulnerabilities") as batch:
            batch.alter_column("severity", server_default="INFO")
