import Delete from "components/molecules/department/modalContents/Delete";

import React from "react";
import TransferStaff from "./TransferStaff";

function StaffListModalParent({
  modalType,
  msg,
  handleClose,
  staffData,
  handleDelete,
  deleteBtnLoading,
  transferBtnLoading,
  deptData,
}) {
  let view;
  switch (modalType) {
    case "remove":
      view = (
        <Delete
          msg={msg}
          handleClose={handleClose}
          handleDelete={handleDelete}
          deleteBtnLoading={deleteBtnLoading}
        />
      );
      break;
    case "transfer":
      view = (
        <TransferStaff
          handleClose={handleClose}
          staffData={staffData}
          transferBtnLoading={transferBtnLoading}
          deptData={deptData}
        />
      );
      break;

    default:
      <>Nothing Here</>;
      break;
  }
  return <>{view}</>;
}

export default StaffListModalParent;
