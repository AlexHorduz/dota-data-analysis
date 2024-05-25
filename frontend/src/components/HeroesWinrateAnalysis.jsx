import React, { useState } from 'react';
import heroes_raw_data from '../constants/heroes.json'
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

const HeroesWinrateAnalysis = () => {
    const [plotData, setPlotData] = useState({
        x: [],
        y: [],
        text: [],
        marker: {
            color: 'rgb(53, 219, 75)',
            size: []
        },
        mode: "markers"
    })

    const [additionalPlotData, setAdditionalPlotData] = useState({
        title: "Герої з найбільшим відсотком перемог",
        xName: "Герой",
        yName: "Відсоток перемог"
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
            let max_times_played = 0;
            response.data.forEach(item => {
                if (heroStats.hasOwnProperty(item.hero_id)) {
                    heroStats[item.hero_id][0] += item.times_played;
                    heroStats[item.hero_id][1] += item.wins_count;
                } else {
                    heroStats[item.hero_id] = [item.times_played, item.wins_count]
                }
                
            });



            heroStats = Object.entries(heroStats).sort((a, b) => (b[1][1] / b[1][0]) - (a[1][1] / a[1][0]));

            heroStats = heroStats.slice(0, 20);

            heroStats.forEach(heroes => {
                if (heroes[1][0] > max_times_played) {
                    max_times_played = heroes[1][0];
                }
            });

            console.log(heroStats);

            const X = [];
            const Y = [];
            const marker_size = [];
            const text = [];
            heroStats.forEach(hero => {
                X.push(hero[0].toString());
                Y.push((hero[1][1] / hero[1][0]));
                marker_size.push(hero[1][0] / max_times_played * 50);
                text.push(`Times played: ${hero[1][0]}`);
            });
            console.log(max_times_played);
            console.log("Hero stats", heroStats);
            console.log("X", X);
            console.log("marker_size", marker_size);
            updatedPlotData.x = X.map((id) => (
                heroes_data[id].name
            ));
            updatedPlotData.y = Y
            updatedPlotData.marker.size = marker_size;
            updatedPlotData.text = text;

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
            console.error('Error fetching hero winrate data:', error);
        }
    };

    return (
        <div>
            <h2> Герої </h2>
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

export default HeroesWinrateAnalysis;