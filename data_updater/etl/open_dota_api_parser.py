from typing import List, Dict

import requests

from .data_parser import DataParser


class OpenDotaParser(DataParser):
    def __init__(self):
        self.open_dota_url = "https://api.opendota.com/api"

    def get_user_heroes_games(self, account_id) -> List[Dict[str, int]]:
        response = requests.get(f"{self.open_dota_url}/players/{account_id}/heroes").json()
        response = [
            {
                "hero_id": data["hero_id"],
                "games": data["games"],
                "win": data["win"]
            } 
            for data in response
        ]
        return response

    def get_user_last_rating(self, account_id) -> int:
        response = requests.get(f"{self.open_dota_url}/players/{account_id}/ratings").json()
        response = response[0]["competitive_rank"]
        return response
    
    def get_items_popularity(self, hero_id) -> Dict[str, Dict[str, int]]:
        response = requests.get(f"{self.open_dota_url}/heroes/{hero_id}/itemPopularity").json()
        return response
    
    def get_public_matches(self, min_rating_id: int = None, max_rating_id: int = None) -> List[Dict]:
        params = {
            "min_rank": min_rating_id,
            "max_rank": max_rating_id
        }
        response = requests.get(f"{self.open_dota_url}/publicMatches", params=params).json()

        response = [
            {
                "match_id": data["match_id"],
                "radiant_win": data["radiant_win"],
                "radiant_heroes": data["radiant_team"],
                "dire_heroes": data["dire_team"],
            }
            for data in response
        ]

        return response
