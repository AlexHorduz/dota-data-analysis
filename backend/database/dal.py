from sqlalchemy.orm import Session
from .models import User, Hero, UserHeroGames

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_hero_by_id(db: Session, hero_id: int):
    return db.query(Hero).filter(Hero.id == hero_id).first()

def get_games_played_by_user(db: Session, user_id: int):
    return db.query(UserHeroGames).filter(UserHeroGames.user_id == user_id).all()

def get_games_played_by_hero(db: Session, hero_id: int):
    return db.query(UserHeroGames).filter(UserHeroGames.hero_id == hero_id).all()