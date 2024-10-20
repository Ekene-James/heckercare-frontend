import React from "react";
import CreateInventory from "./CreateInventory";
import RequestUsage from "./RequestUsage";

function OverviewModalContainer({ modalView, requestDetails }) {
  let view;
  switch (modalView) {
    case 0:
      view = <CreateInventory />;
      break;
    case 1:
      view = <RequestUsage requestDetails={requestDetails} />;
      break;

    default:
      break;
  }
  return <>{view}</>;
}

export default OverviewModalContainer;
