from src.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import (
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    Boolean,
    column,
    func,
    DateTime,
    Date,
)
from typing import List, TYPE_CHECKING
from datetime import datetime, date

if TYPE_CHECKING:
    from src.prenotazioni.prenotazioni_model import Prenotazione
    from src.referti.referti_model import Referto
    from src.Account.account_model import Account


class Paziente(Base):
    __tablename__ = "pazienti"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    account_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=True,
        unique=True,
    )
    nome: Mapped[str] = mapped_column(Text)
    cognome: Mapped[str] = mapped_column(Text)
    codice_fiscale: Mapped[str] = mapped_column(Text, unique=True, nullable=True)
    data_nascita: Mapped[date] = mapped_column(Date, nullable=False)
    n_telefono: Mapped[str] = mapped_column(Text, unique=True)
    gruppo_sanguigno: Mapped[str] = mapped_column(Text, nullable=True)
    altezza: Mapped[float] = mapped_column(Float, nullable=True)
    peso: Mapped[int] = mapped_column(Integer, nullable=True)
    indirizzo: Mapped[str] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # foreign keys
    prenotazioni: Mapped[List["Prenotazione"]] = relationship(
        "Prenotazione", back_populates="paziente", cascade="all,delete-orphan"
    )

    referti: Mapped[List["Referto"]] = relationship(
        "Referto", back_populates="paziente", cascade="all,delete-orphan"
    )

    # 1:1 quindi non è una lista
    account: Mapped["Account"] = relationship(
        "Account",
        back_populates="paziente",
    )

    allergie: Mapped[List["Allergia"]] = relationship(
        back_populates="paziente", cascade="all, delete-orphan"
    )

    condizioni_croniche: Mapped[List["CondizioneCronica"]] = relationship(
        secondary="paziente_condizioni", back_populates="pazienti"
    )

    contatti_emergenza: Mapped[List["ContattoEmergenza"]] = relationship(
        back_populates="paziente", cascade="all, delete-orphan"
    )

    @property
    def eta(self) -> int:
        oggi = date.today()
        return (
            oggi.year
            - self.data_nascita.year
            - (
                (oggi.month, oggi.day)
                < (self.data_nascita.month, self.data_nascita.day)
            )
        )


# allergie
class Allergia(Base):
    __tablename__ = "allergie"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome_allergia: Mapped[str] = mapped_column(String(100))

    paziente_id: Mapped[int] = mapped_column(ForeignKey("pazienti.id"))

    paziente: Mapped["Paziente"] = relationship(back_populates="allergie")


# condizioni
class CondizioneCronica(Base):
    __tablename__ = "condizioni_croniche"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome_condizione: Mapped[str] = mapped_column(String(150), unique=True)

    pazienti: Mapped[List["Paziente"]] = relationship(
        secondary="paziente_condizioni", back_populates="condizioni_croniche"
    )


# N:N quindi richiede una tabella di associazione
class PazienteCondizione(Base):
    __tablename__ = "paziente_condizioni"

    paziente_id: Mapped[int] = mapped_column(
        ForeignKey("pazienti.id"), primary_key=True
    )

    condizione_id: Mapped[int] = mapped_column(
        ForeignKey("condizioni_croniche.id"), primary_key=True
    )


# 1:N
class ContattoEmergenza(Base):
    __tablename__ = "contatti_emergenza"

    id: Mapped[int] = mapped_column(primary_key=True)

    nome_emergenza: Mapped[str] = mapped_column(String(100))
    relazione: Mapped[str] = mapped_column(String(100))
    numero_emergenza: Mapped[str] = mapped_column(String(20), nullable=True)

    paziente_id: Mapped[int] = mapped_column(
        ForeignKey("pazienti.id", ondelete="CASCADE")
    )

    paziente: Mapped["Paziente"] = relationship(back_populates="contatti_emergenza")
