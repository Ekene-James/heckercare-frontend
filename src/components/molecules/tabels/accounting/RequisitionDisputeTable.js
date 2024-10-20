import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import moment from "moment";

import CustomButton from "components/atoms/CustomButton";

import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import CheckIcon from "@mui/icons-material/Check";

import CloseIcon from "@mui/icons-material/Close";

import CustomModal from "components/atoms/CustomModal";
import ViewRequisitionDisputeModal from "components/molecules/accounting/modal/modalContents/ViewRequisitionDisputeModal";

const Row = ({ openModal, row, i }) => {
  let status;
  if (row?.status === "PENDING") {
    status = (
      <CustomButton
        variant="text"
        startIcon={<RemoveCircleOutlineIcon />}
        color="secondary"
        text="Pending"
        sx={{ pointerEvents: "none" }}
      />
    );
  } else if (row.status === "RESOLVED") {
    status = (
      <CustomButton
        variant="text"
        startIcon={<CheckIcon />}
        color="success"
        text="Resolved"
        sx={{ pointerEvents: "none" }}
      />
    );
  } else {
    status = (
      <CustomButton
        variant="text"
        startIcon={<CloseIcon />}
        color="error"
        text="Rejected"
        sx={{ pointerEvents: "none" }}
      />
    );
  }

  return (
    <TableRow
      sx={{
        "&:nth-of-type(odd)": {
          backgroundColor: "background.custom",
        },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell component="th" scope="row" align="left" sx={{ width: "20px" }}>
        {i + 1}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.uniqueCode}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.requisition?.title}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.requisition?.vendorDetails?.vendorName}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.department}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {moment(new Date(row?.createdAt)).format("MMMM Do, YYYY")}
      </TableCell>

      <TableCell align="left">{status}</TableCell>
      <TableCell align="left">
        {row?.dateResolved
          ? moment(new Date(row?.dateResolved)).format("MMMM Do, YYYY")
          : "Not Resolved"}
      </TableCell>
      <TableCell align="right">
        <CustomButton
          text={"View"}
          variant="text"
          color="secondary"
          onClick={openModal.bind(null, row)}
        />
      </TableCell>
    </TableRow>
  );
};

export default function RequisitionDisputeTable({ data }) {
  const modalRef = React.useRef(null);

  const [requisitionDetail, setrequisitionDetail] = React.useState({});

  const openModal = (row) => {
    setrequisitionDetail(row);
    modalRef?.current?.handleToggle();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "70px" }}>
                S/N
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Dispute ID
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Requisition Title
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Vendor
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Department
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Date Initiated
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Date Resolved
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length
              ? data?.map((row, i) => (
                  <Row key={row?._id} row={row} i={i} openModal={openModal} />
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          m: "0px!important",
          height: "100%",
          width: {
            xs: "95%",
            sm: "50vw",
          },
        }}
      >
        <ViewRequisitionDisputeModal
          data={requisitionDetail}
          closeModal={() => modalRef?.current?.handleToggle()}
        />
      </CustomModal>
    </>
  );
}
