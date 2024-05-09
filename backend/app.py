from typing import Optional
from pydantic import BaseModel

from fastapi import FastAPI

class RatingInputModel(BaseModel):
    rating: Optional[int] = None

app = FastAPI()

@app.post("/getToxicity")
async def get_toxicity(rating_input: RatingInputModel):
    timestamps = list(range(10))
    init_toxicity = rating_input.rating if rating_input.rating else 100
    toxicity = [init_toxicity] * len(timestamps)
    return toxicity

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)