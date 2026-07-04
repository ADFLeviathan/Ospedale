"""cambio_eta2

Revision ID: a76790c4f783
Revises: 50bf67f013b9
Create Date: 2026-03-02 16:26:06.793499

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a76790c4f783'
down_revision: Union[str, Sequence[str], None] = '50bf67f013b9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
