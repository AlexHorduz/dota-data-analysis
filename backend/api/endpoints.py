
import string
import random
from typing import (
    List,
    Dict,
    Tuple,
    Optional
)

from fastapi import APIRouter, HTTPException
from .models import (
    RatingInputModel,
    RecommenderInputModel,
    HeroInputModel
)
from data_analysis.heroes_recommender import Recommender
from data_analysis.toxicity_classifier import ToxicityClassifier

from sql_database import dal
from sql_database import SessionLocal

router = APIRouter()

rec = Recommender()
rec.update_data()

# tox = ToxicityClassifier()


@router.post("/addHero")
async def add_hero(data: HeroInputModel):
    db = SessionLocal()
    try:
        dal.add_hero(db, data.id, data.hero_name)
        return {"message": "Hero created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create hero: {str(e)}")
    finally:
        db.close()


@router.get("/getAllHeroes")
async def get_all_heroes():
    db = SessionLocal()
    try:
        all_heroes = dal.get_all_heroes(db)
        print(all_heroes)
        return all_heroes
    finally:
        db.close()

@router.post("/getToxicityOverTime", response_model=Dict[str, List])
async def get_toxicity_over_time(rating_input: RatingInputModel):
    # TODO get data from database
    N = 10
    toxicity = [random.randint(0, 100) for i in range(N)]
    response = {
        "toxicity": toxicity,
        "names":  [str(year) for year in range(2010, 2010+N)]
    }
   
    return response

@router.post("/getToxicityOverRating", response_model=Dict[str, List])
async def get_toxicity_over_rating():
    # TODO get data from database
    N = 10
    toxicity = [random.randint(0, 100) for i in range(N)]
    response = {
        "toxicity": toxicity
    }
    step = 300
    response["names"] = [f"{rating} - {rating+step}" for rating in range(0, step*N, step)]
    return response

@router.get("/getWordsPopularity", response_model=List[Tuple[str, int]])
async def get_words_popularity(rating: Optional[int] = None):
    words_popularity = dict()
    for i in range(100):
        random_word = ''.join(
            random.choices(
                string.ascii_uppercase + string.digits, 
                k=10
            )
        )
        random_count = random.randint(1, 100)
        words_popularity[random_word] = random_count

    words_popularity = sorted(
        words_popularity.items(), 
        key = lambda x: x[1], 
        reverse=True
    )

    return words_popularity


@router.get("/getRandomWord", response_model=str)
async def get_random_word():
    random_word = ''.join(
        random.choices(
            string.ascii_uppercase + string.digits, 
            k=10
        )
    )
    
    return random_word

@router.post("/getHeroesRecommendation", response_model=List[int])
async def get_heroes_recommendation(data: RecommenderInputModel):
    N = data.N
    
    if N < 1:
        return []
    
    games_played = data.games_played
    return rec.get_recommendations(games_played, N)