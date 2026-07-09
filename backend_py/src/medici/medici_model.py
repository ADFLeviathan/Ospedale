from src.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Integer, Text, func, DateTime, Date
from typing import List, TYPE_CHECKING
from datetime import date, datetime
from src.medici.medici_reparts import medico_reparto


if TYPE_CHECKING:
    from src.prenotazioni.prenotazioni_model import Prenotazione
    from src.referti.referti_model import Referto
    from src.disponibilita_medici.disp_model import Disponibilita_medico
    from src.Account.account_model import Account
    from src.reparti.reparti_model import Reparto


class Medico(Base):
    __tablename__ = "medici"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    account_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=True,
        unique=True,
    )
    nome: Mapped[str] = mapped_column(Text)
    cognome: Mapped[str] = mapped_column(Text)
    codice_fiscale: Mapped[str] = mapped_column(Text, unique=True, nullable=True)
    specializzazione: Mapped[str] = mapped_column(Text, nullable=True)
    email: Mapped[str] = mapped_column(Text, unique=True, nullable=True)
    n_telefono: Mapped[str] = mapped_column(Text, unique=True, nullable=True)
    data_nascita: Mapped[date] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    # reparto_id: Mapped[int] = mapped_column(
    #     ForeignKey("reparti.id", ondelete="CASCADE", onupdate="CASCADE"),
    #     nullable=True,
    #     unique=True,
    # )

    # foreign keys
    prenotazioni: Mapped[List["Prenotazione"]] = relationship(
        "Prenotazione", back_populates="medico", cascade="all,delete-orphan"
    )

    referti: Mapped[List["Referto"]] = relationship(
        "Referto", back_populates="medico", cascade="all,delete-orphan"
    )

    disponibilita: Mapped[List["Disponibilita_medico"]] = relationship(
        "Disponibilita_medico", back_populates="medico", cascade="all,delete-orphan"
    )

    account: Mapped["Account"] = relationship(
        "Account",
        back_populates="medico",
    )

    reparti: Mapped[List["Reparto"]] = relationship(
        "Reparto", back_populates="medici", secondary=medico_reparto
    )
