from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from src.disponibilita_medici.disp_model import Disponibilita_medico
from src.referti.referti_model import Referto
from src.medici.medici_model import Medico
from src.pazienti.pazienti_model import Paziente
from src.prenotazioni.prenotazioni_schemas_join import (
    PrenotazioneJoin_PM,
    RefertoPazienteResponse,
)
from src.reparti.reparti_model import Reparto
from src.utili import get_current_medico, get_current_paziente, trova_per_id
from src.prenotazioni.prenotazioni_model import Prenotazione
from src.database import get_async_session

from src.prenotazioni.prenotazioni_schemas import (
    PrenotazioneResponse,
    CreaPrenotazione,
    AggiornaPrenotazione,
)
from typing import List
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timedelta


prenotazioni = APIRouter(prefix="/prenotazioni", tags=["Prenotazioni"])


@prenotazioni.get("/", response_model=List[PrenotazioneResponse])
async def lista_prenotazioni(session: AsyncSession = Depends(get_async_session)):
    query = select(Prenotazione)
    query_result = await session.scalars(query)
    result = query_result.all()
    return result


# JOIN--------------------------------
@prenotazioni.get("/join/{id}", response_model=PrenotazioneJoin_PM)
async def joinPrenotazioneSingola(
    id: int, session: AsyncSession = Depends(get_async_session)
):
    query = (
        select(
            Prenotazione.id.label("id"),
            Prenotazione.paziente_id.label("paziente_id"),
            Prenotazione.medico_id.label("medico_id"),
            Prenotazione.reparto_id.label("reparto_id"),
            Prenotazione.data_visita.label("data_visita"),
            Prenotazione.ora_visita.label("ora_visita"),
            Paziente.nome.label("paziente_nome"),
            Paziente.cognome.label("paziente_cognome"),
            Medico.nome.label("medico_nome"),
            Medico.cognome.label("medico_cognome"),
            Medico.specializzazione.label("medico_specializzazione"),
            Reparto.nome.label("nome_reparto"),
            Prenotazione.note.label("note"),
            Prenotazione.created_at.label("created_at"),
            Prenotazione.stato.label("stato"),
            Referto.pressione_min.label("pressione_min"),
            Referto.pressione_max.label("pressione_max"),
            Referto.freq_cardiaca.label("freq_cardiaca"),
            Referto.peso.label("peso"),
            Referto.temperatura.label("temperatura"),
        )
        .join(Paziente, Prenotazione.paziente_id == Paziente.id)
        .join(Medico, Prenotazione.medico_id == Medico.id)
        .join(Reparto, Prenotazione.reparto_id == Reparto.id)
        .where(Prenotazione.id == id)
    )

    result = await session.execute(query)
    row = result.first()

    if not row:
        raise HTTPException(status_code=404, detail="Prenotazione non trovata")

    return PrenotazioneJoin_PM(**row._mapping)


@prenotazioni.get(
    "/join-referti/paziente/me", response_model=List[RefertoPazienteResponse]
)
async def join_referti_paziente(
    session: AsyncSession = Depends(get_async_session),
    paziente_loggato: Paziente = Depends(get_current_paziente),
):

    paziente_id = paziente_loggato.id
    if paziente_id is None:
        raise HTTPException(400, "ID paziente mancante")

    query = (
        select(
            Prenotazione.id.label("prenotazione_id"),
            Prenotazione.paziente_id.label("paziente_id"),
            Paziente.nome.label("paziente_nome"),
            Paziente.cognome.label("paziente_cognome"),
            Paziente.codice_fiscale.label("codice_fiscale"),
            Referto.id.label("referto_id"),
            Referto.titolo.label("titolo"),
            Referto.created_at.label("referto_created_at"),
            Referto.pressione_min.label("pressione_min"),
            Referto.pressione_max.label("pressione_max"),
            Referto.freq_cardiaca.label("freq_cardiaca"),
            Referto.peso.label("peso"),
            Referto.temperatura.label("temperatura"),
            Prenotazione.data_visita.label("data_visita"),
            Prenotazione.ora_visita.label("ora_visita"),
            Prenotazione.stato.label("stato"),
            Medico.specializzazione.label("medico_specializzazione"),
            Medico.nome.label("medico_nome"),
            Medico.cognome.label("medico_cognome"),
            Referto.note.label("referto_note"),
            Referto.aperto.label("referto_aperto"),
            Prenotazione.updated_at.label("updated_at"),
        )
        .join(Paziente, Prenotazione.paziente_id == Paziente.id)
        .join(Medico, Prenotazione.medico_id == Medico.id)
        .outerjoin(
            Referto,
            Referto.prenotazione_id == Prenotazione.id,
        )
        .where(Prenotazione.paziente_id == paziente_id)
    )

    result = await session.execute(query)
    return [RefertoPazienteResponse(**r._mapping) for r in result.all()]


