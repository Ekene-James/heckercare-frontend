import React from "react";
import Remove from "./Remove";
import Transfer from "./Transfer";

function ModalContent({
  type,
  handleClose,
  wardDetails,
  bedDetails,
  refetchWard,
}) {
  let view;
  switch (type) {
    case "transfer":
      view = (
        <Transfer
          handleClose={handleClose}
          wardDetails={wardDetails}
          refetchWard={refetchWard}
          bedDetails={bedDetails}
        />
      );
      break;
    case "remove":
      view = (
        <Remove
          handleClose={handleClose}
          bedDetails={bedDetails}
          refetchWard={refetchWard}
          wardDetails={wardDetails}
        />
      );
      break;

    default:
      break;
  }
  return <>{view}</>;
}

export default ModalContent;
