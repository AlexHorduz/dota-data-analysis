import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';


const ratingMapping = {}

for (let i = 1; i < 9; i++) {
    ratingMapping[i] = `${i * 300} - ${(i + 1) * 300}`
}

const ChatToxicity = () => {
    const [plot1Data, setPlot1Data] = useState({
        x: [],
        y: [],
        type: "scatter",
        mode: "lines+markers"
    })

    const additionalPlot1Data = {
        title: "Токсичність чату в залежності від часу",
        xName: "Час",
        yName: "Відсоток токсичності, %"
    }

    const [plot2Data, setPlot2Data] = useState({
        x: [],
        y: [],
        type: "",
        mode: ""
    })

    const additionalPlot2Data = {
        title: "Поточна токсичність чату в залежності від рейтингу",
        xName: "Рейтинг",
        yName: "Відсоток токсичності, %"
    }

    const getPlot2Data = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getToxicityOverRating`);
            let updatedPlotData = {
                x: [],
                y: [],
                type: "scatter",
                mode: "lines+markers"
            }

            updatedPlotData.x = response.data.map((pair) => pair[0])
                .map((rating_id) => ratingMapping[rating_id]);
            updatedPlotData.y = response.data.map((pair) => pair[1])

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
            console.log(response.data)
            let updatedPlotData = { ...plot1Data };

            updatedPlotData.x = response.data.map((pair) => pair[0]);
            updatedPlotData.y = response.data.map((pair) => pair[1]);

            setPlot1Data(updatedPlotData);
        } catch (error) {
            console.error('Error fetching toxicity:', error);
        }
    };

    return (
        <div>
            <h2> Токсичність чату </h2>
            <select className="rating-dropdown" onChange={updatePlot1Data}>
                <option value="default">Виберіть діапазон рейтингу</option>
                <option value="">Весь рейтинг</option>
                {Object.keys(ratingMapping).map(key => (
                    <option value={key}>{ratingMapping[key]}</option>
                ))}
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