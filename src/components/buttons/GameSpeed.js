import React from 'react';

function GameSpeed(props) {

  return (
    <React.Fragment>
    
        <input type="range" min="1" max="100" value="50" className="slider" id="myRange" />
     
    </React.Fragment>
  )
}

export default GameSpeed;