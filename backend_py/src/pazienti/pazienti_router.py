from sqlalchemy.exc import IntegrityError
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from src.referti.referti_model import Referto
from src.medici.medici_model import Medico
from src.prenotazioni.prenotazioni_model import Prenotazione
from src.Account.account_model import Account
from src.utili import (
    get_current_medico,
    get_current_paziente,
    get_current_paziente_id,
    trova_per_id,
)
from src.pazienti.pazienti_model import (
    Allergia,
    CondizioneCronica,
    ContattoEmergenza,
    Paziente,
    PazienteCondizione,
)
from src.database import get_async_session

from src.pazienti.pazienti_schemas import *
from typing import List

pazienti = APIRouter(prefix="/pazienti", tags=["Pazienti"])


@pazienti.get("/", response_model=List[PazienteResponse])
async def lista_pazienti(session: AsyncSession = Depends(get_async_session)):
    query = select(Paziente)
    query_result = await session.scalars(query)
    result = query_result.all()
    return result


@pazienti.get("/me", response_model=PazienteResponse)
async def paziente_me(
    session: AsyncSession = Depends(get_async_session),
    paziente_loggato: Paziente = Depends(get_current_paziente),
):

    if not paziente_loggato:
        raise HTTPException(
            status_code=404, detail="Paziente non trovato o inesistente"
        )
    return paziente_loggato


# pazienti con visite del medico con l'id indicato
@pazienti.get("/personali/me", response_model=List[ProfiloResponse])
async def pazienti_medico_me(
    session: AsyncSession = Depends(get_async_session),
    medico_loggato: Medico = Depends(get_current_medico),
):
    query = (
        select(
            Paziente.id,
            Paziente.nome,
            Paziente.cognome,
            Paziente.altezza,
            Paziente.gruppo_sanguigno,
            Paziente.peso,
            Paziente.data_nascita,
            Paziente.codice_fiscale,
            Account.email,
            Paziente.n_telefono.label("numero_telefono"),
            Paziente.indirizzo,
            Referto.created_at,
        )
        .join(Account, Paziente.account_id == Account.id)
        .join(Prenotazione, Prenotazione.paziente_id == Paziente.id)
        .outerjoin(
            Referto,
            (Referto.paziente_id == Paziente.id)
            & (Referto.medico_id == medico_loggato.id),
        )
        .where(Prenotazione.medico_id == medico_loggato.id)
        .distinct(Paziente.id)
    )

    result = await session.execute(query)
    rows = result.all()

    pazienti_list = []
    for row in rows:
        row_dict = dict(row._mapping)
        row_dict["allergie"] = row_dict.get("allergie") or []
        row_dict["condizioni_croniche"] = row_dict.pop("condizioni", [])
        pazienti_list.append(ProfiloResponse(**row_dict))

    return pazienti_list


# aggiungi paziente
@pazienti.post("/add", response_model=PazienteResponse, status_code=201)
async def aggiungi_paziente(
    payload: CreaPaziente, session: AsyncSession = Depends(get_async_session)
):
    nuovo_paziente = Paziente(
        nome=payload.nome,
        cognome=payload.cognome,
        codice_fiscale=payload.codice_fiscale,
        data_nascita=payload.data_nascita,
        n_telefono=payload.n_telefono,
    )

    session.add(nuovo_paziente)
    try:
        await session.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Paziente già registrato")
    return nuovo_paziente


@pazienti.get("/profilo/me", response_model=ProfiloResponse)
async def profilo(
    session: AsyncSession = Depends(get_async_session),
    paziente: Paziente = Depends(get_current_paziente),
):
    paziente_id = paziente.id

    query = (
        select(
            Paziente.id,
            Paziente.nome,
            Paziente.cognome,
            Paziente.altezza,
            Paziente.gruppo_sanguigno,
            Paziente.peso,
            Paziente.data_nascita,
            Paziente.codice_fiscale,
            Account.email,
            Paziente.n_telefono.label("numero_telefono"),
            Paziente.indirizzo,
            func.coalesce(func.array_agg(Allergia.nome_allergia.distinct()), []).label(
                "allergie"
            ),
            func.coalesce(
                func.array_remove(
                    func.array_agg(CondizioneCronica.nome_condizione.distinct()), None
                ),
                [],
            ).label("condizioni"),
            func.max(ContattoEmergenza.nome_emergenza).label("nome_emergenza"),
            func.max(ContattoEmergenza.relazione).label("relazione"),
            func.max(ContattoEmergenza.numero_emergenza).label("numero_emergenza"),
        )
        .join(Account, Paziente.account_id == Account.id)
        .outerjoin(Allergia, Allergia.paziente_id == Paziente.id)
        # join paziente, PazienteCondizione (tabella di associazione) e condizione_cronica
        .outerjoin(
            PazienteCondizione,
            PazienteCondizione.paziente_id == Paziente.id,
        )
        .outerjoin(
            CondizioneCronica,
            (PazienteCondizione.condizione_id == CondizioneCronica.id)
            & (CondizioneCronica.nome_condizione.isnot(None)),
        )
        .outerjoin(ContattoEmergenza, ContattoEmergenza.paziente_id == Paziente.id)
        .where(Paziente.id == paziente_id)
        .group_by(Paziente.id, Account.id)
    )

    result = await session.execute(query)
    row = result.one()
    row_dict = dict(row._mapping)

    row_dict["allergie"] = row_dict.get("allergie") or []
    # Rinomina "condizioni" a "condizioni_croniche" per il mapping corretto
    row_dict["condizioni_croniche"] = row_dict.pop("condizioni", [])

    return ProfiloResponse(**row_dict)


