from sqlite3 import IntegrityError

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.disponibilita_medici.disp_model import Disponibilita_medico
from src.database import get_async_session
from src.disponibilita_medici.disp_schemas import *
from typing import List

disp = APIRouter(prefix="/disp", tags=["disponibilità medico"])


@disp.post("/crea/")
async def giorni_disponibili(
    payload: CreaDisponibilita,
    session: AsyncSession = Depends(get_async_session),
):
    nuovo_turno_disponibile = Disponibilita_medico(
        medico_id=payload.medico_id,
        giorno_settimana=payload.giorno_settimana,
        ora_inizio=payload.ora_inizio,
        ora_fine=payload.ora_fine,
        durata_slot=payload.durata_slot,
        attivo=payload.attivo,
    )

    session.add(nuovo_turno_disponibile)
    try:
        await session.commit()
    except IntegrityError:
        raise session.rollback()
    except Exception:
        raise HTTPException(status_code=400, detail="Paziente già registrato")
    return nuovo_turno_disponibile


@disp.get("/", response_model=List[DisponibilitaResponse])
async def lista_disponibilita(session: AsyncSession = Depends(get_async_session)):
    query = select(Disponibilita_medico)
    query_result = await session.scalars(query)
    result = query_result.all()
    return result


@disp.get("/medico/{id}", response_model=List[DisponibilitaResponse])
async def disponibilitaPerMedico(
    id: int, session: AsyncSession = Depends(get_async_session)
):
    query = select(Disponibilita_medico).where(Disponibilita_medico.medico_id == id)
    query_result = await session.scalars(query)
    result = query_result.all()
    if not result:
        raise HTTPException(status_code=404, detail="Nessuna disponibilità trovata")
    return result
