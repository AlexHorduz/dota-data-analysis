
import string
import random
from typing import (
    List,
    Dict,
    Tuple
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

@router.post("/getToxicity", response_model=Dict[str, List])
async def get_toxicity(rating_input: RatingInputModel):
    N = 10
    init_toxicity = rating_input.rating if rating_input.rating else 100
    toxicity = [init_toxicity] * N
    response = {
        "toxicity": toxicity
    }
    if rating_input.rating:
        response["names"] = [str(year) for year in range(2010, 2010+N)]
    else:
        step = 300
        response["names"] = [f"{rating} - {rating+step}" for rating in range(0, step*N, step)]
    return response

@router.get("/getWordsPopularity", response_model=List[Tuple[str, int]])
async def get_words_popularity(rating_input: RatingInputModel):
    words_popularity = dict()
    for i in range(10):
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