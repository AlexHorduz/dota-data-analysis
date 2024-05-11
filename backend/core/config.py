from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SQL_DATABASE_URL: str
    DEBUG: bool

    class Config:
        env_file = ".env"

settings = Settings()