import React from "react";
import StartedTestModal from "./StartedTestModal";
import StartTestModal from "./StartTestModal";
import TestResultModal from "./TestResultModal";

function DashboardModalView({ view, handleClose }) {
  let display;
  switch (view) {
    case 0:
      display = <StartedTestModal handleClose={handleClose} />;
      break;

    case 1:
      display = <TestResultModal handleClose={handleClose} />;
      break;

    default:
      break;
  }
  return <>{display}</>;
}

export default DashboardModalView;
