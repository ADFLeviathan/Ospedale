from sqlite3 import IntegrityError
from weakref import ref
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.pazienti.pazienti_model import Paziente
from src.medici.medici_model import Medico
from src.referti.referti_schemas import CreaReferto, RefertoResponse
from src.utili import (
    conta_referti,
    conta_referti_non_aperti,
    get_current_medico,
    get_current_paziente,
    trova_per_id,
)
from src.referti.referti_model import Referto
from src.database import get_async_session
from datetime import datetime, timezone


from src.referti.referti_schemas import *
from typing import List

referti = APIRouter(prefix="/referti", tags=["referti"])


@referti.get("/", response_model=List[RefertoResponse])
async def lista_referti(session: AsyncSession = Depends(get_async_session)):
    query = select(Referto)
    query_result = await session.scalars(query)
    result = query_result.all()
    return result


# conto referti
@referti.get("/totali")
async def conto_referto(
    session: AsyncSession = Depends(get_async_session),
):
    return await conta_referti(session)


# conto referti
@referti.get("/non_aperti")
async def conto_referti_non_aperti(
    session: AsyncSession = Depends(get_async_session),
):
    return await conta_referti_non_aperti(session)


@referti.get("/me", response_model=List[RefertoResponse])
async def referti_me():
    session: AsyncSession = Depends(get_async_session)


@referti.get("/{id}", response_model=RefertoResponse)
async def trovaReferto(id: int, session: AsyncSession = Depends(get_async_session)):
    referto = await trova_per_id(session, Referto, id)
    if not referto:
        raise HTTPException(status_code=404, detail="Referto non trovato o inesistente")
    return referto


# aggiungi Referto
@referti.post("/add", response_model=RefertoResponse, status_code=201)
async def aggiungi_Referto(
    payload: CreaReferto, session: AsyncSession = Depends(get_async_session)
):
    nuovo_referto = Referto(
        pressione_min=payload.pressione_min,
        pressione_max=payload.pressione_max,
        freq_cardiaca=payload.freq_cardiaca,
        peso=payload.peso,
        temperatura=payload.temperatura,
        note=payload.note,
        aperto=payload.aperto,
        medico_id=payload.medico_id,
        paziente_id=payload.paziente_id,
        titolo=payload.titolo,
    )

    session.add(nuovo_referto)
    try:
        await session.commit()
    except Exception:
        await session.rollback()
        raise HTTPException(status_code=400, detail="Referto già registrato")
    return nuovo_referto

#referti per paziente
@referti.get("/paziente/me", response_model=List[RefertoResponse])
async def get_referti_paziente(
    paziente: Paziente = Depends(get_current_paziente),
    session: AsyncSession = Depends(get_async_session),
):
    query = select(Referto).where(Referto.paziente_id == paziente.id)
    result = await session.execute(query)
    referti_list = result.scalars().all()
    return referti_list

#referti per medico
@referti.get("/medico/me", response_model=List[RefertoResponse])
async def get_referti_medico(
    medico: Medico = Depends(get_current_medico),
    session: AsyncSession = Depends(get_async_session),
):
    query = select(Referto).where(Referto.paziente_id == medico.id)
    result = await session.execute(query)
    referti_list = result.scalars().all()
    return referti_list





@referti.patch("/modifica_referto/{referto_id}", response_model=AggiornaReferto)
async def modifica_referto(
    referto_id: int,
    session: AsyncSession = Depends(get_async_session),
    paziente: Paziente = Depends(get_current_paziente),
):
    referto = await session.scalar(
        select(Referto).where(
            Referto.id == referto_id,
            Referto.paziente_id == paziente.id,
        )
    )

    if not referto:
        raise HTTPException(status_code=404, detail="Referto non trovato")

    # Marca come aperto
    referto.aperto = True

    await session.commit()
    await session.refresh(referto)

    return referto