# modifica profilo
@pazienti.patch("/modifica_profilo/me", response_model=ProfiloResponse)
async def modifica_profilo(
    payload: AggiornaProfilo,
    session: AsyncSession = Depends(get_async_session),
    paziente_id: int = Depends(get_current_paziente_id),
):
    result = await session.execute(select(Paziente).where(Paziente.id == paziente_id))
    profilo = result.scalar_one()

    field_mapping = {
        "numero_telefono": "n_telefono",
    }

    # Campi da escludere dal setattr diretto (relazioni o gestiti separatamente)
    EXCLUDED_FIELDS = {
        "nome_emergenza",
        "relazione",
        "numero_emergenza",
        "allergie",
        "condizioni_croniche",  # <-- aggiunti questi
    }

    for field, value in payload.model_dump(exclude_unset=True).items():
        if field not in EXCLUDED_FIELDS:
            model_field = field_mapping.get(field, field)
            if value is not None:
                setattr(profilo, model_field, value)

    # Gestione contatto di emergenza
    if any(
        getattr(payload, f, None) is not None
        for f in ["nome_emergenza", "relazione", "numero_emergenza"]
    ):
        result = await session.execute(
            select(ContattoEmergenza).where(
                ContattoEmergenza.paziente_id == paziente_id
            )
        )
        contatto = result.scalar_one_or_none()
        if not contatto:
            contatto = ContattoEmergenza(paziente_id=paziente_id)
            session.add(contatto)

        if payload.nome_emergenza is not None:
            contatto.nome_emergenza = payload.nome_emergenza
        if payload.relazione is not None:
            contatto.relazione = payload.relazione
        if payload.numero_emergenza is not None:
            contatto.numero_emergenza = payload.numero_emergenza

    # Gestione allergie (se presenti nel payload)
    if payload.model_fields_set & {"allergie"}:
        # Cancella le allergie esistenti e reinserisce
        await session.execute(
            Allergia.__table__.delete().where(Allergia.paziente_id == paziente_id)
        )
        for nome in payload.allergie:
            session.add(Allergia(nome_allergia=nome, paziente_id=paziente_id))

    # Gestione condizioni croniche (se presenti nel payload)
    if payload.model_fields_set & {"condizioni_croniche"}:
        # Rimuovi le associazioni esistenti
        await session.execute(
            PazienteCondizione.__table__.delete().where(
                PazienteCondizione.paziente_id == paziente_id
            )
        )
        for nome in payload.condizioni_croniche:
            # Cerca o crea la condizione
            res = await session.execute(
                select(CondizioneCronica).where(
                    CondizioneCronica.nome_condizione == nome
                )
            )
            condizione = res.scalar_one_or_none()
            if not condizione:
                condizione = CondizioneCronica(nome_condizione=nome)
                session.add(condizione)
                await session.flush()  # ottieni l'id prima del commit
            session.add(
                PazienteCondizione(paziente_id=paziente_id, condizione_id=condizione.id)
            )

    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(status_code=400, detail="Dati non validi")

    # Ritorna profilo aggiornato
    query = (
        select(
            Paziente.id,
            Paziente.nome,
            Paziente.cognome,
            Paziente.altezza,
            Paziente.gruppo_sanguigno,
            Paziente.peso,
            Paziente.data_nascita,
            Paziente.codice_fiscale,
            Account.email,
            Paziente.n_telefono.label("numero_telefono"),
            Paziente.indirizzo,
            func.coalesce(func.array_agg(Allergia.nome_allergia.distinct()), []).label(
                "allergie"
            ),
            func.coalesce(
                func.array_remove(
                    func.array_agg(CondizioneCronica.nome_condizione.distinct()), None
                ),
                [],
            ).label("condizioni"),
            func.max(ContattoEmergenza.nome_emergenza).label("nome_emergenza"),
            func.max(ContattoEmergenza.relazione).label("relazione"),
            func.max(ContattoEmergenza.numero_emergenza).label("numero_emergenza"),
        )
        .join(Account, Paziente.account_id == Account.id)
        .outerjoin(Allergia, Allergia.paziente_id == Paziente.id)
        .outerjoin(PazienteCondizione, PazienteCondizione.paziente_id == Paziente.id)
        .outerjoin(
            CondizioneCronica,
            (PazienteCondizione.condizione_id == CondizioneCronica.id)
            & (CondizioneCronica.nome_condizione.isnot(None)),
        )
        .outerjoin(ContattoEmergenza, ContattoEmergenza.paziente_id == Paziente.id)
        .where(Paziente.id == paziente_id)
        .group_by(Paziente.id, Account.id)
    )

    result = await session.execute(query)
    row = result.one()
    row_dict = dict(row._mapping)
    row_dict["condizioni_croniche"] = row_dict.pop("condizioni", [])
    return ProfiloResponse(**row_dict)


@pazienti.get("/{id}", response_model=PazienteResponse)
async def trovaPaziente(id: int, session: AsyncSession = Depends(get_async_session)):
    print(f"[DEBUG] /{id} colpito con id={id}")

    paziente = await trova_per_id(session, Paziente, id)
    if not paziente:
        raise HTTPException(
            status_code=404, detail="Paziente non trovato o inesistente"
        )
    return paziente
