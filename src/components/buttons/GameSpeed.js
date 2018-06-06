import React from 'react';

function GameSpeed(props) {

  return (
    <React.Fragment>
    
      <input onChange={props.sliderSpeed} type="range" min="1" max="100" value={props.sliderSpeedValue} className="slider" id="myRange" />
      <h5 className='fast-text'>Sim Speed:</h5>
      <p className='fast-text'>ludicrous</p>
      <p className='slow-text'>Slow</p>
    </React.Fragment>
  )
}

export default GameSpeed;