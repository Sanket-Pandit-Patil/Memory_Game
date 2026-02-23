import React, { useMemo } from 'react';
import { Trophy, XCircle, RotateCcw, Settings, Play } from 'lucide-react';
import './ResultScreen.css';

const ResultScreen = ({ result, stats, onRestart, onChangeDifficulty, onPractice }) => {
    if (!result) return null;
    const { isWin, cause } = result;
    const { moves, seconds, totalMoves, totalTime, accuracy, streakContent, difficulty } = stats;

    const performance = useMemo(() => {
        if (!isWin) {
            if (stats.matches >= 6) return { msg: "Almost There 🚀", type: "amber" };
            if (stats.matches >= 3) return { msg: "Good Progress 💪", type: "blue" };
            return { msg: "Warm Up Again 🔁", type: "gray" };
        }
        if (accuracy >= 80) return { msg: "Memory Master 🧠", type: "gold" };
        if (accuracy >= 60) return { msg: "Sharp Thinker ⚡", type: "blue" };
        return { msg: "Keep Practicing 🎯", type: "gray" };
    }, [isWin, accuracy, stats.matches]);

    return (
        <div className="result-screen">
            <div className={`result-card ${!isWin ? 'fail' : ''}`}>
                <div className="status-badge">
                    {isWin ? <Trophy size={48} className="icon-gold" /> : <XCircle size={48} className="icon-red" />}
                </div>

                <h1>{isWin ? (cause === 'perfect' ? 'Perfect Clear! ✨' : 'Challenge Clear!') : (cause === 'time' ? "Time's Up ⏳" : "Out of Moves 🧩")}</h1>
                <p className={`performance-msg ${performance.type}`}>{performance.msg}</p>

                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="label">Accuracy</span>
                        <span className="value">{accuracy}%</span>
                    </div>
                    <div className="stat-item">
                        <span className="label">Best Streak</span>
                        <span className="value">{stats.maxStreak}</span>
                    </div>
                    <div className="stat-item">
                        <span className="label">Time Used</span>
                        <span className="value">{seconds}s {totalTime ? `/ ${totalTime}s` : ''}</span>
                    </div>
                    <div className="stat-item">
                        <span className="label">Moves Used</span>
                        <span className="value">{moves} {totalMoves ? `/ ${totalMoves}` : ''}</span>
                    </div>
                </div>

                <div className="result-actions">
                    <button className="btn-primary" onClick={onRestart}>
                        <RotateCcw size={18} /> Try Again
                    </button>
                    <button className="btn-secondary" onClick={onChangeDifficulty}>
                        <Settings size={18} /> Change Difficulty
                    </button>
                    {!isWin && (
                        <button className="btn-ghost" onClick={onPractice}>
                            <Play size={18} /> Practice Mode
                        </button>
                    )}
                </div>

                {isWin && accuracy < 60 && (
                    <p className="tip-line text-secondary">Tip: Try to take your time and focus on patterns to improve accuracy!</p>
                )}
            </div>
        </div>
    );
};

export default ResultScreen;
