from pydantic import BaseModel

from typing import Optional

class RatingInputModel(BaseModel):
    rating: Optional[int] = None