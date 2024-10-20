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

const Row = ({ row, toggleModal }) => {
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row" align="left">
        {row.test.testType}
      </TableCell>
      <TableCell align="left">{row.test.testName}</TableCell>
      <TableCell align="left">{row.doctor.fullName}</TableCell>

      <TableCell align="left">
        <Button
          variant="text"
          color="secondary"
          sx={{ textDecoration: "underline", fontSize: "12px" }}
          onClick={() => toggleModal(row.note)}
        >
          View
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default function InvestigationsTable({ data, fromSummary = false }) {
  const [note, setnote] = React.useState("");
  const modalRef = React.useRef(null);
  const toggleModal = (item) => {
    setnote(item);
    modalRef?.current?.handleToggle();
  };
  const isEmpty = () => {
    return data.every((d) => !d?.["radiology"] || !d?.["radiology"]?.length);
  };

  const formattedData = data.filter(
    (d) => d?.["radiology"] && d?.["radiology"]?.length
  );
  return (
    <>
      {isEmpty() ? (
        <Paper sx={{ p: 2 }}>
          <Typography>No data</Typography>
        </Paper>
      ) : fromSummary ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: !fromSummary ? "background.light" : "",
                }}
              >
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Test Type
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Test Name
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
              {formattedData?.map((d) =>
                d?.investigation.map((row) => (
                  <Row key={row._id} row={row} toggleModal={toggleModal} />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        data?.map((table) =>
          table?.radiology?.length ? (
            <TableContainer key={table._id} component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: !fromSummary ? "background.light" : "",
                    }}
                  >
                    <TableCell sx={{ fontWeight: "bold" }} align="left">
                      Test Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="left">
                      Test Name
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
                  {table.radiology.map((row) => (
                    <Row key={row._id} row={row} toggleModal={toggleModal} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null
        )
      )}
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          minHeight: "30vh !important",
          minWidth: "25vw !important",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h5">Note</Typography>
          <Typography>{note}</Typography>
        </Stack>
      </CustomModal>
    </>
  );
}
