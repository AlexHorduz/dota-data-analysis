import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
    return (
        <header className="page-header">
            <nav className="nav-container">
                <Link to="/" className="nav-button">Головна сторінка</Link>
                <Link to="/heroRecommendation" className="nav-button">Рекомендації героїв</Link>
                <Link to="/winrateAnalysis" className="nav-button">Аналіз по відсотку перемог</Link>
                <Link to="/chatAnalysis" className="nav-button">Аналіз чату</Link>
                <Link to="/heroPopularity" className="nav-button">Популярність героїв</Link>
                <Link to="/itemsRecommendation" className="nav-button">Рекомендації речей</Link>
            </nav>
        </header>
    );
};

export default Header;
