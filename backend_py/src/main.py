from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.pazienti.pazienti_model import *
from src.pazienti.pazienti_router import pazienti

from src.medici.medici_model import Medico
from src.medici.medici_router import medici
from src.reparti.reparti_model import Reparto
from src.reparti.reparti_router import reparti
from src.prenotazioni.prenotazioni_router import prenotazioni
from src.prenotazioni.prenotazioni_model import Prenotazione
from src.referti.referti_model import Referto
from src.referti.referti_router import referti
from src.disponibilita_medici.disp_model import Disponibilita_medico
from src.disponibilita_medici.disp_router import disp
from src.Account.account_model import Account
from src.Account.account_router import auth

# slowapi per rate limit
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIASGIMiddleware

# csrf
from starlette_csrf.middleware import CSRFMiddleware
from src.config import settings
from dotenv import load_dotenv

load_dotenv()

# per evitare che il browser blocchi le richieste poiché
# React (localhost:5173) e FastAPI (127.0.0.1:8000) sono considerati origini diverse.
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://ospedale-2rkgmg5cy-alesdf.vercel.app",
    "https://ospedale.onrender.com/me",
]

limiter = Limiter(key_func=get_remote_address)

app = FastAPI()

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(SlowAPIASGIMiddleware)

# csrf
app.add_middleware(
    CSRFMiddleware,
    secret=settings.csrf_secret,
    cookie_name="csrftoken",
    header_name="x-csrftoken",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "x-csrftoken"],
)


app.include_router(pazienti)
app.include_router(medici)
app.include_router(reparti)
app.include_router(prenotazioni)
app.include_router(referti)
app.include_router(disp)
app.include_router(auth)
