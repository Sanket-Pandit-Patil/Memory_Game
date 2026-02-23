import React from 'react';
import { Play } from 'lucide-react';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onStart }) => {
    return (
        <div className="welcome-screen">
            <div className="welcome-content">
                <p className="welcome-intro">Test your memory and match all pairs of hidden icons!</p>

                <div className="instructions">
                    <h3>How to Play:</h3>
                    <ul>
                        <li>Click a tile to reveal its hidden emoji.</li>
                        <li>Find and click the matching pair.</li>
                        <li>If they match, they stay flipped!</li>
                        <li>If they don't, they'll hide again after a short delay.</li>
                        <li>Match all 8 pairs to win!</li>
                    </ul>
                </div>

                <button className="start-button" onClick={onStart}>
                    <Play size={20} fill="currentColor" />
                    <span>Start Game</span>
                </button>
            </div>
        </div>
    );
};

export default WelcomeScreen;
