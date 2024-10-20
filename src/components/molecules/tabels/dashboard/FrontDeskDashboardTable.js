import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Chip, IconButton } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import RescheduleAppointmentModal from "../patient/upcomingAppointmentTable/RescheduleAppointmentModal";
import CustomModal from "components/atoms/CustomModal";

const rows = [
  {
    type: "General",
    name: "Sam Smith",
    time: "23.04.22 at 9:00am",
  },
  {
    type: "Specialist",
    name: "Sam Smith",
    time: "23.04.22 at 9:00am",
  },
  {
    type: "General",
    name: "Sam Smith",
    time: "23.04.22 at 9:00am",
  },
  {
    type: "Specialist",
    name: "Sam Smith",
    time: "23.04.22 at 9:00am",
  },
];

export default function FrontDeskDashboardTable() {
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            {rows.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Chip
                    icon={
                      <FiberManualRecordIcon
                        sx={{ color: "inherit !important", fontSize: "10px" }}
                      />
                    }
                    label={row.type}
                    sx={{
                      backgroundColor:
                        row.type === "General"
                          ? "rgba(219, 30, 54, 0.1)"
                          : "rgba(43, 145, 191, 0.1)",
                      color: row.type === "General" ? "#DB1E36" : "#2B91BF",
                    }}
                  />
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: "bold" }}
                  align="left"
                >
                  {row.name}
                </TableCell>
                <TableCell align="left" sx={{ opacity: 0.7 }}>
                  {row.time}
                </TableCell>
                <TableCell align="left">
                  <Button
                    sx={{ fontSize: "0.75rem", color: "secondary.main" }}
                    variant="text"
                  >
                    {" "}
                    <CommentIcon sx={{ mr: 1, color: "inherit" }} /> view note
                  </Button>
                </TableCell>
                <TableCell align="left">
                  {" "}
                  <Button
                    sx={{ fontSize: "0.75rem" }}
                    startIcon={<NotificationsIcon sx={{ color: "white" }} />}
                    variant="contained"
                  >
                    Alert Doctor
                  </Button>
                  <Button
                    sx={{ fontSize: "11px", ml: 1 }}
                    variant="outlined"
                    onClick={toggleModal.bind(null, row)}
                  >
                    reschedule
                  </Button>
                </TableCell>
              </TableRow>
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
