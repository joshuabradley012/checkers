import React, { Component } from 'react';
import classNames from 'classnames';
import { getPieceName } from '../utils/player-name.js';
import '../scss/player-status.scss';

const PlayerStatus = ({ player, wonPieces }) => {
  const opponent = player === 1 ? 2 : 1;
  const score = wonPieces[player].length - wonPieces[opponent].length;
  return (
    <div className="player-status">
      {wonPieces[player].map((piece, i) => <span key={i} className={classNames('won-piece', getPieceName(piece))}></span>)}
      {score > 0 ?
        <span className="player-score">{`+${score}`}</span>
        : ''
      }
    </div>
  );
};

export default PlayerStatus;
