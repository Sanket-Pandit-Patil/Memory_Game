import React from 'react';
import { Sun, Moon, RotateCcw } from 'lucide-react';
import './Header.css';

const Header = ({ moves, seconds, isDarkMode, toggleTheme, restartGame }) => {
    return (
        <header className="game-header">
            <div className="brand-section">
                <h1>Brainy Flip</h1>
                <p className="subtitle">Match all pairs to win</p>
            </div>

            <div className="stats-section">
                <div className="stat-card">
                    <span className="stat-label">Moves</span>
                    <span className="stat-value">{moves}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Time</span>
                    <span className="stat-value">{seconds}s</span>
                </div>
            </div>

            <div className="actions-section">
                <button onClick={restartGame} className="icon-button" title="Restart Game">
                    <RotateCcw size={20} />
                </button>
                <button onClick={toggleTheme} className="icon-button" title="Toggle Theme">
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
};

export default Header;
