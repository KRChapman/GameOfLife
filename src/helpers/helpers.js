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

  console.log("countAlive", countAlive);
  const population = countAlive.length;

  return population;

}

// export const countLivingCells = (boardArray) => {
//   const countAlive = boardArray.filter(ele => (
//     ele.status === 'alive'
//   ))

//   console.log("countAlive", countAlive);
//   const population = countAlive.length;

//   return population;

// }
