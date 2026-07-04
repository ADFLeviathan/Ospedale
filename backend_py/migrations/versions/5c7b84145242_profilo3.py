"""profilo3

Revision ID: 5c7b84145242
Revises: 4ab6684e61ff
Create Date: 2026-02-20 17:52:27.080158

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5c7b84145242'
down_revision: Union[str, Sequence[str], None] = '4ab6684e61ff'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
