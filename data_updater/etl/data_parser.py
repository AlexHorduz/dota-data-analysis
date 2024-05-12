from typing import List, Dict

class DataParser:
    def get_user_heroes_games(self, account_id) -> List[Dict[str, int]]:
        pass

    def get_user_last_rating(self, account_id) -> int:
        pass

    def get_items_popularity(self, hero_id) -> Dict[str, Dict[str, int]]:
        pass

    def get_public_matches(self, min_rating_id: int = None, max_rating_id: int = None) -> List[Dict]:
        pass