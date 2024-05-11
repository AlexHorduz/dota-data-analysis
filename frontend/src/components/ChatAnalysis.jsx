import React, { useState } from 'react';
import ChatToxicity from './ChatToxicity';
import ChatWordsPopularity from './ChatWordsPopularity';
import '../styles/ChatAnalysis.css'

const ChatAnalysis = () => {
    const [toShowToxicity, setToShowToxicity] = useState(false);
    const [toShowWordsPopularity, setToShowWordsPopularity] = useState(false);

    const showToxicity = () => {
        setToShowToxicity(true);
        setToShowWordsPopularity(false);
    };

    const showWordsPopularity = () => {
        setToShowWordsPopularity(true);
        setToShowToxicity(false);
    };

    return (
        <div>
            <h1> Chat analysis </h1>
            <div className='button-container'>
                <div
                    onClick={showToxicity}
                    className={`button ${toShowToxicity ? 'disabled' : ''}`}
                >
                    Show toxicity analysis
                </div>
                <div
                    onClick={showWordsPopularity}
                    className={`button ${toShowWordsPopularity ? 'disabled' : ''}`}
                >
                    Show words popularity
                </div>
            </div>

            {(toShowToxicity || toShowWordsPopularity) && (
                <div>
                    {toShowToxicity && <ChatToxicity />}
                    {toShowWordsPopularity && <ChatWordsPopularity />}
                </div>
            )}
        </div>
    );
};

export default ChatAnalysis;