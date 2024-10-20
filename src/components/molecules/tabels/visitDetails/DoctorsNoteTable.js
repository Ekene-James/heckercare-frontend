import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Chip, Typography } from "@mui/material";
import CustomModal from "components/atoms/CustomModal";
import { grey } from "@mui/material/colors";
import ModalContent from "components/molecules/visitDetailsTab/ModalContent";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";

const rows = [
  {
    diagnosis: "Malaria",
    doctor: "Sam Smith",
    department: "GOPD",
  },
  {
    diagnosis: "Malaria",
    doctor: "Sam Frodo",
    department: "Hametology",
  },
  {
    diagnosis: "Malaria",
    doctor: "Janet Doe",
    department: "Orthopaedic",
  },
];
const Row = ({ row, handleClick }) => {
  // let rgb;
  // if (row.department === "GOPD") {
  //   rgb = "219, 30, 54";
  // } else if (row.department === "Hametology") {
  //   rgb = "0, 132, 53";
  // } else {
  //   rgb = "255, 129, 96";
  // }
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row" align="left">
        {row?.topic}
      </TableCell>
      <TableCell align="left">{row?.noteBy?.fullName}</TableCell>
      {/* <TableCell align="left">
        <Chip
          label={row.department}
          sx={{
            backgroundColor: `rgba(${rgb},0.1)`,
            color: `rgba(${rgb},1)`,
            fontWeight: "bold",
          }}
        />
      </TableCell> */}
      <TableCell align="left">
        <Button
          variant="text"
          color="secondary"
          sx={{ textDecoration: "underline", fontSize: "12px" }}
          onClick={() => handleClick(row)}
        >
          View
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default function DoctorsNoteTable({ data, fromSummary = false }) {
  const modalRef = React.useRef(null);
  const [content, setcontent] = React.useState();

  const handleClick = (row) => {
    setcontent(row);
    modalRef?.current?.handleToggle();
  };

  //if there is row.topic in the assessmentLog array, then its a doctors note, else its just a normal message
  // since assesment log contains both doctors note and and conversations in that visit
  const notesWithTopic = data?.length
    ? data.filter((note) => !!note?.topic?.length)
    : [];

  return (
    <>
      {notesWithTopic.length ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow
                sx={{ backgroundColor: !fromSummary ? "background.light" : "" }}
              >
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Diagnosis
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Doctor
                </TableCell>

                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Notes
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notesWithTopic?.map((row) => (
                <Row key={row._id} row={row} handleClick={handleClick} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 2 }}>
          <Typography>No data</Typography>
        </Paper>
      )}

      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 4,
          backgroundColor: grey[200],
          width: {
            xs: "95%",
            sm: "60vw",
            lg: "50vw",
          },
        }}
      >
        <ModalContent
          content={content}
          handleClose={() => modalRef?.current?.handleToggle()}
        />
      </CustomModal>
    </>
  );
}
