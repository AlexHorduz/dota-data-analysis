import React, { useState } from 'react';
import HeroesWinrateAnalysis from './HeroesWinrateAnalysis';
import HeroesComboWinrateAnalysis from './HeroesComboWinrateAnalysis';
import '../styles/DivButtons.css'

const WinrateAnalysis = () => {
    const [toShowHeroesWinrate, setToShowHeroesWinrate] = useState(false)
    const [toShowHeroesComboWinrate, setToShowHeroesComboWinrate] = useState(false)

    const showHeroesWinrate = () => {
        setToShowHeroesWinrate(true);
        setToShowHeroesComboWinrate(false);
    }

    const showHeroesComboWinrate = () => {
        setToShowHeroesWinrate(false);
        setToShowHeroesComboWinrate(true);
    }


    return (
        <div>
            <h1> Аналіз популярності героїв по відсотку перемог </h1>
            <div className='button-container'>
                <div
                    onClick={showHeroesWinrate}
                    className={`button ${toShowHeroesWinrate ? 'disabled' : ''}`}
                >
                    Показати аналіз героїв
                </div>
                <div
                    onClick={showHeroesComboWinrate}
                    className={`button ${toShowHeroesComboWinrate ? 'disabled' : ''}`}
                >
                    Показати аналіз комбінацій героїв
                </div>
            </div>

            {(toShowHeroesWinrate || toShowHeroesComboWinrate) && (
                <div>
                    {toShowHeroesWinrate && <HeroesWinrateAnalysis />}
                    {toShowHeroesComboWinrate && <HeroesComboWinrateAnalysis />}
                </div>
            )}
        </div>
    );
};

export default WinrateAnalysis;