import string
import random
from typing import (
    List,
    Dict,
    Tuple,
)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import RatingInputModel


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify specific origins here instead of "*"
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.post("/getToxicity", response_model=Dict[str, List])
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

@app.post("/getWordsPopularity", response_model=List[Tuple[str, int]])
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


@app.post("/getRandomWord", response_model=str)
async def get_random_word():
    random_word = ''.join(
        random.choices(
            string.ascii_uppercase + string.digits, 
            k=10
        )
    )
    
    return random_word


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8001)