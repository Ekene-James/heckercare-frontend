import React from "react";
import CreateItem from "./CreateItem";
import CreateVendor from "./CreateVendor";

function ModalParent({ modalType, closeModal }) {
  let view;
  switch (modalType) {
    case 0:
      view = <CreateItem closeModal={closeModal} />;
      break;
    case 1:
      view = <CreateVendor closeModal={closeModal} />;
      break;

    default:
      break;
  }
  return <>{view}</>;
}

export default ModalParent;
