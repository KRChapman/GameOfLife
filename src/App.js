import React, { Component } from 'react';
import ControlGameBtns from './components/controlGameBtns.js'
import Layout from './components/Layout';
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
    let nextRow = this.state.boardSize.size;
    let nextPosition = 1;
    let upperEnd = nextRow - 1; //9
    let lowEnd = nextRow + 1;//11
    let statusOptionsObject = {'alive' : 'dead', 'dead' : 'alive'}
    this.setState(currentState => {
      let boardArray = [...currentState.boardArray];

       boardArray.forEach((cell, i) => {
        let position = cell.position;
         let positionTwo = cell.positionTwo;
        let ArrayToCount;
         
         let statusToCompare = statusOptionsObject[cell.status];
        // if(cell.status === 'dead'){
          
          ArrayToCount = boardArray.filter(ele => {
          //  && ele.status == 'alive'
           return ((position - nextPosition == ele.position || position + nextPosition == ele.position) || 
                  (position - lowEnd <= ele.position && position - upperEnd >= ele.position) || 
             (position + lowEnd >= ele.position && position + upperEnd <= ele.position)) && ele.status === 'alive';
             //Need || then top to bottom CONNECTION
          })
 

         console.log("ArrayToCount", i, ArrayToCount);

        let newStatus = this.checkCellCycle(ArrayToCount, cell.status);
         console.log("newStatus", newStatus);
       });
      
    })
  }

  checkCellCycle(cellArray, cellStatus){
    let newStatus;
    if(cellStatus === 'dead' && cellArray.length === 3){
      // console.log('change alive');
      newStatus = 'alive';
    }
    else if (cellStatus === 'alive' && (cellArray.length >= 4 || cellArray.length <= 1 )) {
      // console.log('change status dead');
      newStatus = 'dead';
    }
    else{
      newStatus = cellStatus;
    }
    return newStatus
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

  createBoard(size) {
    //Get the ranges of first and last row to make a top bottom tordial location connection
    let lastNumberInFirstRow = this.state.boardSize.size;
    let firstNumberInLastRow = this.state.boardSize.size * this.state.boardSize.size - this.state.boardSize.size;
    let totalSize = this.state.boardSize.size * this.state.boardSize.size;
    let startPositionAtOne = 1;
    

    const boardArray = [...Array(size)].map((e, i ) => {
   
      let positionTwo = null;
      if (i < lastNumberInFirstRow){
        positionTwo = i + startPositionAtOne + totalSize;
      }

      else if (i >= firstNumberInLastRow){
        positionTwo = i + startPositionAtOne - totalSize;
      }
    
      return { status: 'dead', position: i + startPositionAtOne, positionTwo};
    });
    boardArray[54].status = 'alive';
    return boardArray;
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
