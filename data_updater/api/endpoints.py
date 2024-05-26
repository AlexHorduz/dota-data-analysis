from time import time

from fastapi import APIRouter

from etl.update_service import UpdateService
from etl.synthetic_data_parser import SyntheticDataParser
from etl.open_dota_api_parser import OpenDotaParser
from core.config import settings

router = APIRouter()

if settings.DEBUG == True:
    pars = SyntheticDataParser()
else:
    pars = OpenDotaParser()
upd = UpdateService(pars)


LAST_UPDATE_TIME = None

@router.post("/updateData")
async def update_data():
    global LAST_UPDATE_TIME

    if LAST_UPDATE_TIME and ((time() - LAST_UPDATE_TIME) < settings.MIN_TIME_TO_UPDATE):
        return {"message": f"Please wait {int(settings.MIN_TIME_TO_UPDATE - (time() - LAST_UPDATE_TIME))} seconds until the next update"}
    
    upd.update_all_data()
    LAST_UPDATE_TIME = time()
    return {"message": "Data has been updated successfully"}