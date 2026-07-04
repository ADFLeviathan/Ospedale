import select
from fastapi import Depends
from src.database import Base, get_async_session
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Integer, Text, Boolean, func, DateTime, Date
from typing import List, TYPE_CHECKING
from datetime import datetime
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession


if TYPE_CHECKING:
    from src.pazienti.pazienti_model import Paziente
    from src.medici.medici_model import Medico
    from src.prenotazioni.prenotazioni_model import Prenotazione


class Referto(Base):
    __tablename__ = "referti"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    pressione_min: Mapped[int] = mapped_column(Integer, nullable=True)
    pressione_max: Mapped[int] = mapped_column(Integer, nullable=True)
    freq_cardiaca: Mapped[int] = mapped_column(Integer, nullable=True)
    peso: Mapped[int] = mapped_column(Integer, nullable=True)
    temperatura: Mapped[int] = mapped_column(Integer, nullable=True)
    note: Mapped[str] = mapped_column(Text)
    titolo: Mapped[str] = mapped_column(Text)
    aperto: Mapped[bool] = mapped_column(Boolean, default=False)

    medico_id: Mapped[int] = mapped_column(
        ForeignKey(column="medici.id", ondelete="CASCADE", onupdate="CASCADE")
    )

    paziente_id: Mapped[int] = mapped_column(
        ForeignKey(column="pazienti.id", ondelete="CASCADE", onupdate="CASCADE")
    )

    prenotazione_id: Mapped[int] = mapped_column(
        ForeignKey("prenotazioni.id"), unique=True, nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    paziente: Mapped["Paziente"] = relationship("Paziente", back_populates="referti")
    medico: Mapped["Medico"] = relationship("Medico", back_populates="referti")
    prenotazione: Mapped["Prenotazione"] = relationship("Prenotazione", back_populates="referto")
