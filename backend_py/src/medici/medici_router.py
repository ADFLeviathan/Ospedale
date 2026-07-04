from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from src.medici.medici_schemas import CreaMedico, MedicoResponse
from src.utili import get_current_medico, trova_per_id
from src.medici.medici_model import Medico
from src.database import get_async_session

from src.medici.medici_schemas import *
from typing import List
from sqlalchemy.exc import IntegrityError

medici = APIRouter(prefix="/medici", tags=["medici"])


@medici.get("/", response_model=List[MedicoResponse])
async def lista_medici(session: AsyncSession = Depends(get_async_session)):
    query = select(Medico).options(selectinload(Medico.reparti))
    query_result = await session.scalars(query)
    result = query_result.all()
    return result


@medici.get("/me", response_model=MedicoResponse)
async def medico_me(
    session: AsyncSession = Depends(get_async_session),
    medico_loggato: Medico = Depends(get_current_medico),
):

    if not medico_loggato:
        raise HTTPException(
            status_code=404, detail="Paziente non trovato o inesistente"
        )
    query = (
        select(Medico)
        .options(selectinload(Medico.reparti))
        .where(Medico.id == medico_loggato.id)
    )

    result = await session.scalars(query)
    medico_con_reparti = result.unique().one_or_none()

    return medico_con_reparti


# aggiungi Medico
@medici.post("/add", response_model=MedicoResponse, status_code=201)
async def aggiungi_Medico(
    payload: CreaMedico, session: AsyncSession = Depends(get_async_session)
):
    nuovo_medico = Medico(
        nome=payload.nome,
        cognome=payload.cognome,
        specializzazione=payload.specializzazione,
        email=payload.email,
        n_telefono=payload.n_telefono,
        codice_fiscale=payload.codice_fiscale,
        data_nascita=payload.data_nascita,
    )

    session.add(nuovo_medico)
    try:
        await session.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Medico già registrato")
    return nuovo_medico


@medici.get("/profilo/me", response_model=MedicoResponse)
async def profilo(
    session: AsyncSession = Depends(get_async_session),
    medico: Medico = Depends(get_current_medico),
):
    medico_id = medico.id

    query = (
        select(Medico)
        .options(selectinload(Medico.reparti))
        .where(Medico.id == medico_id)
    )

    result = await session.scalars(query)
    # unique() Serve quando ci sono relazioni N:N o 1:N, per evitare duplicati quando SQLAlchemy costruisce l’oggetto ORM.
    medico_obj = result.unique().one_or_none()
    if not medico_obj:
        raise HTTPException(status_code=404, detail="Medico non trovato")
    return MedicoResponse.model_validate(medico_obj)


# modifica profilo medico
@medici.patch("/modifica_profilo/me", response_model=AggiornaMedico)
async def modifica_profilo(
    payload: AggiornaMedico,
    session: AsyncSession = Depends(get_async_session),
    medico_loggato: Medico = Depends(get_current_medico),
):
    # Ritorna profilo aggiornato
    if not medico_loggato:
        raise HTTPException(status_code=404, detail="Modifica dei dati fallita")
    medico_id = medico_loggato.id
    result = await session.execute(select(Medico).where(Medico.id == medico_id))
    profilo = result.scalar_one_or_none()

    field_mapping = {
        "numero_telefono": "n_telefono",
    }

    CAMPI_READONLY = {"reparti", "id", "codice_fiscale"}

    for field, value in payload.model_dump(exclude_unset=True).items():
        if field in CAMPI_READONLY:
            continue
        model_field = field_mapping.get(field, field)
        setattr(profilo, model_field, value)

    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(status_code=400, detail="Dati non validi")

    query = (
        select(Medico)
        .options(selectinload(Medico.reparti))
        .where(Medico.id == medico_loggato.id)
    )

    result = await session.scalars(query)
    medico_con_reparti = result.unique().one_or_none()

    return medico_con_reparti


@medici.get("/{id}", response_model=MedicoResponse)
async def trovaMedico(id: int, session: AsyncSession = Depends(get_async_session)):
    medico = await trova_per_id(session, Medico, id)
    if not medico:
        raise HTTPException(status_code=404, detail="Medico non trovato o inesistente")
    return medico
