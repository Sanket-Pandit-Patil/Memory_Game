import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import WelcomeScreen from './components/WelcomeScreen';
import SetupScreen from './components/SetupScreen';
import MemoryGame from './components/MemoryGame';
import ResultScreen from './components/ResultScreen';
import Header from './components/Header';
import { fetchEmojis } from './utils/api';
import { soundManager } from './utils/soundManager';
import './index.css';

const App = () => {
  const [gameStatus, setGameStatus] = useState('welcome'); // welcome, setup, playing, win, fail
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Game Config
  const [difficulty, setDifficulty] = useState('easy');
  const [config, setConfig] = useState({}); // { timeLimit, movesLimit }
  const [icons, setIcons] = useState([]);

  // Stats
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [matches, setMatches] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Performance Result
  const [gameResult, setGameResult] = useState(null);

  const timerRef = useRef(null);

  // Initialize
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

  const toggleMute = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    soundManager.setMute(newMute);
  };

  // Timer Logic
  useEffect(() => {
    if (gameStatus === 'playing') {
      timerRef.current = setInterval(() => {
        setSeconds(prev => {
          const next = prev + 1;
          // Check Time Limit
          if (config.timeLimit && next >= config.timeLimit) {
            handleEarlyStop('time');
            return config.timeLimit;
          }
          return next;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameStatus, config.timeLimit]);

  const handleStart = async (difficultyConfig) => {
    // 1. Reset all stats immediately to prevent stale checks from previous game
    setMoves(0);
    setSeconds(0);
    setMatches(0);
    setStreak(0);
    setMaxStreak(0);
    setAttempts(0);
    setGameResult(null);
    setIcons([]); // Clear icons while loading

    // 2. Set config and initialize sound
    setDifficulty(difficultyConfig.difficulty);
    setConfig(difficultyConfig);
    soundManager.init();

    // 3. Fetch icons
    const fetched = await fetchEmojis(8);
    setIcons(fetched);

    // 4. Finally marker as playing
    setGameStatus('playing');
    soundManager.play('win'); // Short start chime
  };

  const handleEarlyStop = useCallback((cause) => {
    setGameStatus('fail');
    setGameResult({ isWin: false, cause });
    soundManager.play('fail');
  }, []);

  const handleWin = useCallback(() => {
    // We use functional state update to get current values without dependencies
    setGameStatus(current => {
      if (current !== 'playing') return current;

      // We calculate accuracy and save score inside here or use refs
      // For simplicity, let's just trigger the win state
      soundManager.play('win');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      return 'win';
    });
  }, []);

  // Use refs for values needed in callbacks without triggering re-creation
  const statsRef = useRef({ moves: 0, seconds: 0, matches: 0, attempts: 0 });
  useEffect(() => {
    statsRef.current = { moves, seconds, matches, attempts };
  }, [moves, seconds, matches, attempts]);

  const onMove = useCallback((success) => {
    setAttempts(prev => prev + 1);

    let nextMatches = 0;
    if (success) {
      setMatches(prev => {
        nextMatches = prev + 1;
        return nextMatches;
      });
      setStreak(prev => {
        const next = prev + 1;
        setMaxStreak(ms => Math.max(ms, next));
        return next;
      });
      soundManager.play('match');
    } else {
      setStreak(0);
      soundManager.play('mismatch');
    }

    setMoves(prevMoves => {
      const nextMoves = prevMoves + 1;

      // Strict check for moves limit
      // We check nextMatches after a short delay since state updates are async
      // But we can also check it directly if we use functional updates correctly
      return nextMoves;
    });
  }, []);

  // Separate effect for win/fail condition monitoring
  useEffect(() => {
    if (gameStatus === 'playing') {
      if (matches === 8) {
        // Late win check
        handleWin();
      } else if (config.movesLimit && moves >= config.movesLimit) {
        // Only fail if we haven't matched everything and we've reached the limit
        // We wait for tile animations to finish
        const timeout = setTimeout(() => {
          setGameStatus(current => {
            if (current === 'playing' && matches < 8) {
              handleEarlyStop('moves');
              return 'fail';
            }
            return current;
          });
        }, 800);
        return () => clearTimeout(timeout);
      }
    }
  }, [moves, matches, gameStatus, config.movesLimit, handleWin, handleEarlyStop]);

  // Timer Check
  useEffect(() => {
    if (gameStatus === 'playing' && config.timeLimit) {
      if (seconds >= config.timeLimit) {
        handleEarlyStop('time');
      }
    }
  }, [seconds, config.timeLimit, gameStatus]);

  return (
    <div className="app-container">
      {gameStatus === 'welcome' && (
        <WelcomeScreen onStart={() => setGameStatus('setup')} />
      )}

      {gameStatus === 'setup' && (
        <SetupScreen onStart={handleStart} />
      )}

      {gameStatus === 'playing' && (
        <div className="game-panel">
          <Header
            moves={moves}
            seconds={seconds}
            config={config}
            isDarkMode={isDarkMode}
            isMuted={isMuted}
            toggleTheme={toggleTheme}
            toggleMute={toggleMute}
            restartGame={() => setGameStatus('setup')}
          />
          <MemoryGame
            icons={icons}
            onWin={handleWin}
            onMove={onMove}
          />
        </div>
      )}

      {(gameStatus === 'win' || gameStatus === 'fail') && (
        <ResultScreen
          result={gameResult}
          stats={{
            moves, seconds, matches, maxStreak,
            totalMoves: config.movesLimit,
            totalTime: config.timeLimit,
            accuracy: attempts > 0 ? Math.round((8 / attempts) * 100) : 0,
            difficulty
          }}
          onRestart={() => handleStart(config)}
          onChangeDifficulty={() => setGameStatus('setup')}
          onPractice={() => handleStart({ difficulty: 'easy' })}
        />
      )}
    </div>
  );
};

export default App;
