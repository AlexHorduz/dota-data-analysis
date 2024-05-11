import React, { useState } from 'react';
import axios from 'axios';

const ChatWordsPopularity = () => {
    const [wordsPopularity, setWordsPopularity] = useState([]);

    const getWordsPopularity = async (event) => {
        let ratingId = event.target.value;
        if (!ratingId) {
            ratingId = null;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getWordsPopularity`, { "rating": ratingId });
            setWordsPopularity(response.data);
            console.log(wordsPopularity);
        } catch (error) {
            console.error('Error fetching words popularity:', error);
        }
    };


    return (
        <div>
            <h2> Popularity </h2>
            <select onChange={getWordsPopularity}>
                <option value="">All ratings</option>
                <option value="10">Rating ID 1</option>
                <option value="20">Rating ID 2</option>
                <option value="30">Rating ID 3</option>
                <option value="40">Rating ID 4</option>
            </select>
            <p> Sorted Words Popularity: {JSON.stringify(wordsPopularity)} </p>
        </div>
    );
};

export default ChatWordsPopularity;