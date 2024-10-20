import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import { Link, useParams } from "react-router-dom";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_UPCOMING_APPOINTMENTS_BY_PATIENT } from "utils/reactQueryKeys";
import moment from "moment";
import CustomModal from "components/atoms/CustomModal";
import RescheduleAppointmentModal from "./RescheduleAppointmentModal";

const Row = ({ row, toggleModal }) => {
  const rndInt = Math.floor(Math.random() * 4);
  const colorArr = ["red", "blue", "green", "grey"];

  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell
        component="th"
        scope="row"
        align="left"
        sx={{
          position: "relative",
          fontSize: "12px",
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: "10%",

            height: "80%",
            width: "5px",
            background: colorArr[rndInt],
            borderBottomLeftRadius: "5px",
            borderTopLeftRadius: "5px",
          },
        }}
      >
        {moment(row.startDateTime).format("MMMM Do YYYY") ===
        moment(row.endDateTime).format("MMMM Do YYYY")
          ? moment(row.startDateTime).format("MMMM Do YYYY")
          : `${moment(row.startDateTime).format("MMMM Do YYYY")} - ${moment(
              row.endDateTime
            ).format("MMMM Do YYYY")}`}
      </TableCell>

      <TableCell
        component="th"
        scope="row"
        align="left"
        sx={{ fontSize: "12px" }}
      >
        {row.startTime} - {row.endTime}
      </TableCell>

      <TableCell align="left" sx={{ fontSize: "12px" }}>
        {row?.doctor?.fullName}
      </TableCell>
      <TableCell
        align="left"
        sx={{
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "row",
        }}
      >
        {/* <Button
          variant="contained"
          color="secondary"
          sx={{ fontSize: "0.7rem" }}
        >
          View
        </Button> */}
        <Button
          variant="outlined"
          color="secondary"
          sx={{ ml: 1, fontSize: "0.7rem" }}
          onClick={toggleModal.bind(null, row)}
        >
          Reschedule
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default function UpcomingAppointmentTable({ data, currentPage }) {
  const modalRef = React.useRef(null);
  const [modalContent, setmodalContent] = React.useState({});

  const toggleModal = (item) => {
    setmodalContent(item);
    modalRef?.current?.handleToggle();
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Date
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Duration
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Doctor
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <Row key={row._id} row={row} toggleModal={toggleModal} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          height: "fit-content !important",
          // width: "100% !important",
        }}
      >
        <RescheduleAppointmentModal
          modalContent={modalContent}
          closeModal={() => modalRef?.current?.handleToggle()}
          currentPage={currentPage}
        />
      </CustomModal>
    </>
  );
}