@prenotazioni.get("/paziente/me", response_model=List[PrenotazioneJoin_PM])
async def joinPrenotazionePerPaziente(
    paziente_loggato: Paziente = Depends(get_current_paziente),
    session: AsyncSession = Depends(get_async_session),
):

    paziente_id = paziente_loggato.id

    query = (
        select(
            Prenotazione.id.label("id"),
            Prenotazione.paziente_id.label("paziente_id"),
            Prenotazione.medico_id.label("medico_id"),
            Prenotazione.reparto_id.label("reparto_id"),
            Prenotazione.data_visita.label("data_visita"),
            Prenotazione.ora_visita.label("ora_visita"),
            Paziente.nome.label("paziente_nome"),
            Paziente.cognome.label("paziente_cognome"),
            Medico.nome.label("medico_nome"),
            Medico.cognome.label("medico_cognome"),
            Medico.specializzazione.label("medico_specializzazione"),
            Reparto.nome.label("nome_reparto"),
            Prenotazione.note.label("note"),
            Prenotazione.created_at.label("created_at"),
            Prenotazione.stato.label("stato"),
            Prenotazione.updated_at.label("updated_at"),
            Disponibilita_medico.durata_slot.label("durata_slot"),
        )
        .join(Paziente, Prenotazione.paziente_id == Paziente.id)
        .join(Medico, Prenotazione.medico_id == Medico.id)
        .join(Reparto, Prenotazione.reparto_id == Reparto.id)
        .outerjoin(
            Disponibilita_medico,
            (Disponibilita_medico.medico_id == Prenotazione.medico_id)
            & (
                Disponibilita_medico.giorno_settimana
                == (func.extract("dow", Prenotazione.data_visita) + 6) % 7
            ),
        )
        .where(Prenotazione.paziente_id == paziente_id)
    )

    result = await session.execute(query)
    rows = result.all()

    # Ritorna lista vuota se il paziente non ha prenotazioni
    return [PrenotazioneJoin_PM(**row._mapping) for row in rows]


# oppure importa selectinload da sqlalchemy.org se vuoi caricare tutti i campi delle tabelle
#  select(Prenotazione).options(
#     selectinload(Prenotazione.paziente),
#     selectinload(Prenotazione.medico),
#     selectinload(Prenotazione.reparto),
@prenotazioni.get("/join", response_model=List[PrenotazioneJoin_PM])
async def joinPrenotazione(session: AsyncSession = Depends(get_async_session)):

    query = (
        select(
            Prenotazione.id.label("id"),
            Prenotazione.paziente_id.label("paziente_id"),
            Prenotazione.medico_id.label("medico_id"),
            Prenotazione.reparto_id.label("reparto_id"),
            Prenotazione.data_visita.label("data_visita"),
            Prenotazione.ora_visita.label("ora_visita"),
            Paziente.nome.label("paziente_nome"),
            Paziente.cognome.label("paziente_cognome"),
            Medico.nome.label("medico_nome"),
            Medico.cognome.label("medico_cognome"),
            Medico.specializzazione.label("medico_specializzazione"),
            Prenotazione.note.label("note"),
            Prenotazione.created_at.label("created_at"),
        )
        .join(Paziente, Prenotazione.paziente_id == Paziente.id)
        .join(Medico, Prenotazione.medico_id == Medico.id)
        .join(Reparto, Prenotazione.reparto_id == Reparto.id)
    )

    result = await session.execute(query)

    return [PrenotazioneJoin_PM(**r._mapping) for r in result.all()]


