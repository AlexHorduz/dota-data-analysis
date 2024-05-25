import React, { useState } from 'react';
import heroes_raw_data from '../constants/heroes.json'
import '../styles/HeroPopularity.css'
import Plot from 'react-plotly.js';
import axios from 'axios';

const ratingMapping = {}
for (let i = 1; i < 9; i++) {
    ratingMapping[i] = `${i * 300} - ${(i + 1) * 300}`
}


let heroes_data = {};
for (const key in heroes_raw_data) {
    heroes_data[heroes_raw_data[key].id] = {
        "name": heroes_raw_data[key].localized_name,
        "image": "https://cdn.cloudflare.steamstatic.com" + heroes_raw_data[key].img,
    }
}

const HeroPopularity = () => {
    const [plotData, setPlotData] = useState({
        x: [],
        y: [],
        type: "bar",
        marker: { color: 'rgb(123, 163, 237)' },
        mode: ""
    })

    const [additionalPlotData, setAdditionalPlotData] = useState({
        title: "Найпопулярніші герої",
        xName: "Герой",
        yName: "Кількість ігор"
    })

    const updatePlotData = async (event) => {
        let ratingId = event.target.value;
        if (ratingId === "default") {
            return;
        }

        if (!ratingId) {
            ratingId = null;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getHeroesPopularity`, { "rating": ratingId });
            console.log("response", response.data)
            let updatedPlotData = { ...plotData };
            let heroStats = {};

            response.data.forEach(item => {
                if (heroStats.hasOwnProperty(item.hero_id)) {
                    heroStats[item.hero_id] += item.times_played;
                } else {
                    heroStats[item.hero_id] = item.times_played;
                }
            });

            heroStats = Object.entries(heroStats).sort((a, b) => b[1] - a[1]);

            heroStats = heroStats.slice(0, 20);

            const X = [];
            const Y = [];
            heroStats.forEach(hero => {
                X.push(hero[0].toString());
                Y.push(hero[1]);
            });
            console.log("X", X)
            updatedPlotData.x = X.map((id) => (
                heroes_data[id].name
            ));
            updatedPlotData.y = Y

            setPlotData(updatedPlotData);
            console.log("Updated", updatedPlotData)
            console.log("Current", plotData)

            let updatedAdditionalPlotData = { ...additionalPlotData };
            updatedAdditionalPlotData.tickvals = X
            updatedAdditionalPlotData.ticktext = X.map((id) => (
                heroes_data[id].name
            ));


            setAdditionalPlotData(updatedAdditionalPlotData);
        } catch (error) {
            console.error('Error fetching hero popularity:', error);
        }
    };

    return (
        <div>
            <h1> Популярність героїв </h1>
            <select className="rating-dropdown" onChange={updatePlotData}>
                <option value="default">Виберіть діапазон рейтингу</option>
                <option value="">Весь рейтинг</option>
                {Object.keys(ratingMapping).map(key => (
                    <option value={key}>{ratingMapping[key]}</option>
                ))}
            </select>
            <br />
            <Plot
                data={[plotData]}
                layout={{
                    width: '100%',
                    height: 800,
                    title: additionalPlotData.title,
                    xaxis: {
                        title: additionalPlotData.xName,
                        tickangle: 45,
                        automargin: true
                    },
                    yaxis: {
                        title: additionalPlotData.yName
                    },
                }}
            />
        </div>
    );
};

export default HeroPopularity;