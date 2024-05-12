import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const ChatToxicity = () => {
    const [plot1Data, setPlot1Data] = useState({
        x: [],
        y: [],
        type: "",
        mode: ""
    })

    const additionalPlot1Data = {
        title: "Chat toxicity over time",
        xName: "Time",
        yName: "Toxicity rate"
    }
    
    const [plot2Data, setPlot2Data] = useState({
        x: [],
        y: [],
        type: "",
        mode: ""
    })

    const additionalPlot2Data = {
        title: "Current chat toxicity over different rating",
        xName: "Rating",
        yName: "Toxicity rate"
    }

    const getPlot2Data = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getToxicityOverRating`);
            let updatedPlotData = {
                x: response.data.names,
                y: response.data.toxicity,
                type: "scatter",
                mode: "lines+markers"
            }
            setPlot2Data(updatedPlotData);
        } catch (error) {
            console.error('Error fetching toxicity:', error);
        }
    }

    useEffect(() => {
        getPlot2Data();
    }, []);


    

    const updatePlot1Data = async (event) => {
        let ratingId = event.target.value;
        if (ratingId === "default") {
            return;
        }

        if (!ratingId) {
            ratingId = null;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getToxicityOverTime`, { "rating": ratingId });
            let updatedPlotData = {
                x: response.data.names,
                y: response.data.toxicity,
                type: "scatter",
                mode: "lines+markers"
            }
            setPlot1Data(updatedPlotData);
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
            <select onChange={updatePlot1Data}>
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
                    <Plot
                        data={[plot1Data]}
                        layout={{
                            width: '100%',
                            height: 800,
                            title: additionalPlot1Data.title,
                            xaxis: { title: additionalPlot1Data.xName },
                            yaxis: { title: additionalPlot1Data.yName }
                        }}
                    />
                </div>
                <div style={{ flex: '50%' }}>
                    <Plot
                        data={[plot2Data]}
                        layout={{
                            width: '100%',
                            height: 800,
                            title: additionalPlot2Data.title,
                            xaxis: { title: additionalPlot2Data.xName },
                            yaxis: { title: additionalPlot2Data.yName }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatToxicity;