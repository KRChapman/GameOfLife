import React from 'react';

function InfoBtns(props) {

  return (

  <React.Fragment>
    <button className="video-display" onClick={props.video}>Video Explanation</button>
    <button className="text-display" onClick={props.texts}>Rules</button>

    </React.Fragment >


  )
}
/* <div className={"video-modal"}> */
export default InfoBtns;