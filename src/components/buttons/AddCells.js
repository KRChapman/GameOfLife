import React from 'react';

function AddCellsBtns(props) {

  return (
    <div className="add-cells-container" onClick={props.addGroupCells}>
      <h5>Groups Of Cells:</h5>
      <button name="rightGlider" className={props.classNamePressed.rightGlider}>Right Glider</button>
      <button name="leftGlider" className={props.classNamePressed.leftGlider}>Left Glider</button>
    </div>
  )
}

export default AddCellsBtns;