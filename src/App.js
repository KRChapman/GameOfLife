import React, { Component } from 'react';
import ControlGameBtns from './components/controlGameBtns.js'

import GameBoard from './components/GameBoard';

class App extends Component {
  constructor(props){
    super(props);

    this.state= {
      boardSize: {size: 10, classSize: 'cell-small'},
      
      boardArray: [],
      runSim: false
    }

    this.handleRunGame = this.handleRunGame.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.handleClearGame = this.handleClearGame.bind(this);


  //  this.gameAlgo = this.gameAlgo.bind(this);
  }

  componentDidMount(){
    let size = this.state.boardSize.size * this.state.boardSize.size;
    let boardArray = this.createBoard(size);
   this.setState({boardArray})
  }

  componentDidUpdate(prevProps, prevState){
    console.log("prevState.runSim", prevState.runSim)
    console.log("prevState.runSim", this.state.runSim)
    if (this.state.runSim === true ){
      // this.startRunGame();
      // this.startRunGame();
    }

  }
  startRunGame(e){
   // console.log(e);
    let runSim = !this.state.runSim
    this.setState({ runSim: runSim});
  
  }

 // startRunGame
  handleRunGame(e){
  //  this.gameAlgo();
    console.log(e);
   
      this.gameAlgo();
    const randomInterval = (() => {
      // const same = (min, max) => Math.random() * (max - min) + min;
      const same = (min, max) => max - min;
      return (callback, min, max) => {
        const time = {
          start: performance.now(),
          total: same(min, max)
        };
        const tick = now => {
          if (time.total <= now - time.start) {
            time.start = now;
            time.total = same(min, max);
         
            callback();
          }
          requestAnimationFrame(tick);
        };
      
        requestAnimationFrame(tick);
      };
      // let runSim = !this.state.runSim
      // this.setState({ runSim: runSim });
    })();


    // setInterval(this.handleRunGame, 1000);
    if (typeof e === 'object'){
      console.log("typeof e", typeof e)
    //  debugger;
      randomInterval(() => this.handleRunGame(), 4000, 5000); 
   
    }
   
    // randomInterval(, 1000, 5000)
  
    // requestAnimationFrame(this.handleRunGame);
  
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
    let arrayToCount = [];
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
 
    
    this.setState(currentState =>{
      let clearArray = [...currentState.boardArray];
      clearArray.forEach(element => {
        element.status = 'dead';
      })

      return{
        boardArray: clearArray
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
    boardArray[33].status = 'alive';
    boardArray[35].status = 'alive';
    boardArray[34].status = 'alive';
    boardArray[53].status = 'alive';
    boardArray[43].status = 'alive';
    boardArray[44].status = 'alive';
    boardArray[45].status = 'alive';
    boardArray[53].status = 'alive';
    boardArray[54].status = 'alive';
    boardArray[55].status = 'alive';
    
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
