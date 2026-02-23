import React from 'react';
import { Trophy, RotateCcw } from 'lucide-react';
import './WinScreen.css';

const WinScreen = ({ moves, seconds, onRestart }) => {
    return (
        <div className="win-screen">
            <div className="win-content">
                <div className="trophy-container">
                    <Trophy size={64} color="#fbbf24" fill="#fbbf24" />
                </div>
                <h1>Congratulations!</h1>
                <p>You've cleared the board in {moves} moves.</p>

                <div className="final-stats">
                    <div className="final-stat">
                        <span className="label">Time Taken</span>
                        <span className="value">{seconds}s</span>
                    </div>
                    <div className="final-stat">
                        <span className="label">Total Moves</span>
                        <span className="value">{moves}</span>
                    </div>
                </div>

                <button className="restart-button" onClick={onRestart}>
                    <RotateCcw size={20} />
                    <span>Play Again</span>
                </button>
            </div>
        </div>
    );
};

export default WinScreen;
