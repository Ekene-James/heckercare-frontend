import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Chip, Stack, Typography } from "@mui/material";
import CustomModal from "components/atoms/CustomModal";
import CustomTextInput from "components/atoms/CustomTextInput";

const rows = [
  {
    destination: "Blood Glucose",
    recommender: "Sam Smith",
    department: "GOPD",
  },
  {
    destination: "Blood Glucose",
    recommender: "Sam Smith",
    department: "GOPD",
  },
  {
    destination: "Blood Glucose",
    recommender: "Sam Smith",
    department: "GOPD",
  },
];
const Row = ({ row, openModal }) => {
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row" align="left">
        {row.type === "ANOTHER" ? row.hospital : "Ward"}
      </TableCell>
      <TableCell align="left">{row.doctor || "-"}</TableCell>
      <TableCell align="left">{row.speciality || "-"}</TableCell>

      <TableCell align="left">
        <Button
          variant="text"
          color="secondary"
          sx={{ textDecoration: "underline", fontSize: "12px" }}
          onClick={() => openModal(row.remark)}
        >
          View
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default function RecommendationTable({ data, fromSummary }) {
  const [note, setnote] = React.useState("");
  const modalRef = React.useRef(null);
  const openModal = (item) => {
    setnote(item);
    modalRef?.current?.handleToggle();
  };

  return (
    <>
      {!data?.length ? (
        <Paper sx={{ p: 2 }}>
          <Typography>No data</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow
                sx={{ backgroundColor: !fromSummary ? "background.light" : "" }}
              >
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Destination
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Doctor
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Speciality
                </TableCell>

                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Notes
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, i) => (
                <Row key={row._id} row={row} openModal={openModal} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          minHeight: "35vh !important",
          minWidth: {
            xs: "80vw !important",
            sm: "40vw !important",
          },
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h5">Remark</Typography>
          <CustomTextInput
            title=""
            value={note}
            disabled="true"
            readOnly
            placeholder="Remark"
            multiline
          />
        </Stack>
      </CustomModal>
    </>
  );
}
