import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './components/MainPage'
import HeroPopularity from './components/HeroPopularity';
import HeroRecommendation from './components/HeroRecommendation';
import ChatAnalysis from './components/ChatAnalysis'
import ItemsPopularity from './components/ItemsPopularity';
import WinrateAnalysis from './components/WinrateAnalysis';
import axios from 'axios';

const handleButtonClick = (buttonIndex) => {
    console.log('Button clicked:', buttonIndex);
    // You can perform any action here based on the clicked button index
};


function App() {
    const [responseText, setResponseText] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.post('http://localhost:8001/getRandomWord');
            setResponseText(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <Router>
            <div className="container">
                {/* <div> */}
                    <Header/>
                    {/* <h1>Backend Response:</h1>
                    <button onClick={fetchData}>Fetch Data</button>
                    <p>{responseText}</p> */}
                {/* </div> */}
                <main>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/heroRecommendation" element={<HeroRecommendation />} />
                        <Route path="/winrateAnalysis" element={<WinrateAnalysis />} />
                        <Route path="/chatAnalysis" element={<ChatAnalysis />} />
                        <Route path="/heroPopularity" element={<HeroPopularity />} />
                        <Route path="/itemsPopularity" element={<ItemsPopularity />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;


