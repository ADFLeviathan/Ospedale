"""vfdvf

Revision ID: 8379309ff112
Revises: f72d2139f9bb
Create Date: 2026-02-20 20:22:30.817685

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "8379309ff112"
down_revision: Union[str, Sequence[str], None] = "f72d2139f9bb"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "contatti_emergenza",
        sa.Column("nome_emergenza", sa.String(length=100), nullable=True),
    )
    op.add_column(
        "contatti_emergenza",
        sa.Column("numero_emergenza", sa.String(length=20), nullable=True),
    )
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
