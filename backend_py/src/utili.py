from fastapi import Depends, HTTPException, Request
from fastapi.security import (
    HTTPBearer,
    OAuth2PasswordBearer,
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from typing import Type, TypeVar, Optional
from src.medici.medici_model import Medico
from src.Account.security import decode_jwt
from src.referti.referti_model import Referto
from src.database import get_async_session
from src.pazienti.pazienti_model import Paziente


T = TypeVar("T")  # tipo generico


def get_account_id_from_cookie(request: Request) -> int:
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Non autenticato")
    decoded = decode_jwt(token)
    account_id = decoded.get("account_id")
    # print(account_id)
    if account_id is None:
        raise HTTPException(status_code=401, detail="Token non valido")

    return account_id


async def trova_per_id(session: AsyncSession, model: Type[T], id: int) -> Optional[T]:
    query = select(model).where(model.id == id)
    result = await session.scalars(query)
    return result.first()


async def conta_referti(session: AsyncSession) -> dict:
    # totale
    query_totale = select(func.count(Referto.id))
    # totale
    totale_result = await session.execute(query_totale)
    totale = totale_result.scalar_one()
    return {
        "totale_referti": totale,
    }


# non aperti
async def conta_referti_non_aperti(session: AsyncSession) -> dict:
    query_non_aperti = select(func.count(Referto.id)).where(Referto.aperto == False)
    result = await session.execute(query_non_aperti)
    non_aperti = result.scalar_one()
    return {
        "referti_non_aperti": non_aperti,
    }


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


async def get_current_paziente(
    account_id: int = Depends(get_account_id_from_cookie),
    session: AsyncSession = Depends(get_async_session),
) -> Paziente:
    result = await session.execute(
        select(Paziente).where(Paziente.account_id == account_id)
    )
    paziente = result.scalar_one_or_none()

    if not paziente:
        raise HTTPException(status_code=403, detail="Non autorizzato")

    return paziente


async def get_current_medico(
    account_id: int = Depends(get_account_id_from_cookie),
    session: AsyncSession = Depends(get_async_session),
) -> Medico:
    result = await session.execute(
        select(Medico).where(Medico.account_id == account_id)
    )
    medico = result.scalar_one_or_none()

    if not medico:
        raise HTTPException(status_code=404, detail="Medico non trovato")

    return medico


async def get_current_paziente_id(
    account_id: int = Depends(get_account_id_from_cookie),
    session: AsyncSession = Depends(get_async_session),
) -> int:

    result = await session.execute(
        select(Paziente.id).where(Paziente.account_id == account_id)
    )

    paziente_id = result.scalar_one_or_none()

    if not paziente_id:
        raise HTTPException(status_code=404, detail="Paziente non trovato")

    return paziente_id
