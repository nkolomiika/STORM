"""Код продукта и массив компонентов проекта для обязательных полей STS."""
from alembic import op
import sqlalchemy as sa

revision = '20261117_0026'
down_revision = 'a5b6c7d8e9f0'
branch_labels = None
depends_on = None


def upgrade():
    """Добавляет необязательное поле; заполнение требуется перед экспортом."""
    columns = {column['name'] for column in sa.inspect(op.get_bind()).get_columns('projects')}
    if 'appsec_product_code' not in columns:
        op.add_column('projects', sa.Column('appsec_product_code', sa.String(255), nullable=True))
    if 'appsec_components' not in columns:
        op.add_column('projects', sa.Column('appsec_components', sa.JSON(), nullable=False, server_default='[]'))
    op.execute("UPDATE projects SET appsec_components = json_build_array(json_build_object('code', appsec_component_code, 'name', COALESCE(appsec_component_name, appsec_component_code))) WHERE json_array_length(appsec_components) = 0 AND appsec_component_code IS NOT NULL")


def downgrade():
    """Удаляет поле кода продукта при откате миграции."""
    op.drop_column('projects', 'appsec_product_code')
    op.drop_column('projects', 'appsec_components')
