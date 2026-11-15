"""Удаляет неиспользуемое описание проекта, не затрагивая другие описания."""
from alembic import op
import sqlalchemy as sa

revision = 'a5b6c7d8e9f0'
down_revision = 'f4a5b6c7d8e9'
branch_labels = None
depends_on = None


def upgrade():
    columns = {column['name'] for column in sa.inspect(op.get_bind()).get_columns('projects')}
    if 'description' in columns:
        op.drop_column('projects', 'description')


def downgrade():
    columns = {column['name'] for column in sa.inspect(op.get_bind()).get_columns('projects')}
    if 'description' not in columns:
        op.add_column('projects', sa.Column('description', sa.Text(), nullable=True))
