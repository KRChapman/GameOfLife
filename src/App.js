
import React, { Component } from 'react';
import ControlGameBtns from './components/buttons/controlGameBtns.js'

import GameBoard from './components/GameBoard';
import SizeBtns from './components/buttons/SizeBtns';
import GameSpeed from './components/buttons/GameSpeed';
import AddCellsBtns from './components/buttons/AddCells';
import Count from './components/buttons/count';

import { modulo, setXandY, countLivingCells } from './helpers/helpers'

class App extends Component {
  constructor(props){
    super(props);

    this.state= {
      boardSize: {size: 60, classSize: 'large-board'},
      
      boardArray: [],
      animationId: "",

      gliders: {
                rightGlider: false,
                leftGlider: false,
              },


      sliderSpeedValue: 95,
      generations: 0,
      population: 0,
    }

    this.handleRunGame = this.handleRunGame.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.handleClearGame = this.handleClearGame.bind(this);
    this.handleAddGroupCells = this.handleAddGroupCells.bind(this);
  }

  componentDidMount(){
    let size = this.state.boardSize.size * this.state.boardSize.size;
    let boardArray = this.createBoard(size);
   this.setState({boardArray})
  }

  componentDidUpdate(prevProps, prevState){
  
    if(this.state.boardSize.size !== prevState.boardSize.size){
      let size = this.state.boardSize.size * this.state.boardSize.size;
    //  this.handleClearGame();
      let boardArray = this.createBoard(size);
      this.setState({ boardArray })
    }

    if(this.state.boardArray !== prevState.boardArray){
      const boardArray = this.state.boardArray

      const population = countLivingCells(boardArray);
      this.setState({ population})
    }

  }

  shouldComponentUpdate(nextProps, nextState){
    
    return nextState.boardArray !== this.state.boardArray;

  }

  handleRunGame(e){
    const countOneGeneration = () =>{
      this.setState(currentState => {
        let generations = currentState.generations;
        generations += 1;
        return {
          generations: generations
        }
      });
    }

    this.gameAlgo();
    const max = 10000;
    const timeMultiplier = 100;
    const offSet = 499;
  
    const randomInterval = (() => {
      // const same = (min, max) => Math.random() * (max - min) + min;
      const timeBetweenTicks = (max) => max - (this.state.sliderSpeedValue * timeMultiplier + offSet);
    
      return (callback, max) => {
        const time = {
          start: performance.now(),
          total: timeBetweenTicks( max)
        };
        const tick = now => {
          if (time.total <= now - time.start) {
            time.start = now;
            time.total = timeBetweenTicks( max);
            
            callback();
            countOneGeneration();
          
          }
          // let animationId = setTimeout(tick, timeBetweenTicks)
          let animationId =  requestAnimationFrame(tick);
          console.log(animationId);
          this.setState({ animationId });
        };
      
        let animationId =  requestAnimationFrame(tick);
       // this.setState({ animationId });
      };

    })();

    function test(callback) {

      let gameLoop = function (time) {
        callback();
        countOneGeneration();
        let animationId = requestAnimationFrame(gameLoop);
        console.log(animationId);
      }

      let animationId = requestAnimationFrame(gameLoop)
    }

    if (typeof e === 'object'){
    
      randomInterval(() => this.handleRunGame(), max); 

      // test(() => this.handleRunGame());
   
    }

  }

  gameAlgo(){
    let rowSize = this.state.boardSize.size;
    let boardArray = this.state.boardArray;
    const cellSearchModifiers = [{ y: 0, x: -1 }, { y: 1, x: -1 },{ y: 1, x: 0 }, { y: 1, x: 1 },
      { y: 0, x: 1 }, { y: -1, x: +1 }, { y: -1, x: 0 }, { y: -1, x: -1 },  { y: 0, x: 0 }]
//
    const arrayToCount = aliveCellsCountNeighbors(boardArray, cellSearchModifiers);

  
  //  console.log("arrayToCount", arrayToCount);
    // count how many times a cell touches a neighbor alive or dead cell
    const occurrences = arrayToCount.reduce(function (obj, item) {
      //turn object into string so it can be used as a key
      let stringObj = JSON.stringify(item);
                          //yes   /// no 
      obj[stringObj] = (obj[stringObj] || 0) + 1;
      return obj;
    }, {});

    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];
      
