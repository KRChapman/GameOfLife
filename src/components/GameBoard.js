import React, { PureComponent } from 'react';


function GameBoard(props) {


    return (
     
        
          props.boardArray.map((element, index) =>{

            return <Square key={index} index={index} className={element.status} squareClick={props.squareClick}/>
          })
        

  
    )


}

class Square extends PureComponent {
  constructor(props){
    super(props)

    this._onClick = this._onClick.bind(this);
  }

  _onClick(e) {
    this.props.squareClick(this.props.index, e);
  }

  render(){
    let classArray = ['cell', `${this.props.className}`];
     classArray = classArray.join(' ');

    return (
      <div onClick={this._onClick} className={classArray}></div>
    )
  }

}

export default GameBoard;