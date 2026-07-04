"""create enum ruolo_utente

Revision ID: 13fac6e086de
Revises: 8e0aec7c4d60
Create Date: 2026-02-11 17:08:46.789335

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "13fac6e086de"
down_revision: Union[str, Sequence[str], None] = "8e0aec7c4d60"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("CREATE TYPE ruolo_utente AS ENUM ('admin', 'patient')")
    pass


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP TYPE ruolo_utente")
    pass
