"""profilo

Revision ID: a1376ad60160
Revises: 4ebecd66c325
Create Date: 2026-02-20 17:44:18.178916

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a1376ad60160"
down_revision: Union[str, Sequence[str], None] = "4ebecd66c325"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Aggiungi le colonne mancanti alla tabella pazienti
    op.add_column("pazienti", sa.Column("eta", sa.Integer(), nullable=True))
    op.add_column("pazienti", sa.Column("gruppo_sanguigno", sa.Text(), nullable=True))
    op.add_column("pazienti", sa.Column("altezza", sa.Float(), nullable=True))
    op.add_column("pazienti", sa.Column("peso", sa.Integer(), nullable=True))
    op.add_column("pazienti", sa.Column("indirizzo", sa.Text(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # Rimuovi le colonne aggiunte
    op.drop_column("pazienti", "indirizzo")
    op.drop_column("pazienti", "peso")
    op.drop_column("pazienti", "altezza")
    op.drop_column("pazienti", "gruppo_sanguigno")
    op.drop_column("pazienti", "eta")
