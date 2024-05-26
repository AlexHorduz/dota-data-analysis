from pydantic import BaseModel

from typing import Dict

class UserHeroModel(BaseModel):
    user_id: int
    hero_id: int
    games_played: int