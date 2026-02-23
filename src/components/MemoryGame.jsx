import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import './MemoryGame.css';

const MemoryGame = ({ icons, onWin, onMove }) => {
    const [tiles, setTiles] = useState([]);
    const [choiceOne, setChoiceOne] = useState(null);
    const [choiceTwo, setChoiceTwo] = useState(null);
    const [disabled, setDisabled] = useState(false);

    // Initialize/Shuffle game
    useEffect(() => {
        const shuffledTiles = [...icons, ...icons]
            .sort(() => Math.random() - 0.5)
            .map((icon, index) => ({ icon, id: index, matched: false, flipped: false }));

        setTiles(shuffledTiles);
        setChoiceOne(null);
        setChoiceTwo(null);
    }, [icons]);

    // Handle a choice
    const handleFlip = (tile) => {
        choiceOne ? setChoiceTwo(tile) : setChoiceOne(tile);

        // Update flipped state in local tiles
        setTiles(prevTiles => {
            return prevTiles.map(t => {
                if (t.id === tile.id) {
                    return { ...t, flipped: true };
                }
                return t;
            });
        });
    };

    // Compare two choices
    useEffect(() => {
        if (choiceOne && choiceTwo) {
            setDisabled(true);

            if (choiceOne.icon === choiceTwo.icon) {
                onMove(true);
                setTiles(prevTiles => {
                    return prevTiles.map(tile => {
                        if (tile.icon === choiceOne.icon) {
                            return { ...tile, matched: true, flipped: true };
                        }
                        return tile;
                    });
                });
                resetTurn();
            } else {
                onMove(false);
                setTimeout(() => {
                    setTiles(prevTiles => {
                        return prevTiles.map(tile => {
                            if (tile.id === choiceOne.id || tile.id === choiceTwo.id) {
                                return { ...tile, flipped: false };
                            }
                            return tile;
                        });
                    });
                    resetTurn();
                }, 1000);
            }
        }
    }, [choiceOne, choiceTwo, onMove]);

    // Reset choices & increase disabled
    const resetTurn = () => {
        setChoiceOne(null);
        setChoiceTwo(null);
        setDisabled(false);
    };

    // Check for win
    useEffect(() => {
        if (tiles.length > 0 && tiles.every(tile => tile.matched)) {
            setTimeout(onWin, 500);
        }
    }, [tiles, onWin]);

    return (
        <div className="game-grid">
            {tiles.map(tile => (
                <Tile
                    key={tile.id}
                    tile={tile}
                    handleFlip={handleFlip}
                    disabled={disabled}
                />
            ))}
        </div>
    );
};

export default MemoryGame;
