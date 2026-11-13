"""Добавить TRACE для импорта стандартных операций OpenAPI."""
from alembic import op
import sqlalchemy as sa

revision = "f6a7b8c9d1e2"
down_revision = "e5f6a7b8c9d1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TYPE http_method ADD VALUE IF NOT EXISTS 'TRACE'")


def downgrade() -> None:
    # Не подменяем метод уже сохранённых эндпоинтов при откате.
    if op.get_bind().scalar(sa.text("SELECT count(*) FROM endpoints WHERE method::text = 'TRACE'")):
        raise RuntimeError("Нельзя убрать TRACE: в endpoints остались операции с этим методом")
    op.execute("CREATE TYPE http_method_previous AS ENUM ('GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS','QUERY')")
    op.execute("ALTER TABLE endpoints ALTER COLUMN method TYPE http_method_previous USING method::text::http_method_previous")
    op.execute("DROP TYPE http_method")
    op.execute("ALTER TYPE http_method_previous RENAME TO http_method")
