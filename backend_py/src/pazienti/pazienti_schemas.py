from datetime import date, datetime
from typing import List, Optional
from src.schemas import CustomBase
from pydantic import PositiveFloat, PositiveInt, Field, EmailStr


class PazienteResponse(CustomBase):
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
    codice_fiscale: str = Field(
        ...,
        min_length=16,
        max_length=16,
    )
    data_nascita: date = Field(
        ...,
    )
    n_telefono: str = Field(
        ...,
        min_length=10,
        max_length=10,
    )
    created_at: Optional[datetime] = None
    indirizzo: Optional[str] = Field(None, min_length=6, max_length=25)


class CreaPaziente(CustomBase):
    nome: str = Field(
        ...,
        min_length=1,
        max_length=40,
    )

    cognome: str = Field(
        ...,
        min_length=1,
        max_length=40,
    )
    codice_fiscale: str = Field(
        ...,
        min_length=16,
        max_length=16,
    )
    data_nascita: date = Field(..., examples=["1985-01-15"])
    email: EmailStr
    n_telefono: str = Field(
        ...,
        min_length=5,
        max_length=10,
    )


class AggiornaPaziente(CustomBase):
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
    codice_fiscale: str = Field(
        ...,
        min_length=16,
        max_length=16,
    )
    data_nascita: date = Field(
        ...,
    )
    email: EmailStr
    n_telefono: str = Field(
        ...,
        min_length=10,
        max_length=10,
    )


class AllergiaResponse(CustomBase):
    id: int
    nome: str

    class Config:
        from_attributes = True


class CondizioneResponse(CustomBase):
    id: int
    nome: str

    class Config:
        from_attributes = True


class ProfiloResponse(CustomBase):
    id: PositiveInt
    nome: str = Field(..., min_length=1, max_length=40)
    cognome: str = Field(..., min_length=5, max_length=40)
    gruppo_sanguigno: Optional[str] = Field(None, min_length=2, max_length=2)

    # eta: Optional[PositiveInt] = Field(None, gt=0, lt=120)
    peso: Optional[PositiveInt] = None
    altezza: Optional[PositiveFloat] = None
    data_nascita: date

    codice_fiscale: str = Field(..., min_length=16, max_length=16)
    email: EmailStr
    numero_telefono: str = Field(..., min_length=10, max_length=10)
    indirizzo: Optional[str] = Field(None, min_length=6, max_length=25)

    allergie: List[str] = []
    condizioni_croniche: List[str] = Field(default=[], alias="condizioni")

    # contatto di emergenza
    nome_emergenza: Optional[str] = Field(None, min_length=2, max_length=40)
    relazione: Optional[str] = Field(None, min_length=5, max_length=40)
    numero_emergenza: Optional[str] = Field(None, min_length=10, max_length=10)
    created_at: Optional[datetime] = None

    class Config:
        populate_by_name = True


class AggiornaProfilo(CustomBase):
    nome: Optional[str] = None
    cognome: Optional[str] = None
    username: Optional[str] = None
    gruppo_sanguigno: Optional[str] = None
    eta: Optional[int] = None
    peso: Optional[int] = None
    altezza: Optional[float] = None
    indirizzo: Optional[str] = None
    numero_telefono: Optional[str] = None
    # contatto di emergenza
    nome_emergenza: Optional[str] = Field(None, min_length=2, max_length=40)
    relazione: Optional[str] = Field(None, min_length=5, max_length=40)
    numero_emergenza: Optional[str] = Field(None, min_length=10, max_length=10)
    allergie: List[str] = []
    condizioni_croniche: List[str] = Field(default=[], alias="condizioni")


class ListaPazientiResponse(CustomBase):
    paziente_id: PositiveInt
    nome: str = Field(..., min_length=1, max_length=40)
    cognome: str = Field(..., min_length=5, max_length=40)
    gruppo_sanguigno: Optional[str] = Field(None, min_length=2, max_length=2)

    eta: Optional[PositiveInt] = Field(None, gt=0, lt=120)
    peso: Optional[PositiveInt] = None
    altezza: Optional[PositiveFloat] = None
    data_nascita: date

    codice_fiscale: str = Field(..., min_length=16, max_length=16)
    email: EmailStr
    numero_telefono: str = Field(..., min_length=10, max_length=10)
    indirizzo: Optional[str] = Field(None, min_length=6, max_length=25)
