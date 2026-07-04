from src.config import settings as s
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.pool import NullPool
from typing import AsyncGenerator

DATABASE_URL = f"postgresql+asyncpg://{s.db_user}:{s.db_password.get_secret_value()}@{s.db_host}:{s.db_port}/{s.db_name}"


class Base(DeclarativeBase):
    pass


engine = create_async_engine(DATABASE_URL, poolclass=NullPool)
async_session_maker = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False, future=True
)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()
