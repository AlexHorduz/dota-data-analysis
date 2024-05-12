
import string
import random
from typing import (
    List,
    Dict,
    Tuple,
    Optional
)

from fastapi import APIRouter
from .models import (
    RatingInputModel,
    RecommenderInputModel
)
from data_analysis.heroes_recommender import Recommender
from data_analysis.toxicity_classifier import ToxicityClassifier

router = APIRouter()

rec = Recommender()
rec.update_data()

tox = ToxicityClassifier()

# TODO maybe add endpoint for updating the data (for every chart)

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