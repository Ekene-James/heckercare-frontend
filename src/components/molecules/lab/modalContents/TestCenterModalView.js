import React from "react";
import CreateTestModal from "./CreateTestModal";
import DocsNoteModal from "./DocsNoteModal";
import InputDataModalView from "./InputDataModalView";
import StartTestModal from "./StartTestModal";

function TestCenterModalView({
  view,
  handleClose,
  modalData,
  handleCreateTest,
  refetchTests,
}) {
  let display;
  switch (view) {
    case 0:
      display = (
        <CreateTestModal
          handleClose={handleClose}
          refetchTests={refetchTests}
        />
      );
      break;
    case 1:
      display = <DocsNoteModal handleClose={handleClose} data={modalData} />;
      break;
    case 2:
      display = (
        <InputDataModalView handleClose={handleClose} modalData={modalData} />
      );
      break;
    case 3:
      display = <StartTestModal handleClose={handleClose} />;
      break;

    default:
      break;
  }
  return <>{display}</>;
}

export default TestCenterModalView;
