export function modulo(divided, divisor) {
  return ((divided % divisor) + divisor) % divisor;
}

export function setXandY(index, sizeOfOneRow){
  let x = index % sizeOfOneRow;
  let y = Math.floor(index / sizeOfOneRow);
  let positionTwo = { y: y, x: x };
  return positionTwo;
}

export function countLivingCells(boardArray){
  const countAlive = boardArray.filter(ele => (
    ele.status === 'alive'
  ))

  const population = countAlive.length;

  return population;

}

export const cellModifiers = {
  cellSearchModifiers: [{ y: 0, x: -1 }, { y: 1, x: -1 }, { y: 1, x: 0 }, { y: 1, x: 1 },
                       { y: 0, x: 1 }, { y: -1, x: +1 }, { y: -1, x: 0 }, { y: -1, x: -1 }, 
                       { y: 0, x: 0 }],
  gliderPaterns : {
                  rightGlider: [{ y: -1, x: 0 }, { y: 1, x: 0 },
                  { y: 0, x: 1 }, { y: 1, x: 1 }, { y: 1, x: -1 }],
                  leftGlider: [{ y: 0, x: -1 }, { y: 1, x: 0 },
                  { y: -1, x: 0 }, { y: 1, x: -1 }, { y: 1, x: 1 }]
  }
}
