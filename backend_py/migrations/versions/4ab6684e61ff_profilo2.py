"""profilo2

Revision ID: 4ab6684e61ff
Revises: a1376ad60160
Create Date: 2026-02-20 17:50:44.557142

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4ab6684e61ff'
down_revision: Union[str, Sequence[str], None] = 'a1376ad60160'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
