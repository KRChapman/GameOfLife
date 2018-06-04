import React, { Component } from 'react';
import ControlGameBtns from './components/controlGameBtns.js'

import GameBoard from './components/GameBoard';

class App extends Component {
  constructor(props){
    super(props);

    this.state= {
      boardSize: {size: 10, classSize: 'cell-small'},
      
      boardArray: []
    }

    this.handleRunGame = this.handleRunGame.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.handleClearGame = this.handleClearGame.bind(this);
  }

  componentDidMount(){
    let size = this.state.boardSize.size * this.state.boardSize.size;
    let boardArray = this.createBoard(size);
   this.setState({boardArray})
  }

  handleRunGame(e){
    console.log(e);
    this.gameAlgo();
  }

  gameAlgo(){
    let rowSize = this.state.boardSize.size;
    let boardArray = this.state.boardArray;
    const cellSearchModifiers = [{ y: 0, x: -1 }, { y: 1, x: -1 },{ y: 1, x: 0 }, { y: 1, x: 1 },
      { y: 0, x: 1 }, { y: -1, x: +1 }, { y: -1, x: 0 }, { y: -1, x: -1 },  { y: 0, x: 0 }]
//
    const aliveArray = boardArray.filter(cell =>{

      return cell.status === 'alive';
    })
    let arrayToCount = []
    aliveArray.forEach(cell =>{
      // for each alive cell add 1 count to each neighbor
      let setOfNeightbors = cellSearchModifiers.map(search => {
        let newY = search.y + cell.positionTwo.y;
        let newX = search.x + cell.positionTwo.x;
        newY = modulo(newY, rowSize) * rowSize;
        newX = modulo(newX, rowSize);
        let index = newY + newX;
        return {index};
      })

      arrayToCount = [...arrayToCount, ...setOfNeightbors]
      console.log("arrayToCount", arrayToCount);
    });

    // count how many times a cell touches a neighbor alive or dead cell
    const occurrences = arrayToCount.reduce(function (obj, item) {
      let stringObj = JSON.stringify(item);


                          //yes   /// no 
      obj[stringObj] = (obj[stringObj] || 0) + 1;
      return obj;
    }, {});


    this.setState(currentState =>{

      let boardArray =  [...currentState.boardArray]
      let answer = [];
      for (let prop in occurrences) {
        let a = Object.keys(prop);
        let positionObj = JSON.parse(prop);
        let count = occurrences[prop];

        let YandX = this.setXandY(positionObj.index, rowSize);
        let cellStatus = changeStatus(count, boardArray, positionObj.index)
        if (cellStatus != null) {
          let change = { position: positionObj.index, count, positionTwo: YandX, status: cellStatus }
          answer.push(change);
        }


      }

      answer.forEach(ele =>{
        boardArray[ele.position].status = ele.status;
      })
      return{

        boardArray: boardArray
      }
    })


    function modulo(divided, divisor){
      return ((divided % divisor) + divisor) % divisor;
    }
    function changeStatus(count, boardArray, position){
      // change status if it meets criteria for conwaygameof life and skip redundant
      let newStatus;
      if (count === 3 && boardArray[position].status !== 'alive'){
        newStatus = 'alive';
      }
      else if ((count >= 5 || count <= 2) && boardArray[position].status !== 'dead'){
        newStatus = 'dead'
      }
      return newStatus;
    }
  }



  handleClearGame(e){
    let size = this.state.boardSize.size * this.state.boardSize.size;
    const boardArray = [...Array(size)].map((e, i) => {
      //  let a = i.toString()
      return 'dead';
    });
    
    this.setState(currentState =>{
      let newArray = [...currentState.boardArray];
      newArray.forEach(element => {
        element.status = 'dead';
      })

      return{
        boardArray: newArray
      }
    })
  }

  createBoard(totalSize) {
    //Get the ranges of first and last row to make a top bottom tordial location connection
    let sizeOfOneRow = this.state.boardSize.size;
    // let firstNumberInLastRow = this.state.boardSize.size * this.state.boardSize.size - this.state.boardSize.size;
 
    

    const boardArray = [...Array(totalSize)].map((e, i ) => {
   
  
    let positionTwo = this.setXandY(i, sizeOfOneRow);
      
     // + startPositionAtOne
 
      return { status: 'dead', position: i , positionTwo};
    });
    boardArray[11].status = 'alive';
    boardArray[1].status = 'alive';
    
    // console.log("boardArray", boardArray);
    return boardArray;
  }
  setXandY(index, sizeOfOneRow){
    let x = index % sizeOfOneRow;
    let y = Math.floor(index / sizeOfOneRow);
    let positionTwo = { y: y, x: x };
    return positionTwo;
  }

  handleSquareClick(index, event){

    this.setState(currentState =>{
      let newArray = [...currentState.boardArray];
      newArray[index].status = newArray[index].status === 'alive' ? 'dead' : 'alive';

      return {
        boardArray: newArray
      }
    })
    console.log('index', index);
    console.log('event', event);
  }


  render() {
    console.log(this.state.boardArray);
    return (
      <div className="App">
     
        <main>
          <div>
            <ControlGameBtns runGame={this.handleRunGame} clearGame={this.handleClearGame} />
          </div>
          <div className="game-board">
            <GameBoard boardArray={this.state.boardArray} squareClick={this.handleSquareClick}/>
          </div>
        </main>
          
    
      </div>
    );
  }
}

export default App;
