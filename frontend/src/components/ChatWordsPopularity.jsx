import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import ReactWordcloud from 'react-wordcloud';

const ChatWordsPopularity = () => {
    const [cloudData, setCloudData] = useState([]);


    const [plotData, setPlotData] = useState({
        x: [],
        y: [],
        type: "bar",
        mode: "",
        marker: { color: 'rgb(240, 167, 125)' },
        orientation: 'h'
    })

    // Data passed not through Plot data property
    const [additionalPlotData, setAdditionalPlotData] = useState({
        title: "Words normalized usage count",
        yName: "",
        xName: "Percentage of usage"
    })

    const updateWordsPopularityData = async (event) => {
        let ratingId = event.target.value;
        if (!ratingId) {
            ratingId = null;
        }
        if (ratingId === "default") {
            return;
        }

        try {
            let params = {}
            if (ratingId === null) {
                params = {
                    "rating": ratingId
                }
            }
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/getWordsPopularity`,
                {
                    "params": params
                });

            setCloudData(response.data.slice(0, 50).map((pair) => ({
                text: pair[0],
                value: pair[1]
            })))

            let normalized_y = response.data.map((pair) => pair[1]);

            const sum = normalized_y.reduce((acc, num) => acc + num, 0);

            // Divide each number by the sum
            normalized_y = normalized_y.map(num => num / sum * 100);

            const to_take = 30;
            let updatedPlotData = { ...plotData }
            updatedPlotData.y = response.data.map((pair) => pair[0]).slice(0, to_take).reverse();
            updatedPlotData.x = normalized_y.slice(0, to_take).reverse();
            console.log(updatedPlotData);
            setPlotData(updatedPlotData);

        } catch (error) {
            console.error('Error fetching words popularity:', error);
        }
    };


    return (
        <div>
            <h2> Popularity </h2>
            <select class="rating-dropdown" onChange={updateWordsPopularityData}>
                <option value="default">Select  the rating ranges</option>
                <option value="">All ratings</option>
                <option value="10">Rating ID 1</option>
                <option value="20">Rating ID 2</option>
                <option value="30">Rating ID 3</option>
                <option value="40">Rating ID 4</option>
            </select>
            <br />
            <div style={{ display: 'flex' }}>
                <div style={{ flex: '50%' }}>
                    <ReactWordcloud
                        size={[600, 400]}
                        words={cloudData}
                        style={{ fontFamily: 'Arial', color: 'blue' }}
                        options={{
                            rotations: 2,
                            rotationAngles: [-30, 0],
                            transitionDuration: 50
                        }}
                    />
                </div>
                <div style={{ flex: '50%' }}>
                    <Plot
                        data={[plotData]}
                        layout={{
                            width: "100%",
                            height: 800,
                            title: additionalPlotData.title,
                            xaxis: { title: additionalPlotData.xName, automargin: true },
                            yaxis: { title: additionalPlotData.yName, automargin: true }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatWordsPopularity;