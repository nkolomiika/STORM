"""Store every affected version and the assignee's display name."""
from alembic import op
import sqlalchemy as sa

revision = 'f4a5b6c7d8e9'
down_revision = 'e3f4a5b6c7d8'
branch_labels = None
depends_on = None


def upgrade():
    columns = {column['name'] for column in sa.inspect(op.get_bind()).get_columns('projects')}
    if 'appsec_versions' not in columns:
        op.add_column('projects', sa.Column('appsec_versions', sa.JSON(), nullable=False, server_default=sa.text("'[]'")))
    if 'appsec_assignee_name' not in columns:
        op.add_column('projects', sa.Column('appsec_assignee_name', sa.String(255), nullable=True))
    if op.get_bind().dialect.name == 'postgresql':
        op.execute(sa.text("UPDATE projects SET appsec_versions = json_build_array(json_build_object('code', appsec_version_code, 'name', COALESCE(appsec_version_name, appsec_version_code))) WHERE json_array_length(appsec_versions) = 0 AND appsec_version_code IS NOT NULL"))
        return
    projects = sa.table('projects', sa.column('id', sa.Integer()), sa.column('appsec_versions', sa.JSON()), sa.column('appsec_version_code', sa.String()), sa.column('appsec_version_name', sa.String()))
    # Keep existing array values; old single-version records become one item.
    for row in op.get_bind().execute(sa.select(projects)).mappings():
        if not row['appsec_versions'] and row['appsec_version_code']:
            op.get_bind().execute(projects.update().where(projects.c.id == row['id']).values(appsec_versions=[{'code': row['appsec_version_code'], 'name': row['appsec_version_name'] or row['appsec_version_code']}]))


def downgrade():
    columns = {column['name'] for column in sa.inspect(op.get_bind()).get_columns('projects')}
    for name in ('appsec_assignee_name', 'appsec_versions'):
        if name in columns:
            op.drop_column('projects', name)
