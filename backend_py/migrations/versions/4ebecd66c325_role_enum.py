"""role_enum

Revision ID: 4ebecd66c325
Revises: 13fac6e086de
Create Date: 2026-02-11 17:14:56.772232

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4ebecd66c325'
down_revision: Union[str, Sequence[str], None] = '13fac6e086de'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
