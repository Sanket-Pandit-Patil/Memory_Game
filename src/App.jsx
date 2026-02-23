import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import WelcomeScreen from './components/WelcomeScreen';
import WinScreen from './components/WinScreen';
import Header from './components/Header';
import MemoryGame from './components/MemoryGame';
import { fetchEmojis } from './utils/api';
import './index.css';

const App = () => {
  const [gameStatus, setGameStatus] = useState('welcome'); // 'welcome', 'playing', 'won'
  const [icons, setIcons] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  // Theme Management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const startGame = async () => {
    setGameStatus('playing');
    setMoves(0);
    setSeconds(0);
    const fetchedIcons = await fetchEmojis(8);
    setIcons(fetchedIcons);
    setTimerActive(true);
  };

  const handleWin = useCallback(() => {
    setTimerActive(false);
    setGameStatus('won');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#ec4899', '#fbbf24']
    });
  }, []);

  const incrementMoves = () => {
    setMoves(prev => prev + 1);
  };

  const restartGame = () => {
    startGame();
  };

  return (
    <div className="app-container">
      {gameStatus === 'welcome' && (
        <WelcomeScreen onStart={startGame} />
      )}

      {gameStatus === 'playing' && (
        <div className="game-panel">
          <Header
            moves={moves}
            seconds={seconds}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            restartGame={restartGame}
          />
          <MemoryGame
            icons={icons}
            onWin={handleWin}
            onMove={incrementMoves}
          />
        </div>
      )}

      {gameStatus === 'won' && (
        <WinScreen
          moves={moves}
          seconds={seconds}
          onRestart={restartGame}
        />
      )}
    </div>
  );
};

export default App;
