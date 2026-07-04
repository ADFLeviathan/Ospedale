from datetime import date, datetime
from typing import Optional
from src.schemas import CustomBase
from pydantic import PositiveInt, Field, EmailStr


class RepartoResponse(CustomBase):
    id: PositiveInt
    nome: str = Field(..., min_length=1, max_length=40, examples=["Cardiologia"])
    descrizione: str = Field(
        ..., min_length=5, max_length=40, examples=["Operiamo col il cuore"]
    )
    piano: PositiveInt = Field(gt=0, lt=3)
    created_at: datetime
    
    model_config = {
        "from_attributes": True
    }


class CreaReparto(CustomBase):
    nome: str = Field(..., min_length=1, max_length=40, examples=["Mario"])
    descrizione: str = Field(..., min_length=5, max_length=30, examples=["Cardiologia"])
    piano: PositiveInt = Field(gt=0, lt=3)


class AggiornaReparto(CustomBase):
    nome: str = Field(..., min_length=1, max_length=40, examples=["Mario"])
    descrizione: str = Field(..., min_length=5, max_length=30, examples=["Cardiologia"])
    piano: PositiveInt = Field(gt=0, lt=3)
