from datetime import date, datetime
from typing import Optional
from src.schemas import CustomBase
from pydantic import PositiveInt, Field, EmailStr


class RefertoResponse(CustomBase):
    id: PositiveInt
    pressione_min: PositiveInt
    pressione_max: PositiveInt
    freq_cardiaca: PositiveInt
    peso: PositiveInt
    temperatura: PositiveInt = Field(gt=32, lt=42)
    note: str = Field(min_length=5, max_length=50)
    titolo: Optional[str] = Field(min_length=5, max_length=50)
    aperto: bool
    medico_id: PositiveInt
    paziente_id: PositiveInt
    created_at: datetime


class CreaReferto(CustomBase):
    pressione_min: PositiveInt
    pressione_max: PositiveInt
    freq_cardiaca: PositiveInt
    peso: PositiveInt
    temperatura: PositiveInt = Field(gt=32, lt=42)
    titolo: Optional[str] = Field(min_length=5, max_length=50)
    note: str = Field(min_length=5, max_length=50)
    aperto: bool
    medico_id: PositiveInt
    paziente_id: PositiveInt


class AggiornaReferto(CustomBase):
    pressione_min: PositiveInt
    pressione_max: PositiveInt
    freq_cardiaca: PositiveInt
    peso: PositiveInt
    temperatura: PositiveInt = Field(gt=32, lt=42)
    titolo: Optional[str] = Field(min_length=5, max_length=50)
    note: str = Field(min_length=5, max_length=50)
