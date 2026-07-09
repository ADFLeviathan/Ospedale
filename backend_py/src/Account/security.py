import time

from fastapi import HTTPException
from src.config import settings
import jwt  # pip install PyJWT


def sign_jwt(account_id: int) -> dict[str, str]:
    scadenza = int(time.time()) + settings.durata_token * 60
    payload = {"account_id": account_id, "exp": scadenza}
    token = jwt.encode(
        payload, settings.secret_key.get_secret_value(), settings.algorithm
    )
    return {"access_token": token}


def decode_jwt(token: str) -> dict:
    try:
        return jwt.decode(
            token, settings.secret_key.get_secret_value(), [settings.algorithm]
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=403, detail="Token scaduto")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=403, detail="Token non valido")


# class JWTBearer(HTTPBearer):
#     def __init__(self, auto_error=True):
#         super().__init__(auto_error=auto_error)

#     async def __call__(self, request: Request) -> int:
#         credenziali: HTTPAuthorizationCredentials = await super().__call__(request)

#         if not credenziali or not credenziali.scheme == "Bearer":
#             raise HTTPException(status_code=403, detail="Autenticazione fallita")
#         decoded_token = decode_jwt(credenziali.credentials)
#         account_id = decoded_token.get("account_id")

#         if account_id is None:
#             raise HTTPException(status_code=403, detail="Token non valido")
#         return account_id
