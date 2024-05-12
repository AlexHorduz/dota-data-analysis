from typing import List, Tuple
import random

from sqlalchemy.orm import Session
from sqlalchemy.sql import func, select

from .models import User, Hero, UserHeroGames

def add_hero(db: Session, hero_id: int, hero_name: str):
    new_hero = Hero(id=hero_id, hero_name=hero_name)
    db.add(new_hero)
    db.commit()

def get_all_heroes(db: Session):
    return db.query(Hero).all()

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

def get_random_user_ids_from_user_hero_games(session: Session, count: int) -> List[int]:
    random_user_ids = (
        session.query(UserHeroGames.user_id)
        .distinct()
        .all()
    )
    random_user_ids = random.sample(random_user_ids, count)
    return [id for (id, ) in random_user_ids]

def get_hero_games_count_by_users(session: Session, user_ids: List[int]) -> List[UserHeroGames]:
    games_played = (
        session.query(UserHeroGames)
        .filter(UserHeroGames.user_id.in_(user_ids))
        .all()
    )
    return games_played