from fastapi import APIRouter

from .models import (
    RatingInputModel,
    RecommenderInputModel,
    HeroIdInputModel
)
from . import endpoints

router = APIRouter()

router.include_router(endpoints.router)