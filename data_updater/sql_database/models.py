from sqlalchemy import Column, Integer, String, Float, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Hero(Base):
    __tablename__ = "heroes"

    id = Column(Integer, primary_key=True, index=True)
    hero_name = Column(String(255), unique=True, index=True)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    steam_id = Column(String(255), unique=True, index=True)
    username = Column(String(255))

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True)

class RatingRange(Base):
    __tablename__ = "rating_ranges"

    id = Column(Integer, primary_key=True, index=True)
    rating_min = Column(Integer)
    rating_max = Column(Integer)

class UserHeroGames(Base):
    __tablename__ = "user_hero_games"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    hero_id = Column(Integer, index=True)
    games_played = Column(Integer)

class ChatToxicity(Base):
    __tablename__ = "chat_toxicity"

    id = Column(Integer, primary_key=True, index=True)
    rating_id = Column(Integer, index=True)
    timestamp = Column(TIMESTAMP)
    toxicity = Column(Float)

class WordsPopularity(Base):
    __tablename__ = "words_popularity"

    id = Column(Integer, primary_key=True, index=True)
    rating_id = Column(Integer, index=True)
    timestamp = Column(TIMESTAMP)
    word = Column(String(255))
    times_used = Column(Integer)

class HeroesData(Base):
    __tablename__ = "heroes_data"

    id = Column(Integer, primary_key=True, index=True)
    rating_id = Column(Integer, index=True)
    hero_id = Column(Integer, index=True)
    timestamp = Column(TIMESTAMP)
    times_played = Column(Integer)
    wins_count = Column(Integer)

class ItemsData(Base):
    __tablename__ = "items_data"

    id = Column(Integer, primary_key=True, index=True)
    hero_id = Column(Integer, index=True)
    item_id = Column(Integer, index=True)
    timestamp = Column(TIMESTAMP)
    games_count = Column(Integer)
    category = Column(String(255))

class HeroesComboData(Base):
    __tablename__ = "heroes_combo_data"

    id = Column(Integer, primary_key=True, index=True)
    hero1_id = Column(Integer, index=True)
    hero2_id = Column(Integer, index=True)
    rating_id = Column(Integer, index=True)
    timestamp = Column(TIMESTAMP)
    times_played = Column(Integer)
    wins_count = Column(Integer)