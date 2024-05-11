import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const ChatToxicity = () => {
    const [plotData, setPlotData] = useState({
        x: [],
        y: [],
        type: "",
        mode: ""
    })

    // Data passed not through Plot data property
    const [additionalPlotData, setAdditionalPlotData] = useState({
        title: "Chat toxicity over time",
        xName: "Time",
        yName: "Toxicity rate"
    })

    const updateToxicityData = async (event) => {
        let ratingId = event.target.value;
        if (ratingId == "default") {
            return;
        }

        if (!ratingId) {
            ratingId = null;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getToxicity`, { "rating": ratingId });
            let updatedPlotData = {
                x: response.data.names,
                y: response.data.toxicity,
                type: "scatter",
                mode: "lines+markers"
            }
            setPlotData(updatedPlotData);

            let updatedAdditionalPlotData = { ...additionalPlotData };
            if (ratingId) {
                updatedAdditionalPlotData = {
                    title: "Chat toxicity over time",
                    xName: "Time",
                    yName: "Toxicity rate"
                }
            } else {
                updatedAdditionalPlotData = {
                    title: "Chat toxicity over different rating",
                    xName: "Rating",
                    yName: "Toxicity rate"
                }
            }
            setAdditionalPlotData(updatedAdditionalPlotData);
        } catch (error) {
            console.error('Error fetching toxicity:', error);
        }
    };
    // TODO add mandatory plot toxicity~rating (maybe make the user set the date ranges)
    // TODO add the datetime for the mentioned plot (in the title)
    // TODO move the current plot below
    return (
        <div>
            <h2> Toxicity </h2>
            <select onChange={updateToxicityData}>
                <option value="default">Select  the rating ranges</option>
                <option value="">All ratings</option>
                <option value="10">Rating ID 1</option>
                <option value="20">Rating ID 2</option>
                <option value="30">Rating ID 3</option>
                <option value="40">Rating ID 4</option>
            </select>
            <br />
            <Plot
                data={[plotData]}
                layout={{
                    width: 600,
                    height: 400,
                    title: additionalPlotData.title,
                    xaxis: { title: additionalPlotData.xName },
                    yaxis: { title: additionalPlotData.yName }
                }}
            />
        </div>
    );
};

export default ChatToxicity;