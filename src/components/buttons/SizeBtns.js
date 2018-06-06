import React from 'react';

function ControlGameBtns(props) {

  return (
    <React.Fragment>
      <button onClick={props.changeSize} data-size="40">30 x 30</button>
      <button onClick={props.changeSize} data-size="50">40 x 40</button>
      <button onClick={props.changeSize} data-size="60">50 x 50</button>
    </React.Fragment>
  )
}

export default ControlGameBtns;