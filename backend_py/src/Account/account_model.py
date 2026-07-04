from src.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, Text, Boolean, func, DateTime, Enum as sqlenum
from typing import List, TYPE_CHECKING
from datetime import datetime
from enum import Enum
from sqlalchemy import Enum as SQLenum
import hashlib
from pwdlib import PasswordHash

if TYPE_CHECKING:
    from pazienti.pazienti_model import Paziente
    from medici.medici_model import Medico

    # per autenticazione:


password_hasher = PasswordHash.recommended()  # pip install pwdlib[argon2]


class Rolenum(str, Enum):
    admin = "admin"
    patient = "patient"


class Account(Base):
    __tablename__ = "accounts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(Text, unique=True)
    username: Mapped[str] = mapped_column(Text, unique=True)
    password: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    role: Mapped[Rolenum] = mapped_column(
        sqlenum(Rolenum, name="role_enum"), default=Rolenum.patient, nullable=True
    )

    # FK
    paziente: Mapped["Paziente"] = relationship(
        "Paziente",
        back_populates="account",
        uselist=False,
        cascade="all,delete-orphan",
    )

    medico: Mapped["Medico"] = relationship(
        "Medico",
        back_populates="account",
        uselist=False,
        cascade="all,delete-orphan",
    )

    @property
    def password_setter(self):
        raise AttributeError("Password errore property")

    @password_setter.setter
    def password_setter(self, password: str) -> None:
        self.password = password_hasher.hash(password)

    def verifica_password(self, password) -> bool:
        return password_hasher.verify(password, self.password)
