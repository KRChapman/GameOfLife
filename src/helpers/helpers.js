export function modulo(divided, divisor) {
  return ((divided % divisor) + divisor) % divisor;
}

export function setXandY(index, sizeOfOneRow){
  let x = index % sizeOfOneRow;
  let y = Math.floor(index / sizeOfOneRow);
  let positionTwo = { y: y, x: x };
  return positionTwo;
}