import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
    return (
        <header className="page-header">
            <nav className="nav-container">
                <Link to="/" className="nav-button">Main page</Link>
                <Link to="/heroRecommendation" className="nav-button">Hero recommendation</Link>
                <Link to="/winrateAnalysis" className="nav-button">Winrate analysis</Link>
                <Link to="/chatAnalysis" className="nav-button">Chat analysis</Link>
                <Link to="/heroPopularity" className="nav-button">Hero popularity</Link>
                <Link to="/itemsPopularity" className="nav-button">Items popularity</Link>
            </nav>
        </header>
    );
};

export default Header;
