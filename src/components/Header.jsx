import React from 'react';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import './Header.css';

const Header = ({ moves, seconds, config, isDarkMode, isMuted, toggleTheme, toggleMute, restartGame }) => {
    const { timeLimit = 0, movesLimit = 0 } = config || {};

    // Warning at 80% limit
    const isTimeWarning = timeLimit && seconds >= timeLimit * 0.8;
    const isMovesWarning = movesLimit && moves >= movesLimit * 0.8;

    return (
        <header className="game-header">
            <div className="brand-section">
                <h1>Brainy Flip</h1>
                <p className="subtitle">Match all pairs to win</p>
            </div>

            <div className="stats-section">
                <div className={`stat-card ${isMovesWarning ? 'warning pulse' : ''}`}>
                    <span className="stat-label">{movesLimit ? 'Remaining' : 'Moves'}</span>
                    <span className="stat-value">{movesLimit ? Math.max(0, movesLimit - moves) : moves}</span>
                </div>
                <div className={`stat-card ${isTimeWarning ? 'warning pulse' : ''}`}>
                    <span className="stat-label">{timeLimit ? 'Remaining' : 'Time'}</span>
                    <span className="stat-value">{timeLimit ? Math.max(0, timeLimit - seconds) : seconds}s</span>
                </div>
            </div>

            <div className="actions-section">
                <button onClick={toggleMute} className="icon-button" title={isMuted ? "Unmute" : "Mute"}>
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <button onClick={restartGame} className="icon-button" title="Restart Game">
                    <RotateCcw size={20} />
                </button>
            </div>
        </header>
    );
};

export default Header;
