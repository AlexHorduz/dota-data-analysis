from fastapi import APIRouter

from .models import (
    RatingInputModel,
    RecommenderInputModel
)
from . import endpoints

router = APIRouter()

router.include_router(endpoints.router)