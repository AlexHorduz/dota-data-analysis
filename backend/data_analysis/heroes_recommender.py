from typing import Dict, List

import pandas as pd
import numpy as np
from numpy.linalg import norm

from sql_database.dal import (
    get_random_user_ids,
    get_hero_games_count_by_users,
    get_all_heroes_ids
)
from sql_database import SessionLocal
from core.config import settings
from constants import ALL_HEROES_IDS

class Recommender:
    def __init__(self):
        self.interaction_matrix = None
        self.heroes_similarity = None

    def get_interaction_matrix(self):
        return self.interaction_matrix.copy(deep=True)
    
    def get_heroes_similarity(self):
        return self.heroes_similarity.copy(deep=True)

    def update_data(self, N = 1000):
        if settings.DEBUG:
            
            all_heroes_ids = ALL_HEROES_IDS
            num_of_heroes = len(all_heroes_ids)
            random_values = np.random.randint(0, 500, (N, num_of_heroes))
            self.interaction_matrix = pd.DataFrame(random_values, index=range(N), columns=all_heroes_ids)
        else:
            user_ids = get_random_user_ids(SessionLocal, N)
            games = get_hero_games_count_by_users(SessionLocal, user_ids)
            all_heroes_ids = get_all_heroes_ids(SessionLocal)
            
            self.interaction_matrix = pd.DataFrame(index=user_ids, columns=all_heroes_ids)
            self.interaction_matrix.fillna(0, inplace=True)

            for game in games:
                self.interaction_matrix.loc[game.user_id, game.hero_id] = game.games_played

        dot_product = np.dot(self.interaction_matrix.values.T, self.interaction_matrix.values)
        norm_matrix1 = np.linalg.norm(self.interaction_matrix, axis=0)
        norm_matrix2 = np.linalg.norm(self.interaction_matrix, axis=0)
        similarity = dot_product / (norm_matrix1[:, None] * norm_matrix2[None, :])

        self.heroes_similarity = pd.DataFrame(similarity, index=all_heroes_ids, columns=all_heroes_ids)
        print("Updated recommender's data")
        return self.heroes_similarity
        

    def get_recommendations(self, games_played: Dict[int, int], N: int = 3) -> List[int]:
        all_heroes_ids = self.heroes_similarity.columns
        games_df = pd.DataFrame(
            games_played, 
            columns=all_heroes_ids, 
            index=[0],
            dtype="float64"
        )
        games_df.fillna(0, inplace=True)


        games_df /= games_df.sum(axis=1).values[0]

        probabilities = (
            games_df.values 
            * self.heroes_similarity.values
        ).sum(axis=1)

        probabilities = pd.DataFrame(
            probabilities,
            index=all_heroes_ids,
            columns=["Probability"]
        )

        probabilities = probabilities.loc[
            ~probabilities.index.isin(games_played.keys()),
        ]

        probabilities.sort_values(
            by="Probability", 
            ascending=False, 
            inplace=True
        )        

        return list(probabilities.index[:N])