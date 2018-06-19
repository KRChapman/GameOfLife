import React from 'react';

function GameSpeed(props) {

  return (

      <div className="slidecontainer">
        <input onChange={props.sliderSpeed} type="range" min="50" max="95" value={props.sliderSpeedValue} className="slider" id="myRange" />
        <h5 className='fast-text'>Sim Speed:</h5>
        <p className='fast-text'>ludicrous</p>
        <p className='slow-text'>Slow</p>
      </div>

  )
}

export default GameSpeed;