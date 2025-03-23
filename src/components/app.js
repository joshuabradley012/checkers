import React, { Component } from 'react';
import classNames from 'classnames';
import { getPieceName } from '../utils/player-name.js';
import '../scss/app.scss';

import Board from './board.js';
import GameOverModal from './game-over-modal.js';
import PieceInHand from './piece-in-hand.js';

class App extends Component {
  constructor() {
    super();

    this.diagonals = [-9, -7, 7, 9];

    this.initialState = {
      board: [
        0, 1, 0, 1, 0, 1, 0, 1,
        1, 0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0, 1,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        2, 0, 2, 0, 2, 0, 2, 0,
        0, 2, 0, 2, 0, 2, 0, 2,
        2, 0, 2, 0, 2, 0, 2, 0,
      ],
      currentPlayer: 2,
      activePiece: 0,
      activePieceOrigIndex: -1,
      gameOver: false,
      winningPlayer: 0,
      mouse: {
        x: 0,
        y: 0,
      },
      pieceSize: {
        width: 0,
        height: 0,
      },
      wonPieces: {
        1: [],
        2: [],
      },
      playPieceUp: false,
      playPieceTake: false,
    };

    this.state = this.initialState;

    this.audioPieceUp = new Audio('piece-up.mp3');
    this.audioPieceTake = new Audio('piece-take.mp3');

    this.onMouseMove = this.onMouseMove.bind(this);
    this.handlePieceDown = this.handlePieceDown.bind(this);
    this.handlePieceUp = this.handlePieceUp.bind(this);
    this.handleGameOver = this.handleGameOver.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.updatePieceSize = this.updatePieceSize.bind(this);
  }

  get currentPlayerKingCode() {
    return this.state.currentPlayer === 1 ? 3 : 4;
  }

  get nextPlayer() {
    return this.state.currentPlayer === 2 ? 1 : 2;
  }

  get cursor() {
    let cursorState = '';
    if (this.state.activePiece)
      cursorState = 'grabbing';
    return cursorState;
  }

  get direction() {
    let direction = 1;
    if (this.state.activePiece === 2)
      direction = -1;
    return direction;
  }

  getDirection(pieceCode) {
    let direction = 1;
    if (pieceCode === 2)
      direction = -1;
    return direction;
  }

  getJumpMoves(from = this.state.activePieceOrigIndex, board = this.state.board) {
    const jumpMoves = [];

    for (let i = 0; i < this.diagonals.length; i++) {
      const diagonal = this.diagonals[i];
      const to = from + (diagonal * 2);

      if (
        this.isOpponent(board[from + diagonal])
        && board[to] === 0
        && to !== this.state.activePieceOrigIndex
        && this.isTwoRowsAway(to, from)
      ) jumpMoves.push(to);
    }

    return jumpMoves;
  }

  jumpedPieceIndex(to, from = this.state.activePieceOrigIndex) {
    const board = this.state.board;

    for (let i = 0; i < this.diagonals.length; i++) {
      const diagonal = this.diagonals[i];

      if (
        this.isOpponent(board[from + diagonal])
        && from + (diagonal * 2) === to
        && this.isTwoRowsAway(to, from)
      ) return from + diagonal;
    }

    return -1;
  }

  rowsAway(to, from = this.state.activePieceOrigIndex) {
    const fromRow = Math.floor(from / 8) % 8;
    const toRow = Math.floor(to / 8) % 8;
    return (toRow - fromRow);
  }

  onMouseMove(e) {
    this.setState({
      mouse: {
        x: e.pageX,
        y: e.pageY,
      },
    });
  }

  isPlayer(pieceCode, currentPlayer = this.state.currentPlayer) {
    if (currentPlayer === 1)
      return pieceCode === 1 || pieceCode === 3;
    if (currentPlayer === 2)
      return pieceCode === 2 || pieceCode === 4;
    return false;
  }

  isLastRow(to) {
    const row = Math.floor(to / 8) % 8;
    if (this.direction === 1 && row === 7)
      return true;
    if (this.direction === -1 && row === 0)
      return true;
    return false;
  }

