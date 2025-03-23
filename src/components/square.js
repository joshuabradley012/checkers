import React, { Component } from 'react';
import classNames from 'classnames';
import '../scss/square.scss';

const Square = ({ color, piece, handlePieceDown, handlePieceUp }) => (
  <div
    className={classNames('square', color, piece)}
    onMouseDown={handlePieceDown}
    onMouseUp={handlePieceUp}
  ></div>
);

export default Square;
