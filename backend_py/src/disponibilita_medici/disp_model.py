from pwdlib import PasswordHash

from src.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Integer, Text, Boolean, Time, func, DateTime, Date
from typing import List, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from src.medici.medici_model import Medico

class Disponibilita_medico(Base):
    __tablename__ = "disponibilita_medici"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    medico_id: Mapped[int] = mapped_column(ForeignKey("medici.id"))
    giorno_settimana: Mapped[int] = mapped_column(Integer)  # 0=Lunedì, 6=Domenica
    ora_inizio: Mapped[Time] = mapped_column(Time)
    ora_fine: Mapped[Time] = mapped_column(Time)
    durata_slot: Mapped[int] = mapped_column(Integer, default=30)  # minuti
    attivo: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    medico: Mapped["Medico"] = relationship("Medico", back_populates="disponibilita")
