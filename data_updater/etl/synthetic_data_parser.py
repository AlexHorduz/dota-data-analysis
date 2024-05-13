from typing import List, Dict
import random

import requests

from .data_parser import DataParser
import sys

sys.path.append("./")

from constants import ALL_HEROES_IDS, ALL_ITEMS_IDS


class SyntheticDataParser(DataParser):
    def get_user_heroes_games(self, account_id) -> List[Dict[str, int]]:
        response = []
        for id in random.sample(ALL_HEROES_IDS, random.randint(5, 50)):
            games = random.randint(0, 100)
            win = random.randint(0, games)
            response.append({
                "hero_id": id,
                "games": games,
                "win": win
            })
        return response

    def get_user_last_rating(self, account_id) -> int:
        rating = random.randint(10, 85)
        return rating
    
    def get_items_popularity(self, hero_id)-> Dict[str, Dict[str, int]]:
        # categories = ["start_game_items", "early_game_items", "mid_game_items", "late_game_items"]
        # response = dict()
        # for cat in categories:
        #     number_of_items = random.randint(5, 15)
        #     curr_items = dict()
        #     for i in range(number_of_items):
        #         curr_items[str(random.choice(ALL_ITEMS_IDS))] = random.randint(1, 150)
        #     response[cat] = curr_items
        # return response
        open_dota_url = "https://api.opendota.com/api"
        response = requests.get(f"{open_dota_url}/heroes/{hero_id}/itemPopularity").json()
        return response
    
    def get_public_matches(self, min_rating_id: int = None, max_rating_id: int = None) -> List[Dict]:
        N = 10_000
        response = []
        for i in range(N):
            heroes = random.sample(ALL_HEROES_IDS, 10)
            response.append({
                "match_id": random.randint(1e6, 1e9),
                "radiant_win": random.choice([True, False]),
                "radiant_heroes": heroes[:5],
                "dire_heroes": heroes[5:],
            })
        return response

# pars = SyntheticDataParser()
# 76561199097772774

# print(pars.get_user_heroes_games(76561199097772774))
# print(pars.get_user_last_rating(76561199097772774))
# print(pars.get_items_popularity(1))
# print(pars.get_public_matches(min_rating_id=15))