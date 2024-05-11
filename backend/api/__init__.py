from fastapi import APIRouter

from .models import RatingInputModel
from . import endpoints

router = APIRouter()

router.include_router(endpoints.router)