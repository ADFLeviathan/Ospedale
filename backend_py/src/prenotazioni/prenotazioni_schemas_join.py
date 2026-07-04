from datetime import date, datetime, time
from typing import Optional
from src.schemas import CustomBase
from pydantic import PositiveInt, Field


class PrenotazioneJoin_PM(CustomBase):
    id: PositiveInt
    paziente_nome: str
    paziente_cognome: str
    medico_nome: str
    medico_cognome: str
    medico_specializzazione: str
    nome_reparto: str
    note: str | None = None
    data_visita: date
    ora_visita: time
    created_at: datetime
    stato: str
    paziente_id: PositiveInt
    medico_id: PositiveInt
    reparto_id: PositiveInt
    updated_at: datetime
    durata_slot: Optional[PositiveInt] = 0


# inserimento
class PrenotazioneJoinConReferto(CustomBase):
    # Prenotazione
    prenotazione_id: PositiveInt
    paziente_id: PositiveInt
    medico_id: PositiveInt
    reparto_id: PositiveInt
    data_visita: date
    ora_visita: time
    stato: str
    prenotazione_note: str | None = None
    prenotazione_created_at: datetime

    # Dati paziente
    paziente_nome: str
    paziente_cognome: str
    codice_fiscale: str = Field(
        ...,
        min_length=16,
        max_length=16,
    )

    # Dati medico
    medico_nome: str
    medico_cognome: str
    medico_specializzazione: str

    # Dati reparto
    nome_reparto: str

    referto_id: Optional[PositiveInt] | None = None
    pressione_min: int | None = None
    pressione_max: int | None = None
    freq_cardiaca: int | None = None
    peso: int | None = None
    temperatura: int | None = None
    referto_note: str | None = None
    referto_aperto: bool | None = None
    referto_created_at: datetime | None = None


# lettura
class RefertoPazienteResponse(CustomBase):
    prenotazione_id: PositiveInt
    paziente_id: PositiveInt
    paziente_nome: str
    paziente_cognome: str
    codice_fiscale: str
    data_visita: date
    ora_visita: time
    stato: str
    medico_nome: str
    medico_cognome: str
    medico_specializzazione: str
    updated_at: datetime

    referto_id: Optional[PositiveInt] = None
    titolo: Optional[str] = None
    referto_created_at: Optional[datetime] = None
    pressione_min: Optional[int] = None
    pressione_max: Optional[int] = None
    freq_cardiaca: Optional[int] = None
    peso: Optional[int] = None
    temperatura: Optional[int] = None
    referto_note: Optional[str] = None
    referto_aperto: Optional[bool] = None
