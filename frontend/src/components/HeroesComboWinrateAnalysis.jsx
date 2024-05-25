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

const HeroesComboWinrateAnalysis = () => {
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
        title: "Комбінації героїв з найбільшим відсотком перемог",
        xName: "Комбінації героїв",
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
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getHeroesComboPopularity`, { "rating": ratingId });
            console.log("response", response.data)
            let updatedPlotData = { ...plotData };
            let heroStats = {};
            let max_times_played = 0;
            response.data.forEach(item => {
                let key = `${item.hero1_id}_${item.hero2_id}`;
                if (heroStats.hasOwnProperty(key)) {
                    heroStats[key][0] += item.times_played;
                    heroStats[key][1] += item.wins_count;
                } else {
                    heroStats[key] = [item.times_played, item.wins_count]
                }
            });


            console.log("Hero stats raw", heroStats);
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
            heroStats.forEach(heroes => {
                let hero1 = heroes[0].split("_")[0];
                let hero2 = heroes[0].split("_")[1];
                X.push([hero1, hero2]);
                Y.push((heroes[1][1] / heroes[1][0]));
                marker_size.push(heroes[1][0] / max_times_played * 50);
                text.push(`Times played: ${heroes[1][0]}`);
            });
            console.log(max_times_played);
            console.log("Hero stats", heroStats);
            console.log("X", X);
            console.log("marker_size", marker_size);
            updatedPlotData.x = X.map((ids) => (
                heroes_data[ids[0]].name + " + " + heroes_data[ids[1]].name
            ));
            updatedPlotData.y = Y
            updatedPlotData.marker.size = marker_size;
            updatedPlotData.text = text;

            setPlotData(updatedPlotData);
            console.log("Updated", updatedPlotData)
            console.log("Current", plotData)
            
            let updatedAdditionalPlotData = { ...additionalPlotData };
            updatedAdditionalPlotData.tickvals = X
            updatedAdditionalPlotData.ticktext = X.map((ids) => (
                heroes_data[ids[0]].name + " + " + heroes_data[ids[1]].name
            ));


            setAdditionalPlotData(updatedAdditionalPlotData);
        } catch (error) {
            console.error('Error fetching heroes combo winrate data:', error);
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

export default HeroesComboWinrateAnalysis;