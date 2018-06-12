import React from 'react';

function ControlGameBtns(props){

  return(
    <React.Fragment>
      <button id="run" onClick={props.runGame}>Run</button>
      <button onClick={props.stopGameLoop}>Pause</button>
      <button onClick={props.clearGame}>Clear</button>
    </React.Fragment>
  )
}

export default ControlGameBtns;