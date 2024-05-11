import React, { useState } from 'react';
import axios from 'axios';

const ChatToxicity = () => {
    const [toxicity, setToxicity] = useState([]);
    const [xAxis, setXAxis] = useState({ "names": [], "values": [] });

    const getToxicity = async (event) => {
        let ratingId = event.target.value;
        if (!ratingId) {
            ratingId = null;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getToxicity`, {"rating": ratingId});
            setToxicity(response.data.toxicity);
            setXAxis(response.data.names);
        } catch (error) {
            console.error('Error fetching toxicity:', error);
        }
    };

    return (
        <div>
            <h2> Toxicity </h2>
            <select onChange={getToxicity}>
                <option value="">All ratings</option>
                <option value="10">Rating ID 1</option>
                <option value="20">Rating ID 2</option>
                <option value="30">Rating ID 3</option>
                <option value="40">Rating ID 4</option>
            </select>
            <p> Toxicity: {JSON.stringify(toxicity)} </p>
            <p> xAxis: {JSON.stringify(xAxis)} </p>
        </div>
    );
};

export default ChatToxicity;