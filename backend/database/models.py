from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    steam_id = Column(String, unique=True, index=True)
    username = Column(String, unique=False, index=True)

class Hero(Base):
    __tablename__ = 'heroes'

    id = Column(Integer, primary_key=True, index=True)
    hero_name = Column(String, unique=True, index=True)

class UserHeroGames(Base):
    __tablename__ = 'user_hero_games'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=False, index=True)
    hero_id = Column(Integer, unique=False, index=True)
    games_played = Column(Integer, unique=False, index=True)