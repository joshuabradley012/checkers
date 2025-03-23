import React, { Component } from 'react';
import classNames from 'classnames';
import { getPlayerName } from '../utils/player-name.js';
import '../scss/game-over-modal.scss';

const GameOverModal = ({ active, winningPlayer, handleReset }) => {
  let message = 'Draw!';

  if (winningPlayer) {
    message = `${getPlayerName(winningPlayer)} wins!`;
  }

  return (
    <div className={classNames('modal', active ? 'active' : '')}>
      <div className="modal-inner">
        <h2 className="modal-title">Game over</h2>
        <p>{message}</p>
        <button className="btn" onClick={handleReset}>Play again</button>
      </div>
    </div>
  );
};

export default GameOverModal;
