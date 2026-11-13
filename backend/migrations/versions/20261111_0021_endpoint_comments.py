"""Хранение обсуждений эндпоинтов."""
from alembic import op
import sqlalchemy as sa

revision = "c9d1e2f3a4b5"
down_revision = "b8c9d1e2f3a4"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Совместимость с локальными стендами, где таблицу уже создал create_all.
    if not sa.inspect(op.get_bind()).has_table("endpoint_comments"):
        op.create_table(
            "endpoint_comments",
            sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
            sa.Column("endpoint_id", sa.Integer(), sa.ForeignKey("endpoints.id", ondelete="CASCADE"), nullable=False),
            sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
            sa.Column("content", sa.Text(), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        )
    indexes = {index["name"] for index in sa.inspect(op.get_bind()).get_indexes("endpoint_comments")}
    for column in ("endpoint_id", "user_id"):
        name = f"ix_endpoint_comments_{column}"
        if name not in indexes:
            op.create_index(name, "endpoint_comments", [column])


def downgrade() -> None:
    op.drop_table("endpoint_comments")
