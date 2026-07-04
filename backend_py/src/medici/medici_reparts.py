from sqlalchemy import Table, Column, ForeignKey
from src.database import Base

medico_reparto = Table(
    "medici_reparti",
    Base.metadata,
    Column("medico_id", ForeignKey("medici.id", ondelete="CASCADE"), primary_key=True),
    Column(
        "reparto_id", ForeignKey("reparti.id", ondelete="CASCADE"), primary_key=True
    ),
)
