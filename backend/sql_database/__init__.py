
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from core.config import settings
from .dal import (
    get_games_played_by_user, 
    get_all_heroes_ids, 
    get_random_user_ids_from_user_hero_games, 
    get_hero_games_count_by_users,
    get_all_heroes
)
from . import dal


engine = create_engine(settings.SQL_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)