from typing import Dict, List
import datetime
import json
import random
import string

from sqlalchemy import func

from .data_parser import DataParser
from sql_database import dal
from sql_database import SessionLocal
from sql_database.models import (
    Hero,
    User,
    Item,
    RatingRange,
    UserHeroGames,
    HeroesData,
    HeroesComboData,
    ItemsData
)
from constants import ALL_HEROES_IDS

def get_random_string():
    return ''.join(
        random.choices(
            string.ascii_uppercase + string.digits, 
            k=10
        )
    )

class UpdateService:
    def __init__(self, parser: DataParser):
        self.parser = parser
        self.ranks_ranges = [(min_rating, min_rating+5) for min_rating in range(10, 81, 10)]

        with open('heroes.json') as json_file:
            heroes = json.load(json_file)

        heroes = [
            {
                "id": data["id"],
                "hero_name": data["localized_name"]
            }
            for _, data in heroes.items()
        ]
        heroes = [Hero(**hero) for hero in heroes]


        with open('items.json') as json_file:
            items = json.load(json_file)


        items = [
            {
                "id": data["id"],
                "name": name
            }
            for name, data in items.items()
        ]
        items = [Item(**item) for item in items]

        rating_ranges = [
            {
                "id": i,
                "rating_min": i*10,
                "rating_max": i*10 + 5
            }
            for i in range(1, 9)
        ]
        rating_ranges = [RatingRange(**rating_range) for rating_range in rating_ranges]

        users = []

        for i in range(10_000):
            name = get_random_string()
            steam_id = get_random_string()
            user = {
                "id": i,
                "steam_id": steam_id,
                "username": name
            }
            users.append(User(**user))

        db = SessionLocal()
        try:
            db.query(UserHeroGames).delete()
            db.query(HeroesData).delete()
            db.query(HeroesComboData).delete()
            db.query(ItemsData).delete()

            db.query(Hero).delete()
            db.add_all(heroes)

            db.query(User).delete()
            db.add_all(users)

            db.query(Item).delete()
            db.add_all(items)

            db.query(RatingRange).delete()
            db.add_all(rating_ranges)

            db.commit()


        finally:
            db.close()



    
    def update_user_heroes_table(self, data: Dict[str, List[Dict[str, int]]]):   
        model_data = []
        for user_id, all_games_data in data.items():
            for games_data in all_games_data:
                user_hero_games = {
                    "user_id": user_id,
                    "hero_id": games_data["hero_id"],
                    "games_played": games_data["games"]
                }
                model_data.append(UserHeroGames(**user_hero_games))

        db = SessionLocal()
        try:
            db.add_all(model_data)
            db.commit()
        finally:
            db.close()

    def update_heroes_data(self, matches: List[Dict], rank_id: int, timestamp):
        heroes_dict = dict()
        for match in matches:
            for hero in match["radiant_heroes"]:
                heroes_dict[hero] = heroes_dict.get(hero, {
                    "times_played": 0,
                    "wins_count": 0
                })
                heroes_dict[hero]["times_played"] += 1
                if match["radiant_win"]:
                    heroes_dict[hero]["wins_count"] += 1

            for hero in match["dire_heroes"]:
                heroes_dict[hero] = heroes_dict.get(hero, {
                    "times_played": 0,
                    "wins_count": 0
                })
                heroes_dict[hero]["times_played"] += 1
                if not match["radiant_win"]:
                    heroes_dict[hero]["wins_count"] += 1

        heroes_model = []

        for hero_id, data in heroes_dict.items():
            hero_model = {
                "rating_id": rank_id,
                "hero_id": hero_id,
                "timestamp": timestamp,
                "times_played": data["times_played"],
                "wins_count": data["wins_count"]
            }
            heroes_model.append(HeroesData(**hero_model))

        db = SessionLocal()

        try:
            db.add_all(heroes_model)
            db.commit()
        finally:
            db.close()

    def update_heroes_combo_data(self, matches: List[Dict], rank_id: int, timestamp):
        heroes_combo_dict = dict()
        for match in matches:
            for hero1 in match["radiant_heroes"]:
                for hero2 in match["radiant_heroes"]:
                    if hero1 == hero2:
                        continue

                    
                    if (hero2, hero1) in heroes_combo_dict.keys():
                        continue

                    heroes_tuple = (hero1, hero2)
                    heroes_combo_dict[heroes_tuple] = heroes_combo_dict.get(heroes_tuple, {
                        "times_played": 0,
                        "wins_count": 0
                    })
                    heroes_combo_dict[heroes_tuple]["times_played"] += 1
                    if match["radiant_win"]:
                        heroes_combo_dict[heroes_tuple]["wins_count"] += 1

            for hero1 in match["dire_heroes"]:
                for hero2 in match["dire_heroes"]:
                    if hero1 == hero2:
                        continue

                    if (hero2, hero1) in heroes_combo_dict.keys():
                        continue

                    heroes_tuple = (hero1, hero2)
                    heroes_combo_dict[heroes_tuple] = heroes_combo_dict.get(heroes_tuple, {
                        "times_played": 0,
                        "wins_count": 0
                    })
                    heroes_combo_dict[heroes_tuple]["times_played"] += 1
                    if not match["radiant_win"]:
                        heroes_combo_dict[heroes_tuple]["wins_count"] += 1

        heroes_combo_models = []

        for heroes_tuple, data in heroes_combo_dict.items():
            heroes_combo_model = {
                "rating_id": rank_id,
                "hero1_id": heroes_tuple[0],
                "hero2_id": heroes_tuple[1],
                "timestamp": timestamp,
                "times_played": data["times_played"],
                "wins_count": data["wins_count"]
            }
            heroes_combo_models.append(HeroesComboData(**heroes_combo_model))

        db = SessionLocal()

        try:
            db.add_all(heroes_combo_models)
            db.commit()
        finally:
            db.close()

    def update_items_data(self, data, hero_id, timestamp):
        items_data_models = []
        for category, category_data in data.items():
            for item_str_id, games_count in category_data.items():
                items_data_model = {
                    "hero_id": hero_id,
                    "item_id": int(item_str_id),
                    "timestamp": timestamp,
                    "category": category,
                    "games_count": games_count
                }
                items_data_models.append(ItemsData(**items_data_model))
        
        db = SessionLocal()
        try:
            db.add_all(items_data_models)
            db.commit()
        finally:
            db.close()

    def update_all_data(self):
        timestamp = datetime.datetime.now()

        users_account_ids  = []
        db = SessionLocal()
        try:
            users_account_ids = db.query(User).order_by(func.random()).limit(1000).all()
            users_account_ids = [(user.id, user.steam_id) for user in users_account_ids]
        finally:
            db.close()

        user_heroes_games = dict()
        for id, account_id in users_account_ids:
            user_heroes_games[id] = self.parser.get_user_heroes_games(account_id)

        self.update_user_heroes_table(user_heroes_games)

        ranks_ranges = dict()
        db = SessionLocal()
        try:
            ranks_ranges = db.query(RatingRange).all()
            ranks_ranges = {rating_range.id: [rating_range.rating_min, rating_range.rating_max] for rating_range in ranks_ranges}
        finally:
            db.close()
        
        for id, ranges in ranks_ranges.items():
            min_r, max_r = ranges
            matches = self.parser.get_public_matches(min_r, max_r)
            self.update_heroes_data(matches, id, timestamp)
            self.update_heroes_combo_data(matches, id, timestamp)


        for id in ALL_HEROES_IDS:
            items_data = self.parser.get_items_popularity(id)
            self.update_items_data(items_data, id, timestamp)
        

        # TODO update toxicity data
        # TODO update words popularity data