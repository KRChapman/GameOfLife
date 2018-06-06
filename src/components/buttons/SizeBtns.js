import React from 'react';

function ControlGameBtns(props) {

  return (
    <React.Fragment>
      <button onClick={props.changeSize} data-size="40" data-class-size="small-board">40 x 40</button>
      <button onClick={props.changeSize} data-size="50" data-class-size="medium-board">50 x 50</button>
      <button onClick={props.changeSize} data-size="60" data-class-size="large-board">60 x 60</button>
    </React.Fragment>
  )
}

export default ControlGameBtns;