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
        title: "Most popular heroes",
        xName: "Hero",
        yName: "Games"
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

            // Step 4: Extract hero_id and times_played for top 20 heroes
            const X = [];
            const Y = [];
            heroStats.forEach(hero => {
                X.push(hero[0].toString());
                Y.push(hero[1]);
            });
            console.log("X", X)
            updatedPlotData.x = X.map((id) => (
                // `<img src="${heroes_data[id].image}" />`
                heroes_data[id].name
            ));
            updatedPlotData.y = Y

            setPlotData(updatedPlotData);
            console.log("Updated", updatedPlotData)
            console.log("Current", plotData)

            let updatedAdditionalPlotData = { ...additionalPlotData };
            updatedAdditionalPlotData.tickvals = X
            updatedAdditionalPlotData.ticktext = X.map((id) => (
                // `<img src="${heroes_data[id].image}" />`
                heroes_data[id].name
            ));
            // console.log(updatedAdditionalPlotData)


            setAdditionalPlotData(updatedAdditionalPlotData);
        } catch (error) {
            console.error('Error fetching toxicity:', error);
        }
    };

    return (
        <div>
            <h1> Popular heroes </h1>
            <select className="rating-dropdown" onChange={updatePlotData}>
                <option value="default">Select the rating ranges</option>
                <option value="">All ratings</option>
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