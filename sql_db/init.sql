-- Table 1: heroes
CREATE TABLE heroes (
    id SERIAL PRIMARY KEY,
    hero_name VARCHAR(255) UNIQUE
);

-- Table 2: users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    steam_id VARCHAR(255) UNIQUE,
    username VARCHAR(255)
);

-- Table 3: items
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE
);

-- Table 4: rating_ranges
CREATE TABLE rating_ranges (
    id SERIAL PRIMARY KEY,
    rating_min INT,
    rating_max INT
);

-- Table 5: user_hero_games
CREATE TABLE user_hero_games (
    id SERIAL PRIMARY KEY,
    user_id INT,
    hero_id INT,
    games_played INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (hero_id) REFERENCES heroes(id)
);

-- Table 6: chat_toxicity
CREATE TABLE chat_toxicity (
    id SERIAL PRIMARY KEY,
    rating_id INT,
    timestamp TIMESTAMP,
    toxicity FLOAT,
    FOREIGN KEY (rating_id) REFERENCES rating_ranges(id)
);

-- Table 7: words_popularity
CREATE TABLE words_popularity (
    id SERIAL PRIMARY KEY,
    rating_id INT,
    timestamp TIMESTAMP,
    word VARCHAR(255),
    times_used INT,
    FOREIGN KEY (rating_id) REFERENCES rating_ranges(id)
);

-- Table 8: heroes_data
CREATE TABLE heroes_data (
    id SERIAL PRIMARY KEY,
    rating_id INT,
    hero_id INT,
    timestamp TIMESTAMP,
    times_played INT,
    wins_count INT,
    FOREIGN KEY (rating_id) REFERENCES rating_ranges(id),
    FOREIGN KEY (hero_id) REFERENCES heroes(id)
);

-- Table 9: items_data
CREATE TABLE items_data (
    id SERIAL PRIMARY KEY,
    hero_id INT,
    item_id INT,
    timestamp TIMESTAMP,
    games_count INT,
    category VARCHAR(255),
    FOREIGN KEY (hero_id) REFERENCES heroes(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- Table 10: heroes_combo_data
CREATE TABLE heroes_combo_data (
    id SERIAL PRIMARY KEY,
    hero1_id INT,
    hero2_id INT,
    rating_id INT,
    timestamp TIMESTAMP,
    times_played INT,
    wins_count INT,
    FOREIGN KEY (hero1_id) REFERENCES heroes(id),
    FOREIGN KEY (hero2_id) REFERENCES heroes(id),
    FOREIGN KEY (rating_id) REFERENCES rating_ranges(id)
);
