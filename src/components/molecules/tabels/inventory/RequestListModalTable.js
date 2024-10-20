import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Stack } from "@mui/system";
import CustomButton from "components/atoms/CustomButton";
import { Box } from "@mui/material";
import CustomModal from "components/atoms/CustomModal";
import DeclineRequestModal from "components/molecules/inventory/modalContent/overview/DeclineRequestModal";
import { toast } from "react-toastify";

const rows = [
  {
    date: "12th Aug, 2022 , 8:00am",
    quantity: "10",
    requester: "Smith Travis Greene",
  },
  {
    date: "12th Aug, 2022 , 8:00am",
    quantity: "10",
    requester: "Smith Travis Greene",
  },
  {
    date: "12th Aug, 2022 , 8:00am",
    quantity: "10",
    requester: "Smith Travis Greene",
  },
];

const Row = ({ row, i, toggleModal }) => {
  return (
    <TableRow
      sx={{
        "&:nth-of-type(odd)": {
          backgroundColor: "background.custom",
        },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell
        component="th"
        scope="row"
        align="left"
        sx={{ width: "50px", fontWeight: "bold" }}
      >
        {i + 1}
      </TableCell>
      <TableCell
        component="th"
        scope="row"
        align="left"
        sx={{ color: "primary.darkGrey" }}
      >
        {row.date}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.quantity}
      </TableCell>
      <TableCell
        align="left"
        sx={{ fontWeight: "bold", textDecoration: "underline" }}
      >
        {row.requester}
      </TableCell>
      <TableCell align="left">
        <Stack direction={"row"} spacing={1}>
          <CustomButton
            text="Grant"
            color="success"
            variant="outlined"
            // onClick={() => toast.success("Request Granted Successfully")}
          />
          <CustomButton
            text="Decline"
            color="error"
            variant="outlined"
            onClick={toggleModal.bind(this, row)}
          />
        </Stack>
      </TableCell>
    </TableRow>
  );
};
export default function RequestListModalTable() {
  const modalRef = React.useRef(null);
  const [requestDetails, setrequestDetails] = React.useState({});

  const toggleModal = (details) => {
    setrequestDetails(details);

    modalRef?.current?.handleToggle();
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="departments-inventory-table">
          <TableHead>
            <TableRow sx={{}}>
              <TableCell align="left" sx={{ width: "50px" }} />
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Date
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Quantity
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Requester
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <Row key={i} row={row} i={i} toggleModal={toggleModal} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          width: {
            xs: "95%",
            sm: "70%",
          },
        }}
        ariaLabel="inventory-overview-modal"
      >
        <DeclineRequestModal requestDetails={requestDetails} />
      </CustomModal>
    </>
  );
}
