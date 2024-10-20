import React from "react";
import CraeteOrEditWard from "./CraeteOrEditWard";
import CreateClinic from "./CreateClinic";
import CreateUnit from "./CreateUnit";
import TransferPatient from "./TransferPatients";

function OverviewModalParent({
  handleClose,
  wardDetails,
  modalType,
  refetchWardOverview,
}) {
  let view;
  switch (modalType) {
    case 0:
      view = (
        <CraeteOrEditWard
          handleClose={handleClose}
          wardDetails={wardDetails}
          type="create"
          refetchWardOverview={refetchWardOverview}
        />
      );
      break;
    case 1:
      view = (
        <CraeteOrEditWard
          handleClose={handleClose}
          wardDetails={wardDetails}
          type="edit"
          refetchWardOverview={refetchWardOverview}
        />
      );
      break;
    case 2:
      view = <CreateClinic handleClose={handleClose} />;
      break;
    case 3:
      view = <CreateUnit handleClose={handleClose} />;
      break;
    case 4:
      view = (
        <TransferPatient
          handleClose={handleClose}
          refetchWardOverview={refetchWardOverview}
        />
      );
      break;

    default:
      <>Nothing Here</>;
      break;
  }
  return <>{view}</>;
}

export default OverviewModalParent;
