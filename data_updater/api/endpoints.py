
from fastapi import APIRouter

from etl.update_service import UpdateService
from etl.synthetic_data_parser import SyntheticDataParser
from etl.open_dota_api_parser import OpenDotaParser
from .models import UserHeroModel
from core.config import settings

router = APIRouter()

if settings.DEBUG == True:
    pars = SyntheticDataParser()
else:
    pars = OpenDotaParser()
upd = UpdateService(pars)

# TODO do separate method for each needed part (plot?)
@router.post("/updateData")
async def update_data():
    upd.update_all_data()