  isOpponent(pieceCode, currentPlayer = this.state.currentPlayer) {
    return !this.isPlayer(pieceCode, currentPlayer) && pieceCode !== 0;
  }

  isKing(pieceCode = this.state.activePiece) {
    return pieceCode === 3 || pieceCode === 4;
  }

  isOneRowForward(to, from = this.state.activePieceOrigIndex, player = this.state.currentPlayer) {
    return this.rowsAway(to, from) * this.getDirection(player) === 1;
  }

  isTwoRowsForward(to, from = this.state.activePieceOrigInde, player = this.state.currentPlayer) {
    return this.rowsAway(to, from) * this.getDirection(player) === 2;
  }

  isOneRowAway(to, from = this.state.activePieceOrigIndex) {
    return Math.abs(this.rowsAway(to, from)) === 1;
  }

  isTwoRowsAway(to, from = this.state.activePieceOrigIndex) {
    return Math.abs(this.rowsAway(to, from)) === 2;
  }

  isDiagonalMove(to, from = this.state.activePieceOrigIndex) {
    return this.diagonals.some(diagonal => from + diagonal === to);
  }

  isValidMove(to, from = this.state.activePieceOrigIndex) {
    let { currentPlayer, activePiece } = this.state;

    if (this.isOpponent(activePiece))
      return false;

    const pieceOnSquare = this.state.board[to];

    if (pieceOnSquare)
      return false;

    const jumpedPieceIndex = this.jumpedPieceIndex(to, from);
    const isJumpMove = jumpedPieceIndex !== -1;
    const isValidDiagonalMove = this.isDiagonalMove(to, from) && (this.isOneRowForward(to, from) || this.isKing(activePiece));
    const isValidJumpMove = isJumpMove && (this.isTwoRowsForward(to, from) || this.isKing(activePiece));

    if (!isValidDiagonalMove && !isValidJumpMove)
      return false;

    if (isValidDiagonalMove && this.playerHasJumpMove(currentPlayer))
      return false;

    return true;
  }

  hasDiagonalMove(from = this.state.activePieceOrigIndex, board = this.state.board, player = this.state.currentPlayer) {
    const pieceCode = board[from];
    return this.diagonals.some(diagonal => {
      const to = from + diagonal;
      const isPossibleMove = board[to] === 0;
      const isValidKingMove = this.isKing(pieceCode) && this.isOneRowAway(to, from, player);
      const isValidPieceMove = this.isOneRowForward(to, from, player);

      return isPossibleMove && (isValidKingMove || isValidPieceMove);
    });
  }

  hasJumpMove(from = this.state.activePieceIndex, board = this.state.board, player = this.state.currentPlayer) {
    const pieceCode = board[from];
    const possibleJumpMoves = this.getJumpMoves(from, board);
    const hasPossibleMoves = !!possibleJumpMoves.length;

    if (!hasPossibleMoves)
      return false;

    const hasValidMoves = this.isKing(pieceCode) || possibleJumpMoves.some(move => this.isTwoRowsForward(move, from));

    if (!hasValidMoves)
      return false;

    return true;
  }

  playerHasDiagonalMove(player = this.state.currentPlayer, board = this.state.board) {
    for (let i = 0; i < board.length; i++) {
      const pieceOnSquare = board[i];
      if (!this.isPlayer(pieceOnSquare, player))
        continue;
      if (this.hasDiagonalMove(i, board, player))
        return true;
    }
    return false;
  }

  playerHasJumpMove(player = this.state.currentPlayer, board = this.state.board) {
    for (let i = 0; i < board.length; i++) {
      const pieceOnSquare = board[i];
      if (!this.isPlayer(pieceOnSquare, player))
        continue;
      if (this.hasJumpMove(i, board, player))
        return true;
    }
    return false;
  }

  playerHasMove(player = this.state.currentPlayer, board = this.state.board) {
    return this.playerHasDiagonalMove(player, board) || this.playerHasJumpMove(player, board);
  }

