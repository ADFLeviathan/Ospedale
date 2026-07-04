"""cambio_eta

Revision ID: 50bf67f013b9
Revises: 8379309ff112
Create Date: 2026-03-02 16:24:33.825365

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '50bf67f013b9'
down_revision: Union[str, Sequence[str], None] = '8379309ff112'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
