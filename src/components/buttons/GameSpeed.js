import React, { Component } from 'react';

class GameSpeed extends Component {

    constructor(props) {
      super(props);
      this.state = { 
        sliderSpeedValue: 93
       }
    }

    render() { 
      return ( 
        <div className="slidecontainer">
          <input onChange={(e) => 
            {
              let sliderSpeedValue = parseInt(e.currentTarget.value, 10);
              this.setState({ sliderSpeedValue  });
              this.props.sliderSpeed(this.state.sliderSpeedValue)
              
              }} type="range" min="50" max="99" value={this.state.sliderSpeedValue} className="slider" id="myRange" />
          <h5 className='fast-text'>Sim Speed:</h5>
          <p className='fast-text'>ludicrous</p>
          <p className='slow-text'>Slow</p>
        </div>
       )
    }
  }


export default GameSpeed;