# aggiungi prenotazione
@prenotazioni.post("/add", response_model=PrenotazioneResponse, status_code=201)
async def aggiungi_prenotazione(
    payload: CreaPrenotazione, session: AsyncSession = Depends(get_async_session)
):
    nuova_prenotazione = Prenotazione(
        paziente_id=payload.paziente_id,
        medico_id=payload.medico_id,
        reparto_id=payload.reparto_id,
        data_visita=payload.data_visita,
        ora_visita=payload.ora_visita,
        note=payload.note,
    )

    session.add(nuova_prenotazione)
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(status_code=400, detail="prenotazione già effettuata")
    return nuova_prenotazione


# lista prenotazioni per dottore
@prenotazioni.get("/dr/me", response_model=List[PrenotazioneJoin_PM])
async def joinPrenotazionePerDottore(
    dottore_loggato: Medico = Depends(get_current_medico),
    session: AsyncSession = Depends(get_async_session),
):

    medico_id = dottore_loggato.id

    query = (
        select(
            Prenotazione.id,
            Prenotazione.paziente_id.label("paziente_id"),
            Prenotazione.medico_id.label("medico_id"),
            Prenotazione.reparto_id.label("reparto_id"),
            Prenotazione.data_visita.label("data_visita"),
            Prenotazione.ora_visita.label("ora_visita"),
            Paziente.nome.label("paziente_nome"),
            Paziente.cognome.label("paziente_cognome"),
            Medico.nome.label("medico_nome"),
            Medico.cognome.label("medico_cognome"),
            Medico.specializzazione.label("medico_specializzazione"),
            Reparto.nome.label("nome_reparto"),
            Prenotazione.note.label("note"),
            Prenotazione.created_at.label("created_at"),
            Prenotazione.stato.label("stato"),
            Prenotazione.updated_at.label("updated_at"),
            Disponibilita_medico.durata_slot.label("durata_slot"),
        )
        .join(Paziente, Prenotazione.paziente_id == Paziente.id)
        .join(Medico, Prenotazione.medico_id == Medico.id)
        .join(Reparto, Prenotazione.reparto_id == Reparto.id)
        .outerjoin(
            Disponibilita_medico,
            (Disponibilita_medico.medico_id == Prenotazione.medico_id)
            & (
                Disponibilita_medico.giorno_settimana
                == (func.extract("dow", Prenotazione.data_visita) + 6) % 7
            ),
        )
        .where(Prenotazione.medico_id == medico_id)
    )

    result = await session.execute(query)
    rows = result.all()

    # Ritorna lista vuota se il medico non ha prenotazioni
    return [PrenotazioneJoin_PM(**row._mapping) for row in rows]


