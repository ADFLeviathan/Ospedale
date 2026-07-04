from datetime import date, datetime, time
from typing import Optional
from src.schemas import CustomBase
from pydantic import PositiveInt, Field


class PrenotazioneResponse(CustomBase):
    id: PositiveInt
    paziente_id: PositiveInt
    medico_id: PositiveInt
    reparto_id: PositiveInt
    data_visita: date
    ora_visita: time
    note: str | None = None
    created_at: datetime
    reparto_nome: str | None = None


class CreaPrenotazione(CustomBase):
    paziente_id: PositiveInt
    medico_id: PositiveInt
    reparto_id: PositiveInt
    data_visita: date
    note: str | None = None
    ora_visita: time


class AggiornaPrenotazione(CustomBase):
    paziente_id: Optional[PositiveInt]
    medico_id: Optional[PositiveInt]
    reparto_id: Optional[PositiveInt]
    data_visita: Optional[date]
    ora_visita: Optional[time]
    stato: Optional[str] = None
    note: Optional[str] = None
