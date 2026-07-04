from datetime import date, datetime
from typing import List, Optional
from src.reparti.reparti_schemas import RepartoResponse
from src.schemas import CustomBase
from pydantic import PositiveInt, Field, EmailStr


class MedicoResponse(CustomBase):
    id: PositiveInt
    nome: str = Field(
        ...,
        min_length=1,
        max_length=40,
    )
    cognome: str = Field(
        ...,
        min_length=5,
        max_length=40,
    )
    specializzazione: Optional[str] = Field(
        ...,
        min_length=5,
        max_length=30,
    )
    email: EmailStr
    n_telefono: str = Field(
        ...,
        min_length=10,
        max_length=10,
    )

    codice_fiscale: Optional[str] = Field(None, min_length=16, max_length=16)
    reparti: Optional[List[RepartoResponse]] = []
    created_at: datetime

    model_config = {"from_attributes": True}


class CreaMedico(CustomBase):
    nome: str = Field(..., min_length=1, max_length=40)

    cognome: str = Field(..., min_length=5, max_length=40)
    specializzazione: str = Field(
        ...,
        min_length=5,
        max_length=30,
    )
    email: EmailStr
    n_telefono: str = Field(
        ...,
        min_length=10,
        max_length=10,
    )
    codice_fiscale: str = Field(..., min_length=16, max_length=16)
    data_nascita: date = Field(
        ...,
    )


class AggiornaMedico(CustomBase):
    nome: str = Field(
        ...,
        min_length=1,
        max_length=40,
    )

    cognome: str = Field(
        ...,
        min_length=5,
        max_length=40,
    )
    specializzazione: str = Field(
        ...,
        min_length=5,
        max_length=30,
    )
    email: EmailStr
    n_telefono: str = Field(
        ...,
        min_length=10,
        max_length=10,
    )

    codice_fiscale: Optional[str] = Field(..., min_length=16, max_length=16)
    reparti: Optional[List[RepartoResponse]] = []
