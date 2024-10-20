import React from "react";

import AssignStaffToWard from "./AssignStaffToWard";
import DeleteStaffsFromWard from "./DeleteStaffsFromWard";

function StaffWardModalParent({
  modalType,
  msg,
  handleClose,
  wardId,
  handleDelete,
  deleteBtnLoading,
  refetch,
  staffs,
}) {
  let view;
  switch (modalType) {
    case "remove":
      view = (
        <DeleteStaffsFromWard
          msg={msg}
          handleClose={handleClose}
          handleDelete={handleDelete}
          deleteBtnLoading={deleteBtnLoading}
        />
      );
      break;
    case "assign":
      view = (
        <AssignStaffToWard
          handleClose={handleClose}
          wardId={wardId}
          refetch={refetch}
          staffs={staffs}
        />
      );
      break;

    default:
      <>Nothing Here</>;
      break;
  }
  return <>{view}</>;
}

export default StaffWardModalParent;
