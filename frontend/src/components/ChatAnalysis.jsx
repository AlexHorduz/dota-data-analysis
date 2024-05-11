import React, { useState } from 'react';
import ChatToxicity from './ChatToxicity';
import ChatWordsPopularity from './ChatWordsPopularity';


const ChatAnalysis = () => {
    const [toShowToxicity, setToShowToxicity] = useState(false);
    const [toShowWordsPopularity, setToShowWordsPopularity] = useState(false);

    const showToxicity = () => {
        setToShowToxicity(true);
    };

    const showWordsPopularity = () => {
        setToShowWordsPopularity(true);
    };

    const handleBack = () => {
        setToShowToxicity(false);
        setToShowWordsPopularity(false);
    };

    return (
        <div>
            <p> Chat analysis </p>
            {!toShowToxicity && !toShowWordsPopularity && (
                <div>
                    <button onClick={showToxicity}>Show toxicity analysis</button>
                    <button onClick={showWordsPopularity}>Show words popularity</button>
                </div>
            )}

            {(toShowToxicity || toShowWordsPopularity) && (
                <div>
                    <button onClick={handleBack}>Back</button>
                    {toShowToxicity && <ChatToxicity />}
                    {toShowWordsPopularity && <ChatWordsPopularity />}
                </div>
            )}
        </div>
    );
};

export default ChatAnalysis;