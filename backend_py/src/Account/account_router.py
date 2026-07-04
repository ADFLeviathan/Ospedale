from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.utili import get_account_id_from_cookie
from src.medici.medici_model import Medico
from src.pazienti.pazienti_model import (
    Allergia,
    CondizioneCronica,
    Paziente,
    PazienteCondizione,
)
from src.Account.account_model import Account
from src.database import get_async_session

from src.Account.account_schemas import *
from sqlalchemy.exc import IntegrityError

# token
from src.Account.security import sign_jwt

# slowapi per il rate-limit: pip install slowapi
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request

limiter = Limiter(key_func=get_remote_address)


auth = APIRouter(tags=["Registrazione, Login e Logout"])


@auth.get("/csrf")
def get_csrf(request: Request):
    csrf_token = request.scope.get("csrftoken")
    return {"message": "CSRF COOKIE SET", "csrf_token": csrf_token}


# modifica utente
@auth.patch("/modifica/{account_id}", response_model=AggiornaAccount)
async def update_account(
    account_id: int,
    payload: AggiornaAccount,
    session: AsyncSession = Depends(get_async_session),
):
    updated_Account = Account(
        username=payload.username,
        password=payload.password,
        email=payload.email,
    )
    query = select(Account).where(Account.id == account_id)
    query_result = await session.scalars(query)
    result = query_result.first()

    if not result:
        raise HTTPException(status_code=404, detail="Account non trovato o inesistente")

    for field, value in payload.model_dump().items():
        if field == "password":
            result.set_password(value)
        else:
            setattr(result, field, value)

    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(status_code=400, detail="Account o email già in uso")
    return result


@auth.post("/login")
@limiter.limit("3/minute")
async def login(
    payload: Account_paziente_login,
    response: Response,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
):
    account = await session.scalar(
        statement=select(Account).where(Account.username == payload.username)
    )
    if account is None or not account.verifica_password(payload.password):
        raise HTTPException(401, "Username o password errati")
    token_data = sign_jwt(account.id)
    print(token_data)
    token = token_data["access_token"]
    print(token)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,  # samesite="none" richiede secure=True
        samesite="lax",
        max_age=60 * 60,
    )

    return {
        # **token_data,  # ← {"access_token": "..."}
        "role": account.role.value,
    }


@auth.post("/logout")
async def logout(response: Response):
    response.set_cookie(
        "access_token", value="", httponly=True, secure=False, samesite="lax", max_age=0
    )
    return {"message": "Logout effettuato"}


@auth.get("/me", response_model=AccountResponse)
async def me(
    account_id: int = Depends(get_account_id_from_cookie),
    session: AsyncSession = Depends(get_async_session),
):
    account = await session.scalar(
        statement=select(Account).where(Account.id == account_id)
    )

    if account is None:
        raise HTTPException(404, "Utente non trovato")
    return account


@auth.post("/registrazione", status_code=201)
@limiter.limit("1/minute")
async def registrazione(
    payload: CreazioneAccount,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
):
    nuovo_account = Account(
        username=payload.username,
        email=payload.email,
        role=payload.role,
        password_setter=payload.password,
    )
    session.add(nuovo_account)
    await session.commit()
    await session.refresh(nuovo_account)

    if payload.role == "patient":
        paziente = Paziente(
            nome=payload.nome,
            cognome=payload.cognome,
            codice_fiscale=payload.codice_fiscale,
            data_nascita=payload.data_nascita,
            n_telefono=payload.n_telefono,
            account_id=nuovo_account.id,
        )
        session.add(paziente)
        await session.flush()

        if payload.allergie:
            for nome_allergia in payload.allergie:
                allergia = Allergia(
                    nome_allergia=nome_allergia,
                    paziente_id=paziente.id,
                )
                session.add(allergia)

        if payload.condizioni_croniche:
            for nome_condizione in payload.condizioni_croniche:

                # cerco se esiste già
                result = await session.execute(
                    select(CondizioneCronica).where(
                        CondizioneCronica.nome_condizione == nome_condizione
                    )
                )
                condizione = result.scalar_one_or_none()

                # crea se non esiste
                if not condizione:
                    condizione = CondizioneCronica(nome_condizione=nome_condizione)
                    session.add(condizione)
                    await session.flush()

                associazione = PazienteCondizione(
                    paziente_id=paziente.id, condizione_id=condizione.id
                )
                session.add(associazione)

        await session.commit()

        return nuovo_account


# registrazione medico
@auth.post("/registrazioneM", status_code=201)
@limiter.limit("1/minute")
async def registrazione_medico(
    payload: CreazioneAccount,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
):
    nuovo_account = Account(
        username=payload.username,
        email=payload.email,
        role=payload.role,
        password_setter=payload.password,
    )
    session.add(nuovo_account)
    await session.flush()

    if payload.role == "admin":
        medico = Medico(
            nome=payload.nome,
            cognome=payload.cognome,
            codice_fiscale=payload.codice_fiscale,
            data_nascita=payload.data_nascita,
            n_telefono=payload.n_telefono,
            account_id=nuovo_account.id,
            email=payload.email,
        )
        session.add(medico)

    try:
        await session.commit()
        await session.refresh(nuovo_account)
    except IntegrityError as e:
        await session.rollback()
        raise HTTPException(status_code=400, detail=f"Errore: {str(e.orig)}")
    return nuovo_account
