from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.reparti.reparti_schemas import CreaReparto, RepartoResponse
from src.utili import trova_per_id
from src.reparti.reparti_model import Reparto
from src.database import get_async_session

from src.reparti.reparti_schemas import *
from typing import List

reparti = APIRouter(prefix="/reparti", tags=["reparti"])


@reparti.get("/", response_model=List[RepartoResponse])
async def lista_reparti(session: AsyncSession = Depends(get_async_session)):
    query = select(Reparto)
    query_result = await session.scalars(query)
    result = query_result.all()
    return result


@reparti.get("/{id}", response_model=RepartoResponse)
async def trovaReparto(id: int, session: AsyncSession = Depends(get_async_session)):
    reparto = await trova_per_id(session, Reparto, id)
    if not reparto:
        raise HTTPException(status_code=404, detail="Reparto non trovato o inesistente")
    return reparto


# aggiungi Reparto
@reparti.post("/add", response_model=RepartoResponse, status_code=201)
async def aggiungi_Reparto(
    payload: CreaReparto, session: AsyncSession = Depends(get_async_session)
):
    nuovo_reparto = Reparto(
        nome=payload.nome,
        descrizione=payload.descrizione,
        piano=payload.piano,
    )

    session.add(nuovo_reparto)
    try:
        await session.commit()
    except Exception:
        await session.rollback()
        raise HTTPException(status_code=400, detail="Reparto già registrato")
    return nuovo_reparto
