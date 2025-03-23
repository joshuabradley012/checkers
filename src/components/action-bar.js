import React, { Component } from 'react';
import { getPieceName } from '../utils/player-name.js';
import '../scss/action-bar.scss';

const ActionBar = ({ player, handleGameOver }) => (
  <div className="action-bar">
    <span className="surrender-button" onClick={() => handleGameOver(player === 1 ? 2 : 1)}></span>
  </div>
);

export default ActionBar;
