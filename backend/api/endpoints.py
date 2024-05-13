
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
    HeroIdInputModel
)
from data_analysis.heroes_recommender import Recommender

from sql_database import dal
from sql_database import SessionLocal

router = APIRouter()

rec = Recommender()
rec.update_data()

@router.post("/getWordsPopularity")
async def get_words_popularity(rating_input: RatingInputModel):
    rank_id = rating_input.rating

    db = SessionLocal()
    try:
        response = dal.get_words_popularity_data(db, rank_id)
    finally:
        db.close()

    word_counts = dict()

    for row in response:
        word = row.word
        count = row.times_used
        word_counts[word] = word_counts.get(word, 0) + count

    response = list(word_counts.items())
    response = sorted(response, key=lambda x: x[1], reverse=True)

    return response

@router.post("/getHeroesPopularity")
async def get_heroes_popularity(rating_input: RatingInputModel):
    rank_id = rating_input.rating

    db = SessionLocal()
    try:
        response = dal.get_heroes_data(db, rank_id)
    finally:
        db.close()

    return response



@router.post("/getItemsPopularity")
async def get_items_popularity(id_input: HeroIdInputModel):
    id = id_input.id

    db = SessionLocal()
    try:
        items = dal.get_items_data(db, id)
    finally:
        db.close()

    response = dict()

    for item in items:
        category = item.category
        response[category] = response.get(category, [])

        response[category].append([
            item.item_id,
            item.games_count
        ])

    for category in response.keys():
        response[category] = sorted(
            response[category],
            key=lambda pair: pair[1],
            reverse=True
        )

    return response

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

@router.post("/getHeroesRecommendation", response_model=List[int])
async def get_heroes_recommendation(data: RecommenderInputModel):
    N = data.N
    
    if N < 1:
        return []
    
    games_played = data.games_played
    return rec.get_recommendations(games_played, N)