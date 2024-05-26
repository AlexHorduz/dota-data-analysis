from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SQL_DATABASE_URL: str
    DEBUG: bool
    MIN_TIME_TO_UPDATE: int

    class Config:
        env_file = ".env"

settings = Settings()