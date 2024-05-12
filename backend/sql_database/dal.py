from typing import List, Tuple
import random

from sqlalchemy.orm import Session
from sqlalchemy.sql import func, select

from .models import (
    Hero, 
    UserHeroGames,
    HeroesData
)



def get_heroes_data(session: Session, rating_id: int):
    subquery = (
        session.query(func.max(HeroesData.timestamp).label("max_timestamp"))
        .subquery()
    )
    if rating_id:
        result = (
            session.query(HeroesData)
            .join(subquery, subquery.c.max_timestamp == HeroesData.timestamp)\
            .filter(HeroesData.rating_id == rating_id)\
            .all()
        )
    else:
        result = (
            session.query(HeroesData)
            .join(subquery, subquery.c.max_timestamp == HeroesData.timestamp)\
            .all()
        )

    return result

def get_all_heroes_ids(session: Session):
    return [hero.id for hero in session.query(Hero).all()]

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