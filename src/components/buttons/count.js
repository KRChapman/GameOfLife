import React from 'react';

function Count(props) {

  return (
    <React.Fragment>
      <p className="generations">Generations: <span>{props.generationsDisplay}</span></p>
      <span className="divide">|</span>
      <p className="population">Population: <span>{props.populationDisplay}</span></p>
    </React.Fragment>
  )
}

export default Count;