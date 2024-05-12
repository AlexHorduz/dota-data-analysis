from typing import List, Tuple, Dict

from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from .models import User, Hero, UserHeroGames

def update_user_hero_table(db: Session, data: List[Dict[str, int]]):
    print(data)
    for row in data:
        user_hero_data = UserHeroGames(**row)
        existing_row = db.query(UserHeroGames)\
            .filter(UserHeroGames.user_id == user_hero_data.user_id)\
            .filter(UserHeroGames.hero_id == user_hero_data.hero_id)\
            .first()
        if existing_row:
            existing_row.games_played = user_hero_data.games_played
        else:
            db.add(user_hero_data)
    db.commit()

    # print(f"|{db.query(UserHeroGames).all()}|")

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