  handlePieceDown(i) {
    const pieceCode = this.state.board[i];

    if (pieceCode) {
      const newBoard = this.state.board.slice();
      newBoard[i] = 0;

      this.setState({
        board: newBoard,
        activePiece: pieceCode,
        activePieceOrigIndex: i,
      });
    }
  }

  handlePieceUp(i) {
    let { currentPlayer, activePiece } = this.state;

    if (!activePiece) return;

    const newBoard = this.state.board.slice();
    const wonPieces = {
      1: [...this.state.wonPieces[1]],
      2: [...this.state.wonPieces[2]],
    };

    if (this.isValidMove(i)) {
      let isKinged = false;

      if (this.isLastRow(i)) {
        newBoard[i] = this.currentPlayerKingCode;
        if (activePiece !== this.currentPlayerKingCode) {
          isKinged = true;
        }
      } else {
        newBoard[i] = activePiece;
      }

      const jumpedPieceIndex = this.jumpedPieceIndex(i);
      const isJumpMove = jumpedPieceIndex !== -1;

      if (isJumpMove) {
        this.handlePlayPieceTake();
        wonPieces[currentPlayer].push(newBoard[jumpedPieceIndex]);
        newBoard[jumpedPieceIndex] = 0;

        if (!this.hasJumpMove(i, newBoard)) {
          currentPlayer = this.nextPlayer;
        }
      } else {
        this.handlePlayPieceUp();
        currentPlayer = this.nextPlayer;
      }

      if (isKinged)
        currentPlayer = this.nextPlayer;

    } else {
      newBoard[this.state.activePieceOrigIndex] = activePiece;
    }

    this.setState({
      board: newBoard,
      activePiece: 0,
      activePieceOrigIndex: -1,
      currentPlayer: currentPlayer,
      wonPieces: wonPieces,
    }, () => {
      if (!this.playerHasMove()) {
        if (!this.playerHasMove(this.nextPlayer)) {
          return this.handleGameOver(0);
        }
        return this.handleGameOver(this.nextPlayer);
      }
    });
  }

  handleGameOver(winningPlayer) {
    this.setState({
      gameOver: true,
      winningPlayer,
    });
  }

  handleReset() {
    this.setState({
      ...this.initialState,
      pieceSize: this.state.pieceSize,
    });
  }

  handlePlayPieceUp() {
    this.setState({
      playPieceUp: true
    }, () => {
      this.state.playPieceUp ? this.audioPieceUp.play() : this.audioPieceUp.pause();
    })
  }

  handlePlayPieceTake() {
    this.setState({
      playPieceTake: true
    }, () => {
      this.state.playPieceTake ? this.audioPieceTake.play() : this.audioPieceTake.pause();
    })
  }

  updatePieceSize() {
    const square = document.querySelector('.board .square');

    this.setState({
      pieceSize: {
        width: square.offsetWidth,
        height: square.offsetHeight,
      }
    });
  }

  componentDidMount() {
    this.updatePieceSize();
    window.addEventListener('resize', this.updatePieceSize);
    this.audioPieceUp.addEventListener('ended', () => this.setState({ playPieceUp: false }))
    this.audioPieceTake.addEventListener('ended', () => this.setState({ playPieceTake: false }))
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePieceSize);
    this.audioPieceUp.removeEventListener('ended', () => this.setState({ playPieceUp: false }))
    this.audioPieceTake.removeEventListener('ended', () => this.setState({ playPieceTake: false }))
  }

  render() {
    return (
      <div className={classNames('app-shell', this.cursor)} onMouseMove={this.onMouseMove}>
        <Board
          board={this.state.board}
          wonPieces={this.state.wonPieces}
          handlePieceDown={this.handlePieceDown}
          handlePieceUp={this.handlePieceUp}
          handleGameOver={this.handleGameOver}
        />
        <PieceInHand
          activePiece={getPieceName(this.state.activePiece)}
          position={this.state.mouse}
          size={this.state.pieceSize}
        />
        <GameOverModal
          active={this.state.gameOver}
          winningPlayer={this.state.winningPlayer}
          handleReset={this.handleReset}
        />
      </div>
    );
  }
}

export default App;
