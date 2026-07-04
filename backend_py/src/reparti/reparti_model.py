from pwdlib import PasswordHash

from src.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, Text, Boolean, func, DateTime, Date
from typing import List, TYPE_CHECKING
from datetime import datetime
from src.medici.medici_reparts import medico_reparto

if TYPE_CHECKING:
    from src.prenotazioni.prenotazioni_model import Prenotazione
    from src.medici.medici_model import Medico


class Reparto(Base):
    __tablename__ = "reparti"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nome: Mapped[str] = mapped_column(Text)
    descrizione: Mapped[str] = mapped_column(Text)
    piano: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # foreign keys
    prenotazioni: Mapped[List["Prenotazione"]] = relationship(
        "Prenotazione", back_populates="reparto", cascade="all,delete-orphan"
    )

    medici: Mapped[List["Medico"]] = relationship(  # ← aggiungi
        "Medico",
        secondary=medico_reparto,
        back_populates="reparti",
    )
