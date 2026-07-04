"""fix_contatti_emergenza_columns

Revision ID: f72d2139f9bb
Revises: ca45eda798b6
Create Date: 2026-02-20 20:20:23.852194

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f72d2139f9bb'
down_revision: Union[str, Sequence[str], None] = 'ca45eda798b6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
