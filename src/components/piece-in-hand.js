import React, { Component } from 'react';
import classNames from 'classnames';
import '../scss/piece-in-hand.scss';

const PieceInHand = ({ activePiece, position, size }) => (
  <span
    className={classNames('piece-in-hand', activePiece)}
    style={{
      top: position.y,
      left: position.x,
      width: size.width,
      height: size.height,
    }}
  ></span>
);

export default PieceInHand;