@prenotazioni.get("/join-referti/dr/me", response_model=List[RefertoPazienteResponse])
async def join_referti_medico(
    session: AsyncSession = Depends(get_async_session),
    medico_loggato: Medico = Depends(get_current_medico),
):
    medico_id = medico_loggato.id

    query = (
        select(
            Prenotazione.id.label("prenotazione_id"),
            Prenotazione.paziente_id.label("paziente_id"),
            Paziente.nome.label("paziente_nome"),
            Paziente.cognome.label("paziente_cognome"),
            Paziente.codice_fiscale.label("codice_fiscale"),
            Referto.id.label("referto_id"),
            Referto.titolo.label("titolo"),
            Referto.created_at.label("referto_created_at"),
            Referto.pressione_min.label("pressione_min"),
            Referto.pressione_max.label("pressione_max"),
            Referto.freq_cardiaca.label("freq_cardiaca"),
            Referto.peso.label("peso"),
            Referto.temperatura.label("temperatura"),
            Prenotazione.data_visita.label("data_visita"),
            Prenotazione.ora_visita.label("ora_visita"),
            Prenotazione.stato.label("stato"),
            Medico.specializzazione.label("medico_specializzazione"),
            Medico.nome.label("medico_nome"),
            Medico.cognome.label("medico_cognome"),
            Referto.note.label("referto_note"),
            Referto.aperto.label("referto_aperto"),
            Paziente.indirizzo,
            Prenotazione.updated_at.label("updated_at"),
            Disponibilita_medico.durata_slot.label("durata_slot"),
        )
        .join(Paziente, Prenotazione.paziente_id == Paziente.id)
        .join(Medico, Prenotazione.medico_id == Medico.id)
        .join(Referto, Referto.prenotazione_id == Prenotazione.id)
        .outerjoin(
            Disponibilita_medico,
            (Disponibilita_medico.medico_id == Prenotazione.medico_id)
            & (
                Disponibilita_medico.giorno_settimana
                == (func.extract("dow", Prenotazione.data_visita) + 6) % 7
            ),
        )
        .where(Prenotazione.medico_id == medico_id)
    )

    result = await session.execute(query)
    return [RefertoPazienteResponse(**r._mapping) for r in result.all()]


# ---------
@prenotazioni.get("/{id}", response_model=PrenotazioneResponse)
async def trovaprenotazione(
    id: int, session: AsyncSession = Depends(get_async_session)
):
    prenotazione = await trova_per_id(session, Prenotazione, id)
    if not prenotazione:
        raise HTTPException(
            status_code=404, detail="prenotazione non trovata o inesistente"
        )
    return prenotazione


# elimina prenotazione
@prenotazioni.delete("/{prenotazione_id}", status_code=204)
async def elimina_prenotazioni(
    prenotazione_id: int,
    session: AsyncSession = Depends(get_async_session),
):
    elimina = await trova_per_id(session, Prenotazione, prenotazione_id)
    if not elimina:
        raise HTTPException(
            status_code=404, detail="prenotazione non trovata o inesistente"
        )

    await session.delete(elimina)
    await session.commit()

    return None


@prenotazioni.patch("/completa-scadute")
async def completa_scadute(session: AsyncSession = Depends(get_async_session)):

    now = datetime.now()

    query = (
        select(Prenotazione, Disponibilita_medico.durata_slot)
        .join(
            Disponibilita_medico,
            (Disponibilita_medico.medico_id == Prenotazione.medico_id)
            & (
                Disponibilita_medico.giorno_settimana
                == (func.extract("dow", Prenotazione.data_visita) + 6) % 7
            ),
        )
        .where(Prenotazione.stato == "prenotata")
    )

    result = await session.execute(query)

    for prenotazione, durata in result.all():

        inizio = datetime.combine(prenotazione.data_visita, prenotazione.ora_visita)

        fine = inizio + timedelta(minutes=durata)

        if now >= fine:
            prenotazione.stato = "completata"

    await session.commit()

    return {"status": "ok"}


@prenotazioni.patch(
    "/{prenotazione_id}", response_model=AggiornaPrenotazione, status_code=200
)
async def aggiorna_prenotazione(
    prenotazione_id: int,
    payload: AggiornaPrenotazione,
    session: AsyncSession = Depends(get_async_session),
):

    aggiorna = await trova_per_id(session, Prenotazione, prenotazione_id)
    if not aggiorna:
        raise HTTPException(
            status_code=404, detail="prenotazione non trovata o inesistente"
        )

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(aggiorna, field, value)

    try:
        await session.commit()
        await session.refresh(aggiorna)
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=400, detail="Errore durante l'aggiornamento della prenotazione"
        )

    return aggiorna
