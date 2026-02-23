import React from 'react';
import './Tile.css';

const Tile = ({ tile, handleFlip, disabled }) => {
    const handleClick = () => {
        if (!disabled && !tile.flipped && !tile.matched) {
            handleFlip(tile);
        }
    };

    return (
        <div className={`tile ${tile.flipped ? 'flipped' : ''} ${tile.matched ? 'matched' : ''}`} onClick={handleClick}>
            <div className="tile-inner">
                <div className="tile-front">
                    <div className="tile-card-pattern">?</div>
                </div>
                <div className="tile-back">
                    <img src={tile.icon} alt="emoji" className="emoji-img" draggable="false" />
                </div>
            </div>
        </div>
    );
};

export default Tile;
