import React, { Component } from 'react';
import ControlGameBtns from './components/controlGameBtns.js'
import Layout from './components/Layout';
import GameBoard from './components/GameBoard';

class App extends Component {
  constructor(props){
    super(props);

    this.state= {
      boardSize: 400,
      boardFactor: 20,
      boardArray: []
    }

    this.handleRunGame = this.handleRunGame.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.handleClearGame = this.handleClearGame.bind(this);
  }

  componentDidMount(){

   let boardArray= this.createBoard(this.state.boardSize);
   this.setState({boardArray})
  }

  handleRunGame(e){
    console.log(e);
  }

  gameAlgo(){

    this.setState(currentState => {
      let boardArray = [...currentState.boardArray];

       boardArray.forEach(cell => {
        let position = cell.position;
        if(cell.status === 'dead'){
          
          boardArray.filter()
        }
         
       });
      
    })
  }
  handleClearGame(e){
    const boardArray = [...Array(this.state.boardSize)].map((e, i) => {
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
    const boardArray = [...Array(size)].map((e, i) => {
      let positionTwo = null;
      if(i < 10){
        positionTwo = i + this.state.boardSize;
      }
      else if (i >= 41){
        positionTwo = i - this.state.boardSize;
      }
    //  let a = i.toString()
      return { status: 'dead', position: i, positionTwo};
    });
    boardArray[1].status = 'alive';
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
