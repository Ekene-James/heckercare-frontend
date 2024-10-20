import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Chip } from "@mui/material";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CustomButton from "components/atoms/CustomButton";

import CheckIcon from "@mui/icons-material/Check";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import ViewRequisitionModal from "pages/pharmacy/requisitionHistory/modalContents/viewRequisition/ViewRequisitionModal";
import RuleIcon from "@mui/icons-material/Rule";

const Row = ({ row, i, toggleModal }) => {
  let status;
  if (row.accountApproval === "PENDING") {
    status = (
      <Chip
        variant="outlined"
        icon={<RemoveCircleOutlineIcon />}
        color="secondary"
        label="Pending"
      />
    );
  } else if (
    row.accountApproval === "APPROVED" &&
    row.requisitionStatus === "PENDING"
  ) {
    status = (
      <Chip
        variant="outlined"
        icon={<CheckIcon />}
        color="success"
        label="Approved"
      />
    );
  } else if (
    row.accountApproval === "APPROVED" &&
    row.requisitionStatus === "INSPECTING"
  ) {
    status = (
      <Chip
        variant="outlined"
        icon={<RuleIcon />}
        color="warning"
        label="Inspecting"
      />
    );
  } else if (
    row.accountApproval === "APPROVED" &&
    row.requisitionStatus === "RESOLVED"
  ) {
    status = (
      <Chip
        variant="outlined"
        icon={<CheckIcon />}
        color="info"
        label="Resolved"
      />
    );
  } else if (
    row.accountApproval === "APPROVED" &&
    row.requisitionStatus === "FULFILLED"
  ) {
    status = (
      <Chip
        variant="outlined"
        icon={<PlaylistAddCheckIcon />}
        color="info"
        label="Fulfilled"
      />
    );
  } else if (
    row.accountApproval === "APPROVED" &&
    row.requisitionStatus === "DISPUTED"
  ) {
    status = (
      <Chip
        variant="outlined"
        icon={<DoNotDisturbAltIcon />}
        color="error"
        label="Disputed"
      />
    );
  }
  //  else if (row.accountApproval === "DECLINED") {
  //   // <Chip
  //   //   variant="outlined"
  //   //   icon={<DoNotDisturbAltIcon />}
  //   //   color="error"
  //   //   label="Declined"
  //   // />;
  // }
  else {
    status = (
      <Chip
        variant="outlined"
        icon={<DoNotDisturbAltIcon />}
        color="warning"
        label="No status"
      />
    );
  }
  return (
    <TableRow
      key={i}
      sx={{
        mt: 1,
        "&:nth-of-type(odd)": {
          backgroundColor: "background.custom",
        },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell component="th" scope="row">
        {i + 1}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.title}
      </TableCell>
      <TableCell align="center" sx={{ color: "primary.darkGrey" }}>
        {+row.cost.subTotalCost +
          +row.cost.shippingCost +
          (+row?.cost?.salesTax || 0)}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.requester.fullName}
      </TableCell>
      <TableCell align="center">
        {row.headApproval === "APPROVED" ? (
          <CheckBoxIcon color="success" />
        ) : row.headApproval === "PENDING" ? (
          <IndeterminateCheckBoxIcon sx={{ color: "primary.darkGrey" }} />
        ) : (
          <DisabledByDefaultIcon color="error" />
        )}
      </TableCell>
      <TableCell align="left">
        {row.accountApproval === "DECLINED" ? (
          <Chip
            variant="outlined"
            icon={<DoNotDisturbAltIcon />}
            color="error"
            label="Declined"
          />
        ) : (
          status
        )}
      </TableCell>
      <TableCell align="left">
        <CustomButton
          text="View"
          variant="text"
          color="secondary"
          onClick={toggleModal.bind(null, row)}
        />
      </TableCell>
    </TableRow>
  );
};

export default function RequisitionTable({ data }) {
  const modalRef = React.useRef(null);

  const [requisitionItem, setrequisitionItem] = React.useState(null);

  const toggleModal = (item) => {
    setrequisitionItem(item);
    modalRef?.current?.handleToggle();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                S/N
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Title
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Total Estimated Cost
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Requester
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Head’s Approval
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, i) => (
              <Row row={row} key={i} i={i} toggleModal={toggleModal} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomRightDrawer ref={modalRef} title="View Requisition">
        <ViewRequisitionModal
          detail={requisitionItem}
          closeModal={() => modalRef?.current?.handleToggle()}
        />
      </CustomRightDrawer>
    </>
  );
}
