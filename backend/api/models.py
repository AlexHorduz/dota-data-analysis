from pydantic import BaseModel

from typing import Optional, Dict

class RatingInputModel(BaseModel):
    rating: Optional[int] = None

class RecommenderInputModel(BaseModel):
    games_played: Dict[int, int]
    N: Optional[int] = 3

class HeroInputModel(BaseModel):
    id: int
    hero_name: str

class HeroIdInputModel(BaseModel):
    id: int