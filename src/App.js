import React, { Component } from 'react';
import ControlGameBtns from './components/buttons/controlGameBtns.js'
import GameBoard from './components/GameBoard';
import SizeBtns from './components/buttons/SizeBtns';
import GameSpeed from './components/buttons/GameSpeed';
import AddCellsBtns from './components/buttons/AddCells';
import Count from './components/buttons/count';
import { modulo, setXandY, countLivingCells, cellModifiers } from './helpers/helpers'
import VideoDisplay from './components/videoDisplay.js';
import InfoBtns from './components/buttons/infoBtns.js';

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
      sliderSpeedValue: 93,
      generations: 0,
      population: 0,
      videoShow: false,
      textShow: false,
      density: 115
    }

    this.handleRunGame = this.handleRunGame.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.handleClearGame = this.handleClearGame.bind(this);
    this.handleAddGroupCells = this.handleAddGroupCells.bind(this);
    this.showVideo = this.showVideo.bind(this);
    this.showText = this.showText.bind(this);
  }

  componentDidMount(){
    let size = this.state.boardSize.size * this.state.boardSize.size;
    let boardArray = this.createBoard(size);
    this.setState({boardArray})
  }

  componentDidUpdate(prevProps, prevState){
    if(this.state.boardSize.size !== prevState.boardSize.size){
      let size = this.state.boardSize.size * this.state.boardSize.size;
      let boardArray = this.createBoard(size);
      this.setState({ boardArray });
    }

    if(this.state.boardArray !== prevState.boardArray){
      const boardArray = this.state.boardArray
      const population = countLivingCells(boardArray);
      this.setState({ population})
    }

  }

  shouldComponentUpdate(nextProps, nextState){
    return nextState.boardArray !== this.state.boardArray || this.state.boardSize.size !== nextState.boardSize.size || this.state.sliderSpeed !== nextState.sliderSpeed
    || this.state.textShow !== nextState.textShow || this.state.videoShow !== nextState.videoShow || this.state.gliders !== nextState.gliders
 
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
    const max = 10000,
          timeMultiplier = 100,
          offSet = 499;

    const randomInterval = (() => {
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
          let animationId =  requestAnimationFrame(tick);
        
          this.setState({ animationId });
        };
        requestAnimationFrame(tick);
      };
    })();
    if (typeof e === 'object'){
      randomInterval(() => this.handleRunGame(), max);
    }

  }

  gameAlgo(){
    let rowSize = this.state.boardSize.size;
    let boardArray = this.state.boardArray.slice();
   
    const arrayToCount = aliveCellsCountNeighbors(boardArray, cellModifiers.cellSearchModifiers);
    // count how many times a cell touches a neighbor alive or dead cell
    const occurrences = arrayToCount.reduce(function (obj, item) {
      let stringObj = JSON.stringify(item);

      obj[stringObj] = (obj[stringObj] || 0) + 1;
      return obj;
    }, {});

    this.setState(currentState =>{

      for (let prop in occurrences) {
        let positionObj = JSON.parse(prop);
        let count = occurrences[prop];
        let cellStatus = changeStatus(count, boardArray, positionObj.index)
        if (cellStatus != null) {

          boardArray[positionObj.index] = Object.assign({}, boardArray[positionObj.index], { status: cellStatus} )

        }
      }

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
    let density = this.state.density;
    const blockIndexes = randomIndexes(density, sizeOfOneRow);
    const addCellsArray = addCells(blockIndexes, sizeOfOneRow);

    const boardArray = [...Array(totalSize)].map((e, i ) => {
      let positionTwo = setXandY(i, sizeOfOneRow)

      let cellObj = { status: 'dead', position: i, positionTwo };

      return cellObj;
    });

    addCellsArray.forEach((ele,i) =>{
      boardArray[ele.index].status = 'alive';
    })

    function addCells(blockIndexes, rowSize){
      let arrayToReturn = [];
      blockIndexes.forEach(ele =>{

        let indexArray = cellModifiers.cellSearchModifiers.map((cellSearch, index) =>{
          let eleXandY = setXandY(ele, rowSize);
          let newY = eleXandY.y + cellSearch.y;
          let newX = eleXandY.x + cellSearch.x;
          newY = modulo(newY, rowSize) * rowSize;
          //javascripts % is just a remainder operator and does not wrap around with negative numbers
          // this function wraps the x and y around the number line for size of row for example -1 wraps to end
          newX = modulo(newX, rowSize);
          index = newY + newX;
          return { index: index};
        })

        arrayToReturn = [...arrayToReturn, ...indexArray];
       })
      return arrayToReturn;
     }

    function randomIndexes(density, size, indexArray = []){
       let randomNumber = Math.floor(Math.random() * (size * size));

       if (indexArray.length <= density){
         indexArray.push(randomNumber);
         randomIndexes(density, size, indexArray);

       }
      return indexArray;

     }

    return boardArray;
  }


  handleSquareClick(index, event){
    let gliders = this.state.gliders,
        rowSize = this.state.boardSize.size,
        newArray,
        moreThanOneChange;

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
     let status = copyArray[index].status === 'alive' ? 'dead' : 'alive';

      copyArray[index] = { ...copyArray[index], ...{ status } };
      return copyArray;
    }
    function gliderClick(index, prop, copyArray) {

      let groupCellsArray = cellModifiers.gliderPaterns[prop].map(ele => {
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
    let boardSize = Object.assign({}, this.state.boardSize);
    boardSize.size = parseInt(e.currentTarget.dataset.size, 10);
    boardSize.classSize = e.currentTarget.dataset.classSize;

    this.setState({boardSize})
  }

  handleSliderSpeed = (sliderSpeedValue) =>{
    this.setState({ sliderSpeedValue });
  }

  handleAddGroupCells(e){
    let gliders = Object.assign({}, this.state.gliders);
    const nameOfGlider = e.target.name;
    gliders[nameOfGlider] = !gliders[nameOfGlider];

    const keysArray = Object.keys(this.state.gliders);

    let alreadyChangedIndex = keysArray.findIndex(ele =>{
        return ele === nameOfGlider;
      })
    keysArray.splice(alreadyChangedIndex, 1);
    keysArray.forEach(ele =>{
      gliders[ele] = false;
    })

    this.setState({ gliders});
  }

  showVideo(e){
    e.stopPropagation();

    let videoShow = !this.state.videoShow;
    this.setState({videoShow})
  }

  showText(e){
    let textShow = !this.state.textShow;
    this.setState({textShow});
  }

  render() {
      const gliders = this.state.gliders;
      const videoShow = this.state.videoShow ? <VideoDisplay /> : null;
      const textShow = this.state.textShow ? <div className="info"><p>Click to change cell status. 
        Birth 3 neigbors. Death from 1 neighbor (endangerd) or 4 (overcrowding). Glide is preset pattern.</p></div> : null;

      let gameBoardClasses = [ "game-board", `${this.state.boardSize.classSize}`].join(' ');

      let pressedBtnClass = {};
      for (const key in gliders) {
        if (gliders.hasOwnProperty(key) && gliders[key] === true) {
          pressedBtnClass[key] = 'pressed-btn';

        }
        else{
          pressedBtnClass[key] = "unpressed-btn";
        }
      }

    return (
      <div className="App">
        <main onClick={() => this.setState({ videoShow: false })}>
          <div className="title-info">
            <div className="title"><h1 className="main-title">Conway's Game Of Life</h1></div>
            <InfoBtns video={this.showVideo} texts={this.showText}/>
            {textShow}
          </div >
           {videoShow}
          <div className="stats">
            <Count generationsDisplay={this.state.generations} populationDisplay={this.state.population}/>
          </div>
          <div className="game-container" >
              <div className="left-btn-container">
                <div className="game-control">
                  <ControlGameBtns stopGameLoop={this.stopGameLoop} runGame={this.handleRunGame}
                  clearGame={this.handleClearGame}/>
                </div>
                <SizeBtns changeSize={this.handleChangeSize} />
              </div>
            <div className={`${gameBoardClasses}`}>
              <GameBoard boardArray={this.state.boardArray} squareClick={this.handleSquareClick} />
            </div>
            <div className="right-btn-container">
              <GameSpeed sliderSpeedValue={this.state.sliderSpeedValue} sliderSpeed={this.handleSliderSpeed}/>
              <AddCellsBtns addGroupCells={this.handleAddGroupCells} classNamePressed={pressedBtnClass}/>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
