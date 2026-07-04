# pip install pydantic-settings
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr

ENV_FILE = Path(__file__).parent / ".env"


class Settings(BaseSettings):
    app_name: str

    # db
    model_config = SettingsConfigDict(env_file=ENV_FILE)
    db_host: str
    db_port: int
    db_user: str
    db_password: SecretStr
    db_name: str

    # tokens
    secret_key: SecretStr
    algorithm: str
    durata_token: int

    # csrf
    csrf_secret: str


settings = Settings()
