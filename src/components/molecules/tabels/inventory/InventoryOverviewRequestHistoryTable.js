import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Stack } from "@mui/material";

import CustomButton from "components/atoms/CustomButton";

import CustomCheckbox from "components/atoms/CustomCheckbox";
import RequestApprovalModal from "components/molecules/inventory/modalContent/overview/RequestApprovalModal";
import CustomModal from "components/atoms/CustomModal";

import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const Row = ({
  row,
  selectedItems,
  handleSelect,
  handleUnSelect,
  toggleModal,
}) => {
  const autoCheck = selectedItems.some((item) => item._id === row._id);

  let status;
  if (row.approval === "APPROVED") {
    status = (
      <Stack
        direction="row"
        spacing={1}
        sx={{ color: "blue" }}
        alignItems="center"
      >
        <CheckCircleOutlinedIcon sx={{ fontSize: "18px" }} />
        {row.approval}
      </Stack>
    );
  } else if (row.approval === "FULFILLED") {
    status = (
      <Stack direction="row" spacing={1} sx={{ color: "primary.success" }}>
        <DoneOutlinedIcon sx={{ fontSize: "18px" }} />
        {row.approval}
      </Stack>
    );
  } else if (row.approval === "REJECTED") {
    status = (
      <Stack direction="row" spacing={1} sx={{ color: "primary.error" }}>
        <CloseOutlinedIcon sx={{ fontSize: "18px" }} />
        {row.approval}
      </Stack>
    );
  } else {
    status = (
      <Stack direction="row" spacing={1} sx={{ color: "secondary.main" }}>
        <CheckCircleOutlinedIcon sx={{ fontSize: "18px" }} />
        PENDING
      </Stack>
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
      <TableCell component="th" scope="row" align="left" sx={{ width: "70px" }}>
        <CustomCheckbox
          onClick={(checkState) =>
            checkState ? handleSelect(row) : handleUnSelect(row)
          }
          autoCheck={autoCheck}
        />
      </TableCell>
      <TableCell component="th" scope="row" align="left" color="primary.main">
        {`${row.createdBy.firstName} ${row.createdBy.lastName}`}
      </TableCell>
      {/* <TableCell component="th" scope="row" align="left">
        {"Laboratory"}
      </TableCell> */}
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.departmentType}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {status}
      </TableCell>

      <TableCell
        align="left"
        sx={{
          color: "secondary.main",
          cursor: "pointer",
        }}
      >
        <CustomButton
          variant="text"
          color="secondary"
          text="View Request"
          // sx={{ border: "1px solid black", color: "primary.main" }}
          onClick={toggleModal?.bind(null, row)}
        />
      </TableCell>
    </TableRow>
  );
};
export default function InventoryOverviewRequestHistoryTable({
  data,
  checkBoxItems,
  setcheckBoxItems,
}) {
  const modalRef = React.useRef(null);

  const [inventoryItem, setInventoryItem] = React.useState({});

  const handleSelect = (item) => {
    const newState = [...checkBoxItems, item];
    setcheckBoxItems(newState);
  };
  const handleUnSelect = (item) => {
    const newState = checkBoxItems.filter(
      (selected) => selected._id !== item._id
    );
    setcheckBoxItems(newState);
  };
  const handleSelectAll = () => {
    setcheckBoxItems(data);
  };

  const handleUnSelectAll = () => {
    setcheckBoxItems([]);
  };

  const toggleModal = (item) => {
    setInventoryItem(item);
    modalRef?.current?.handleToggle();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="inventory-overview-table">
          <TableHead>
            <TableRow sx={{}}>
              <TableCell align="left" sx={{ width: "70px" }}>
                <CustomCheckbox
                  onClick={(checkState) =>
                    checkState ? handleSelectAll() : handleUnSelectAll()
                  }
                />
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Requester
              </TableCell>
              {/* <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Location
              </TableCell> */}

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Department
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
            {data?.length
              ? data.map((row, i) => (
                  <Row
                    key={row?._id}
                    row={row}
                    handleSelect={handleSelect}
                    handleUnSelect={handleUnSelect}
                    selectedItems={checkBoxItems}
                    toggleModal={toggleModal}
                  />
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          pt: 5,
          width: {
            xs: "95%",
            sm: "55vw",
          },
        }}
      >
        <RequestApprovalModal
          detail={inventoryItem}
          closeModal={() => modalRef?.current?.handleToggle()}
        />
      </CustomModal>
    </>
  );
}
