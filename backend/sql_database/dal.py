from typing import List, Tuple

from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from .models import User, Hero, UserHeroGames


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_hero_by_id(db: Session, hero_id: int):
    return db.query(Hero).filter(Hero.id == hero_id).first()

def get_all_heroes_ids(db: Session):
    return [hero.id for hero in db.query(Hero).all()]

def get_all_heroes_ids_and_names(db: Session) -> List[Tuple[int, str]]:
    return [(hero.id, hero.name) for hero in db.query(Hero).all()]

def get_games_played_by_user(db: Session, user_id: int):
    return db.query(UserHeroGames).filter(UserHeroGames.user_id == user_id).all()

def get_games_played_by_hero(db: Session, hero_id: int):
    return db.query(UserHeroGames).filter(UserHeroGames.hero_id == hero_id).all()

def get_random_user_ids(session: Session, count: int) -> List[int]:
    # Retrieve random user IDs from the database
    random_user_ids = (
        session.query(User.id)
        .order_by(func.random())  # This is specific to PostgreSQL, use RAND() for MySQL
        .limit(count)
        .all()
    )
    return [user_id for (user_id,) in random_user_ids]

def get_hero_games_count_by_users(session: Session, user_ids: List[int]) -> List[UserHeroGames]:
    # Retrieve games played by the selected users
    games_played = (
        session.query(UserHeroGames)
        .filter(UserHeroGames.user_id.in_(user_ids))
        .all()
    )
    return games_played