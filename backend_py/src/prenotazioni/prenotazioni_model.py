from enum import Enum
from pwdlib import PasswordHash

from src.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import (
    ForeignKey,
    Integer,
    Text,
    Boolean,
    Time,
    func,
    DateTime,
    Date,
    Enum as SAEnum,
)
from typing import List, TYPE_CHECKING
from datetime import datetime


class StatoPrenotazione(str, Enum):
    prenotata = "prenotata"
    completata = "completata"
    annullata = "annullata"


class Prenotazione(Base):
    __tablename__ = "prenotazioni"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    stato: Mapped[StatoPrenotazione] = mapped_column(
        SAEnum(StatoPrenotazione, name="stato_prenotazione"),
        nullable=False,
        default=StatoPrenotazione.prenotata,
    )
    data_visita: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    ora_visita: Mapped[datetime.time] = mapped_column(Time, nullable=False)
    note: Mapped[str] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(),onupdate=func.now(), nullable=False)


    # tabelle che saranno fk
    paziente_id: Mapped[int] = mapped_column(
        ForeignKey(column="pazienti.id", ondelete="CASCADE", onupdate="CASCADE")
    )
    medico_id: Mapped[int] = mapped_column(
        ForeignKey(column="medici.id", ondelete="CASCADE", onupdate="CASCADE")
    )
    reparto_id: Mapped[int] = mapped_column(
        ForeignKey(column="reparti.id", ondelete="CASCADE", onupdate="CASCADE")
    )

    # collegamento vero foregn keys
    if TYPE_CHECKING:
        from src.pazienti.pazienti_model import Paziente
        from src.medici.medici_model import Medico
        from src.reparti.reparti_model import Reparto
        from src.referti.referti_model import Referto

    paziente: Mapped["Paziente"] = relationship(
        "Paziente", back_populates="prenotazioni"
    )
    medico: Mapped["Medico"] = relationship("Medico", back_populates="prenotazioni")
    reparto: Mapped["Reparto"] = relationship("Reparto", back_populates="prenotazioni")
    
    referto: Mapped[List["Referto | None"]] = relationship(
        "Referto", back_populates="prenotazione", cascade="all,delete-orphan"
    )
 