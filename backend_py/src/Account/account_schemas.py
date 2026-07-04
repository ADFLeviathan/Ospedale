from datetime import datetime
from typing import List, Literal, Optional

from src.schemas import CustomBase

# installa pacchetto pip install email-validator per emailStr
from pydantic import PositiveInt, Field, EmailStr


class AccountResponse(CustomBase):
    id: PositiveInt
    username: str = Field(..., min_length=5, max_length=30, examples=["Username"])
    email: EmailStr
    # is_admin: bool
    created_at: datetime
    role: Literal["admin", "patient"]


class CreazioneAccount(CustomBase):
    email: EmailStr
    username: str = Field(..., min_length=5, max_length=30, examples=["Username"])
    password: str = Field(..., min_length=6, max_length=30, examples=["Password_123"])
    role: Literal["admin", "patient"]
    # campi opzionali del paziente
    nome: Optional[str] = None
    cognome: Optional[str] = None
    codice_fiscale: Optional[str] = None
    data_nascita: Optional[datetime] = None
    n_telefono: Optional[str] = None
    allergie: Optional[List[str]] = None
    condizioni_croniche: Optional[List[str]] = None


class AggiornaAccount(CustomBase):
    email: Optional[EmailStr] = Field(None)
    username: Optional[str] = Field(
        None, min_length=5, max_length=30, examples=["Username"]
    )
    password: Optional[str] = Field(
        None, min_length=6, max_length=30, examples=["Password_123"]
    )
    # is_admin: Optional[bool] = Field(None)
    role: Literal["admin", "patient"]


class Account_paziente_login(CustomBase):
    username: str = Field(..., min_length=5, max_length=30, examples=["Username"])
    password: str = Field(..., min_length=6, max_length=30, examples=["Password_123"])