    // }


    this.setState(currentState =>{

      let boardArray =  [...currentState.boardArray]
     // let answer = [];
      for (let prop in occurrences) {
          //turn string back to object 
        let positionObj = JSON.parse(prop);
        let count = occurrences[prop];

      //  let YandX = setXandY(positionObj.index, rowSize);
        let cellStatus = changeStatus(count, boardArray, positionObj.index)
        if (cellStatus != null) {
         // let change = { position: positionObj.index, count, positionTwo: YandX, status: cellStatus }
          // answer.push(change);
          boardArray[positionObj.index].status = cellStatus;
          //
        }
      }

      // answer.forEach(ele =>{
      //   boardArray[ele.position].status = ele.status;
      // })
      return{
        boardArray: boardArray
      }
    })


    function aliveCellsCountNeighbors(boardArray, cellSearchModifiers) {
      const aliveArray = boardArray.filter(cell => {

        return cell.status === 'alive';
      })
      let arrayToCount = [];
      aliveArray.forEach(cell => {
        // for each alive cell add 1 count to each neighbor
        let setOfNeightbors = cellSearchModifiers.map(search => {
          let newY = search.y + cell.positionTwo.y;
          let newX = search.x + cell.positionTwo.x;
          newY = modulo(newY, rowSize) * rowSize;
          //javascripts % is just a remainder operator and does not wrap around with negative numbers
          // this function wraps the x and y around the number line for size of row for example -1 wraps to end
          newX = modulo(newX, rowSize);
          let index = newY + newX;
          return { index };
        })

        arrayToCount = [...arrayToCount, ...setOfNeightbors]
      });
      return arrayToCount
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

  stopGameLoop = () => {


    cancelAnimationFrame(this.state.animationId);
  }

  handleClearGame(e){
    let size = this.state.boardSize.size * this.state.boardSize.size;
 
    
    this.setState(currentState =>{
      let clearArray = [...currentState.boardArray];
      clearArray.forEach(element => {
        element.status = 'dead';
      })

      return{
        boardArray: clearArray,
        animationId: "",
        generations: 0,
        population: 0,
      }
    })
    this.stopGameLoop();
  }

  createBoard(totalSize) {
 
    //Get the ranges of first and last row to make a top bottom tordial location connection
    let sizeOfOneRow = this.state.boardSize.size;
    const boardArray = [...Array(totalSize)].map((e, i ) => { 
    let positionTwo = setXandY(i, sizeOfOneRow);
      return { status: 'dead', position: i , positionTwo};
    });
   
    // boardArray[11].status = 'alive';
    // boardArray[1].status = 'alive';
    // boardArray[33].status = 'alive';
    // boardArray[35].status = 'alive';
    // boardArray[34].status = 'alive';
    // // boardArray[53].status = 'alive';
    // boardArray[43].status = 'alive';
    // boardArray[44].status = 'alive';
    boardArray[39].status = 'alive';
    boardArray[49].status = 'alive';
    boardArray[59].status = 'alive';
    // boardArray[59].status = 'alive';
    
    return boardArray;
  }


  handleSquareClick(index, event){
    let gliders = this.state.gliders;
    let rowSize = this.state.boardSize.size;
    let newArray;
    let moreThanOneChange;

  
 
    this.setState(currentState => {
      const copyArray = [...currentState.boardArray];
      


        for (const prop in gliders) {
         
          if (gliders.hasOwnProperty(prop) && gliders[prop] === true) {
            
            let aliveCellGroup = gliderClick(index, prop, copyArray);

            aliveCellGroup.forEach(ele =>{
              copyArray[ele.position].status = 'alive';
            })
            moreThanOneChange = copyArray;
    
          }
   
        }
      newArray = moreThanOneChange ? moreThanOneChange : regularClick(index, copyArray)
      

     
      return {
        boardArray: newArray
      }
    })

    function regularClick(index, copyArray) {
      copyArray[index].status = copyArray[index].status === 'alive' ? 'dead' : 'alive';
      return copyArray;

    }
    function gliderClick(index, prop, copyArray) {

      let gliderPaterns = { rightGlider: [{ y: -1, x: 0 }, { y: 1, x: 0 } , 
        { y: 0, x: 1 }, { y: 1, x: 1 }, { y: 1, x: -1 }], 
        leftGlider: [{ y: 0, x: -1 },{ y: 1, x: 0 }, { y: -1, x: 0 }, { y: 1, x: -1 }, { y: 1, x: 1 }]}

      let groupCellsArray = gliderPaterns[prop].map(ele => {

        let y = copyArray[index].positionTwo.y + ele.y;
        let x = copyArray[index].positionTwo.x + ele.x;
        //wrap around board. So that if a number is negative or higher than the array of the boarder
        let toAddy = modulo(y, rowSize) * rowSize;
        //javascripts % is just a remainder operator and does not wrap around with negative numbers
        // this function wraps the x and y around the number line for size of row for example -1 wraps to end
        let toAddx = modulo(x, rowSize);

        let position = toAddy + toAddx;
     
   
        return { y: toAddy, x: toAddx, position };
      })

      return groupCellsArray;

    }
    
  }
  handleChangeSize = (e) =>{
    console.log('ee',e.currentTarget.dataset.size);
    let boardSize = Object.assign({}, this.state.boardSize); 
    boardSize.size = parseInt(e.currentTarget.dataset.size);
    boardSize.classSize = e.currentTarget.dataset.classSize;
    // debugger;

    this.setState({boardSize})
  }

  handleSliderSpeed = (e) =>{
    console.log("handleSliderSpeed e", e.currentTarget.value);
    let sliderSpeedValue = parseInt(e.currentTarget.value);

    this.setState({sliderSpeedValue });

  }

  handleAddGroupCells(e){
    console.log(e);
    let gliders = Object.assign({}, this.state.gliders); 
    const nameOfGlider = e.target.name;
    gliders[nameOfGlider] = !gliders[nameOfGlider];
    const keysArray = Object.keys(this.state.gliders);
  
    let alreadyChangedIndex = keysArray.findIndex(ele =>{
        return ele === nameOfGlider;
      })
   // use remaining keys to change gliders in state back to false except clicked one
    keysArray.splice(alreadyChangedIndex, 1);

    keysArray.forEach(ele =>{
      gliders[ele] = false;
    })

    this.setState({ gliders});
  }



  render() {
    const gliders = this.state.gliders;
    let pressedBtnClass = (function () {
                 
                            let pressedBtn = {};
                           for (const key in gliders) {
                             if (gliders.hasOwnProperty(key) && gliders[key] === true) {
                               pressedBtn[key] = 'pressed-btn';
                              // break;    
                            }
                            else{
                               pressedBtn[key] = "unpressed-btn";
                            }
                           }

                    return pressedBtn;
                    })();

                  

    let gameBoardClasses = [ "game-board", `${this.state.boardSize.classSize}`].join(' ');
    return (
      <div className="App">
     
        <main>
          <div className="top-info">
            <div className="title">Conway's Game Of Life</div>
            <div className="title"><p>things you can do</p></div>
            <div className="video-display">Click here for how it works 
            <div>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/E8kUJL04ELA" 
                frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>

            </div>
     
              
            </div>
         
          </div>
          <div className="stats">
            <Count generationsDisplay={this.state.generations} populationDisplay={this.state.population}/>
          </div>
            <div className="game-container">
              <div className="left-btn-container">
                <div className="game-control"> <ControlGameBtns stopGameLoop={this.stopGameLoop} runGame={this.handleRunGame} clearGame={this.handleClearGame} /></div>
              
                <div className="size-control"><SizeBtns changeSize={this.handleChangeSize} /></div>
              </div>
       
            <div className={`${gameBoardClasses}`}>
              <GameBoard boardArray={this.state.boardArray} squareClick={this.handleSquareClick} />
              </div>

            <div className="right-btn-container">
              <div className="slidecontainer">
                <GameSpeed sliderSpeedValue={this.state.sliderSpeedValue} sliderSpeed={this.handleSliderSpeed}/>
              </div>
              <div className="add-cells-container" onClick={this.handleAddGroupCells}><AddCellsBtns classNamePressed={pressedBtnClass}/></div>
            </div>
           
          </div>
        </main>
          
    
      </div>
    );
  }
}
// 
export default App;
