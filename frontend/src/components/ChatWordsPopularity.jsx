import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import ReactWordcloud from 'react-wordcloud';


const ratingMapping = {}
for (let i = 1; i < 9; i++) {
    ratingMapping[i] = `${i * 300} - ${(i + 1) * 300}`
}

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
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getWordsPopularity`, { "rating": parseInt(ratingId) });
            console.log(response.data)
            setCloudData(response.data.slice(0, 60).map((pair) => ({
                text: pair[0],
                value: pair[1]
            })))

            let normalized_y = response.data.map((pair) => pair[1]);

            const sum = normalized_y.reduce((acc, num) => acc + num, 0);

            normalized_y = normalized_y.map(num => num / sum * 100);

            const to_take = 30;
            let updatedPlotData = { ...plotData }
            updatedPlotData.y = response.data.map((pair) => pair[0]).slice(0, to_take).reverse();
            updatedPlotData.x = normalized_y.slice(0, to_take).reverse();
            setPlotData(updatedPlotData);
            setPlotData(updatedPlotData);

        } catch (error) {
            console.error('Error fetching words popularity:', error);
        }
    };

    // const [options, setOptions] = useState({});


    const [options, setOptions] = useState({
        colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
        enableTooltip: true,
        deterministic: false,
        fontFamily: "impact",
        fontSizes: [5, 60],
        fontStyle: "normal",
        fontWeight: "normal",
        padding: 1,
        rotations: 3,
        rotationAngles: [0, 45, 90],
        scale: "sqrt",
        spiral: "archimedean",
        transitionDuration: 400
    });

    return (
        <div>
            <h2> Popularity </h2>
            <select class="rating-dropdown" onChange={updateWordsPopularityData}>
                <option value="default">Select the rating ranges</option>
                <option value="">All ratings</option>
                {Object.keys(ratingMapping).map(key => (
                    <option value={key}>{ratingMapping[key]}</option>
                ))}
            </select>
            <br />
            <div style={{ display: 'flex' }}>
                <div style={{ flex: '50%' }}>
                    <div style={{ height: 400, width: 600 }}>
                        <ReactWordcloud
                            words={cloudData}
                            options={options}
                        />
                    </div>
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