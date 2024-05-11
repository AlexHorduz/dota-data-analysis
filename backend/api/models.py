from pydantic import BaseModel

from typing import Optional, Dict

class RatingInputModel(BaseModel):
    rating: Optional[int] = None

class RecommenderInputModel(BaseModel):
    games_played: Dict[int, int]
    N: Optional[int] = 3