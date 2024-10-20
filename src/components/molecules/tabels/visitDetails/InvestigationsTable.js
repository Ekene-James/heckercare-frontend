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
import ResultDetails from "components/molecules/patient/singlePatient/investigationsSubComponent/ResultDetails";

const Row = ({ row, toggleModal, toggleModal1 }) => {
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
      <TableCell align="left">
        <Button
          variant="text"
          color="secondary"
          sx={{ textDecoration: "underline", fontSize: "12px" }}
          onClick={() => toggleModal1(row)}
        >
          View Result
        </Button>
      </TableCell>
    </TableRow>
  );
};
const MainTable = () => {
  return;
};

export default function InvestigationsTable({ data, fromSummary = false }) {
  const [note, setnote] = React.useState("");
  const [result, setresult] = React.useState({});
  const modalRef = React.useRef(null);
  const modalRef1 = React.useRef(null);
  const toggleModal = (item) => {
    setnote(item);
    modalRef?.current?.handleToggle();
  };
  const toggleModal1 = (item) => {
    setresult(item);
    modalRef1?.current?.handleToggle();
  };
  // console.log(data);
  const isEmpty = () => {
    return data.every(
      (d) => !d?.["investigation"] || !d?.["investigation"]?.length
    );
  };
  const formattedData = data.filter(
    (d) => d?.["investigation"] && d?.["investigation"]?.length
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
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Results
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formattedData?.map((d) =>
                d?.investigation.map((row) => (
                  <Row
                    key={row._id}
                    row={row}
                    toggleModal={toggleModal}
                    toggleModal1={toggleModal1}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        data.map((table) =>
          table?.investigation?.length ? (
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
                    <TableCell sx={{ fontWeight: "bold" }} align="left">
                      Results
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {table.investigation.map((row) => (
                    <Row
                      key={row._id}
                      row={row}
                      toggleModal={toggleModal}
                      toggleModal1={toggleModal1}
                    />
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

      <CustomModal
        ref={modalRef1}
        backdropSx={{
          marginTop: "0px !important",
        }}
        childrenContSx={{
          p: 2,
          width: {
            xs: "90%",
            sm: "60vw",
          },
        }}
        t
      >
        <ResultDetails data={result} from={"lab"} />
      </CustomModal>
    </>
  );
}
