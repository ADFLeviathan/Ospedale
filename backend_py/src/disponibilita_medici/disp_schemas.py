from datetime import date, datetime
from datetime import time, datetime
from src.schemas import CustomBase
from pydantic import PositiveInt, Field, EmailStr


class DisponibilitaResponse(CustomBase):
    id: PositiveInt
    medico_id: PositiveInt
    giorno_settimana: PositiveInt
    ora_inizio: time
    ora_fine: time
    durata_slot: PositiveInt
    attivo: bool
    created_at: datetime


class CreaDisponibilita(CustomBase):
    medico_id: PositiveInt
    giorno_settimana: PositiveInt
    ora_inizio: time
    ora_fine: time
    durata_slot: PositiveInt
    attivo: bool


class AggiornaDisponibilita(CustomBase):
    medico_id: PositiveInt
    giorno_settimana: PositiveInt
    ora_inizio: time
    ora_fine: time
    durata_slot: PositiveInt
    attivo: bool
