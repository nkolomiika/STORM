"""Retire incompatible tracker storage without losing historical rows."""
from alembic import op
import sqlalchemy as sa

revision = 'e3f4a5b6c7d8'
down_revision = 'd2e3f4a5b6c7'
branch_labels = None
depends_on = None

# Historical names are intentionally confined to migration compatibility.
TABLES = [('jira_instances','retired_tracker_configs'),('project_jira_links','retired_project_tracker_links'),('jira_issue_links','retired_tracker_issue_links')]


def upgrade():
    names = set(sa.inspect(op.get_bind()).get_table_names())
    for old, new in TABLES:
        if old in names:
            if new in names: raise RuntimeError(f'Both {old} and {new} exist; refusing to discard records')
            op.rename_table(old,new)


def downgrade():
    names = set(sa.inspect(op.get_bind()).get_table_names())
    for old,new in reversed(TABLES):
        if new in names:
            if old in names: raise RuntimeError(f'Both {old} and {new} exist; refusing to discard records')
            op.rename_table(new,old)
