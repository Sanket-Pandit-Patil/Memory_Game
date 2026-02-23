import React, { useState, useEffect } from 'react';
import { Target, Clock, Puzzle, Play } from 'lucide-react';
import './SetupScreen.css';

const SetupScreen = ({ onStart }) => {
    const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard'
    const [mediumType, setMediumType] = useState('time'); // 'time' or 'moves'

    // Hardcoded values as requested
    const [timeLimit, setTimeLimit] = useState(50);
    const [movesLimit, setMovesLimit] = useState(20);

    // Sync fixed values when selection changes
    useEffect(() => {
        if (difficulty === 'medium') {
            if (mediumType === 'time') {
                setTimeLimit(50);
                setMovesLimit(null);
            } else {
                setMovesLimit(20);
                setTimeLimit(null);
            }
        } else if (difficulty === 'hard') {
            setTimeLimit(35);
            setMovesLimit(15);
        } else {
            setTimeLimit(null);
            setMovesLimit(null);
        }
    }, [difficulty, mediumType]);

    const handleStart = () => {
        onStart({ difficulty, timeLimit, movesLimit });
    };

    const getGoalSummary = () => {
        if (difficulty === 'easy') return "Standard practice mode. No limits.";
        if (difficulty === 'medium') {
            return mediumType === 'time'
                ? `Finish under 50 seconds`
                : `Finish in ≤ 20 moves`;
        }
        return `Finish under 35s AND ≤ 15 moves`;
    };

    return (
        <div className="setup-screen">
            <div className="setup-card">
                <header className="setup-header">
                    <h1>Choose Difficulty</h1>
                    <p>Select your challenge level.</p>
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

                    {difficulty !== 'easy' && (
                        <div className="fixed-goals">
                            {difficulty === 'hard' ? (
                                <>
                                    <div className="goal-tag"><Clock size={14} /> 35 Seconds</div>
                                    <div className="goal-tag"><Puzzle size={14} /> 15 Moves</div>
                                </>
                            ) : (
                                <div className="goal-tag">
                                    {mediumType === 'time' ? <><Clock size={14} /> 50 Seconds</> : <><Puzzle size={14} /> 20 Moves</>}
                                </div>
                            )}
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
