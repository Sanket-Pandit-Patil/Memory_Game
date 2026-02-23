import React, { useState, useEffect } from 'react';
import { Target, Clock, Puzzle, Play } from 'lucide-react';
import './SetupScreen.css';

const SetupScreen = ({ onStart }) => {
    const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard'
    const [mediumType, setMediumType] = useState('time'); // 'time' or 'moves'

    const [timeLimit, setTimeLimit] = useState(50);
    const [movesLimit, setMovesLimit] = useState(20);

    // Apply specific user defaults when changing difficulty/type
    useEffect(() => {
        if (difficulty === 'medium') {
            if (mediumType === 'time') {
                setTimeLimit(50);
            } else {
                setMovesLimit(20);
            }
        } else if (difficulty === 'hard') {
            setTimeLimit(35);
            setMovesLimit(15);
        }
    }, [difficulty, mediumType]);

    const handleStart = () => {
        let config = { difficulty };

        if (difficulty === 'medium') {
            if (mediumType === 'time') config.timeLimit = timeLimit;
            else config.movesLimit = movesLimit;
        } else if (difficulty === 'hard') {
            config.timeLimit = timeLimit;
            config.movesLimit = movesLimit;
        }

        onStart(config);
    };

    const getGoalSummary = () => {
        if (difficulty === 'easy') return "Standard practice mode. No limits.";
        if (difficulty === 'medium') {
            return mediumType === 'time'
                ? `Finish under ${timeLimit} seconds`
                : `Finish in ≤ ${movesLimit} moves`;
        }
        return `Finish under ${timeLimit}s AND ≤ ${movesLimit} moves`;
    };

    return (
        <div className="setup-screen">
            <div className="setup-card">
                <header className="setup-header">
                    <h1>Choose Difficulty</h1>
                    <p>Set your challenge and test your memory.</p>
                </header>

                <div className="segmented-control">
                    {['easy', 'medium', 'hard'].map(mode => (
                        <button
                            key={mode}
                            className={`segment-btn ${difficulty === mode ? 'active' : ''}`}
                            onClick={() => setDifficulty(mode)}
                        >
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="difficulty-settings">
                    {difficulty === 'medium' && (
                        <div className="setting-group">
                            <label>Constraint Type</label>
                            <div className="toggle-group">
                                <button
                                    className={`toggle-btn ${mediumType === 'time' ? 'active' : ''}`}
                                    onClick={() => setMediumType('time')}
                                >
                                    <Clock size={16} /> Time
                                </button>
                                <button
                                    className={`toggle-btn ${mediumType === 'moves' ? 'active' : ''}`}
                                    onClick={() => setMediumType('moves')}
                                >
                                    <Puzzle size={16} /> Moves
                                </button>
                            </div>
                        </div>
                    )}

                    {(difficulty === 'hard' || (difficulty === 'medium' && mediumType === 'time')) && (
                        <div className="setting-group">
                            <div className="label-row">
                                <label>Time Limit</label>
                                <span className="current-val">{timeLimit}s</span>
                            </div>
                            <input
                                type="range" min="15" max="120" step="5"
                                value={timeLimit} onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                            />
                        </div>
                    )}

                    {(difficulty === 'hard' || (difficulty === 'medium' && mediumType === 'moves')) && (
                        <div className="setting-group">
                            <div className="label-row">
                                <label>Moves Limit</label>
                                <span className="current-val">{movesLimit}</span>
                            </div>
                            <input
                                type="range" min="10" max="50" step="2"
                                value={movesLimit} onChange={(e) => setMovesLimit(parseInt(e.target.value))}
                            />
                        </div>
                    )}
                </div>

                <div className="goal-preview">
                    <Target size={20} className="goal-icon" />
                    <p>{getGoalSummary()}</p>
                </div>

                <button className="setup-start-btn" onClick={handleStart}>
                    <Play size={20} fill="currentColor" />
                    Start Challenge
                </button>
            </div>
        </div>
    );
};

export default SetupScreen;
