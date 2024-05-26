import React, { useState } from 'react';
import heroes_raw_data from '../constants/heroes.json'
import axios from 'axios';
import '../styles/HeroRecommendation.css'

let heroes_data = {};
for (const key in heroes_raw_data) {
    heroes_data[heroes_raw_data[key].id] = {
        "name": heroes_raw_data[key].localized_name,
        "image": "https://cdn.cloudflare.steamstatic.com/" + heroes_raw_data[key].img,
    }
}

const HeroRecommendation = () => {
    const [gamesPlayed, setGamesPlayed] = useState({});
    const [recommendations, setRecommendations] = useState([])

    const handleChange = (heroId, value) => {
        let gamesPlayedCopy = { ...gamesPlayed, [heroId]: value };
        if (value == 0) {
            delete gamesPlayedCopy[heroId];
        }
        setGamesPlayed(gamesPlayedCopy);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Games Played:', gamesPlayed);
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getHeroesRecommendation`, { "games_played": gamesPlayed, "N": 3 });
        console.log("Backend response", response.data);
        setRecommendations(response.data);
    };

    return (
        <div>
            <h1> Рекомендації героїв </h1>
            <form>
                <div className="hero-grid">
                    {recommendations.map((id) => (
                        <div className="hero-item">
                            <img src={heroes_data[id].image} alt={heroes_data[id].name} />
                            <p>{heroes_data[id].name}</p>
                        </div>
                    ))}
                </div>
                {(recommendations.length != 0) &&
                    <p>Перейдіть на сторінку "Рекомендації речей", щоб дізнатись, з якими речами краще грати на цих героях</p>
                }
                <div className="submit-button" onClick={handleSubmit}>Отримати рекомендації</div>
                <p className="instructions">Введіть кількість зіграних ігор на кожному з героїв</p>
                <div className="hero-grid">
                    {Object.keys(heroes_data).map((id) => (
                        <div key={id} className="hero-item">
                            <img src={heroes_data[id].image} alt={heroes_data[id].name} />
                            <p>{heroes_data[id].name}</p>
                            <input
                                type="number"
                                value={gamesPlayed[id] || 0}
                                onChange={(e) => handleChange(id, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </form >
        </div >
    );
};

export default HeroRecommendation;