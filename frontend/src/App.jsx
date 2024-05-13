import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import MainPage from './components/MainPage'
import HeroPopularity from './components/HeroPopularity';
import HeroRecommendation from './components/HeroRecommendation';
import ChatAnalysis from './components/ChatAnalysis'
import ItemsRecommendation from './components/ItemsRecommendation';
import WinrateAnalysis from './components/WinrateAnalysis';

function App() {
    return (
        <Router>
            <div className="container">
                <Header/>
                <main>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/heroRecommendation" element={<HeroRecommendation />} />
                        <Route path="/winrateAnalysis" element={<WinrateAnalysis />} />
                        <Route path="/chatAnalysis" element={<ChatAnalysis />} />
                        <Route path="/heroPopularity" element={<HeroPopularity />} />
                        <Route path="/itemsRecommendation" element={<ItemsRecommendation />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;


