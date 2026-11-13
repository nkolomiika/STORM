"""Удалить признак Cloudflare из адресов хостов."""
from alembic import op
import sqlalchemy as sa

revision = "a7b8c9d1e2f3"
down_revision = "f6a7b8c9d1e2"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Идемпотентно для dev-стендов, обновляющих схему при старте приложения.
    if "is_cloudflare" in {column["name"] for column in sa.inspect(op.get_bind()).get_columns("host_ip_addresses")}:
        op.drop_column("host_ip_addresses", "is_cloudflare")


def downgrade() -> None:
    # Удалённые значения флага не восстанавливаются; возвращаем неизвестное состояние.
    op.add_column("host_ip_addresses", sa.Column("is_cloudflare", sa.Boolean(), nullable=True))
