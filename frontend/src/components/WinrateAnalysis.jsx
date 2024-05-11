import React, { useState } from 'react';
import ItemsWinrateAnalysis from './ItemsWinrateAnalysis';
import HeroesWinrateAnalysis from './HeroesWinrateAnalysis';
import HeroesComboWinrateAnalysis from './HeroesComboWinrateAnalysis';
import '../styles/DivButtons.css'

const WinrateAnalysis = () => {
    const [toShowItemsWinrate, setToShowItemsWinrate] = useState(false)
    const [toShowHeroesWinrate, setToShowHeroesWinrate] = useState(false)
    const [toShowHeroesComboWinrate, setToShowHeroesComboWinrate] = useState(false)

    const showItemsWinrate = () => {
        setToShowItemsWinrate(true);
        setToShowHeroesWinrate(false);
        setToShowHeroesComboWinrate(false);
    }

    const showHeroesWinrate = () => {
        setToShowItemsWinrate(false);
        setToShowHeroesWinrate(true);
        setToShowHeroesComboWinrate(false);
    }

    const showHeroesComboWinrate = () => {
        setToShowItemsWinrate(false);
        setToShowHeroesWinrate(false);
        setToShowHeroesComboWinrate(true);
    }


    return (
        <div>
            <h1> Winrate analysis </h1>
            <div className='button-container'>
                <div
                    onClick={showItemsWinrate}
                    className={`button ${toShowItemsWinrate ? 'disabled' : ''}`}
                >
                    Show items winrate analysis
                </div>
                <div
                    onClick={showHeroesWinrate}
                    className={`button ${toShowHeroesWinrate ? 'disabled' : ''}`}
                >
                    Show heroes winrate analysis
                </div>
                <div
                    onClick={showHeroesComboWinrate}
                    className={`button ${toShowHeroesComboWinrate ? 'disabled' : ''}`}
                >
                    Show heroes combinations winrate analysis
                </div>
            </div>

            {(toShowItemsWinrate || toShowHeroesWinrate || toShowHeroesComboWinrate) && (
                <div>
                    {toShowItemsWinrate && <ItemsWinrateAnalysis />}
                    {toShowHeroesWinrate && <HeroesWinrateAnalysis />}
                    {toShowHeroesComboWinrate && <HeroesComboWinrateAnalysis />}
                </div>
            )}
        </div>
    );
};

export default WinrateAnalysis;