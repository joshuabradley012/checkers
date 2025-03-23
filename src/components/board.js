import React, { Component } from 'react';
import classNames from 'classnames';
import { getPieceName } from '../utils/player-name.js';
import '../scss/board.scss';

import Square from './square.js';
import PlayerStatus from './player-status.js';
import ActionBar from './action-bar.js';

const BoardBar = ({ player, wonPieces, handleGameOver }) => (
  <div className="board-bar">
    <PlayerStatus player={player} wonPieces={wonPieces} />
    <ActionBar player={player} handleGameOver={handleGameOver} />
  </div>
);

const Board = ({ board, wonPieces, handlePieceDown, handlePieceUp, handleGameOver }) => {
  let color = 'light';

  const toggleColor = () => {
    color = color === 'light' ? 'dark' : 'light';
  };

  return (
    <div className="board">
      <BoardBar
        player={1}
        wonPieces={wonPieces}
        handleGameOver={handleGameOver}
      />
      <div className="board-container">
        <div className="board-inner">
          {board.map((pieceCode, i) => {

            toggleColor();
            if (i % 8 === 0)
              toggleColor();

            const piece = getPieceName(pieceCode);

            return <Square
              key={i}
              piece={piece}
              color={color}
              handlePieceDown={() => handlePieceDown(i)}
              handlePieceUp={() => handlePieceUp(i)}
            />
          })}
        </div>
      </div>
      <BoardBar
        player={2}
        wonPieces={wonPieces}
        handleGameOver={handleGameOver}
      />
    </div>
  );
};

export default Board;
