import React from "react";
import AdjustShift from "./AdjustShift";
import AssignNewSchedule from "./AssignNewSchedule";

function ModalContainer({ view, handleClose }) {
  let display;
  switch (view) {
    case 0:
      display = <AdjustShift handleClose={handleClose} />;
      break;

    case 1:
      display = <AssignNewSchedule handleClose={handleClose} />;
      break;

    default:
      break;
  }
  return <>{display}</>;
}

export default ModalContainer;
