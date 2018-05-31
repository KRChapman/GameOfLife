import React from 'react';

function ControlGameBtns(props){

  return(
    <React.Fragment>
      <button onClick={props.runGame}>Run</button>
      <button>Pause</button>
      <button onClick={props.clearGame}>Clear</button>
    </React.Fragment>
  )
}

export default ControlGameBtns;