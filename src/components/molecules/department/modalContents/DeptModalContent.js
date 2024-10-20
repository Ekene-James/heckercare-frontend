import AssignStaff from "components/molecules/department/modalContents/AssignStaff";
import Delete from "components/molecules/department/modalContents/Delete";

import React from "react";
import AssignStaffToClinic from "./AssignStaffToClinic";
import AssignStaffToUnit from "./AssignStaffToUnit";

function DeptModalContent({
  modalType,
  msg,
  handleClose,
  department,
  handleDelete,
  deleteBtnLoading,
  refetch,
  unit,
  clinic,
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
    case "assign":
      view = (
        <AssignStaff
          handleClose={handleClose}
          department={department}
          refetch={refetch}
        />
      );
      break;
    case "assign_to_unit":
      view = (
        <AssignStaffToUnit
          handleClose={handleClose}
          unit={unit}
          refetch={refetch}
        />
      );
      break;
    case "assign_to_clinic":
      view = (
        <AssignStaffToClinic
          handleClose={handleClose}
          clinic={clinic}
          refetch={refetch}
        />
      );
      break;

    default:
      <>Nothing Here</>;
      break;
  }
  return <>{view}</>;
}

export default DeptModalContent;
