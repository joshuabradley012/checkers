export const getPieceName = pieceCode => {
  let name = '';
  if (pieceCode === 1)
    name = 'piece-white';
  if (pieceCode === 2)
    name = 'piece-black';
  if (pieceCode === 3)
    name = 'piece-white-king';
  if (pieceCode === 4)
    name = 'piece-black-king';
  return name;
}

export const getPlayerName = playerCode => {
  if (playerCode === 1)
    return 'White';
  if (playerCode === 2)
    return 'Black';
}

export default {
  getPieceName,
  getPlayerName,
};
