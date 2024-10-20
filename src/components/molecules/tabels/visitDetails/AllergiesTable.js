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
  let rgb;
  if (row.level === "HIGH") {
    rgb = "219, 30, 54";
  } else if (row.level === "MID") {
    rgb = "0, 132, 53";
  } else {
    rgb = "255, 129, 96";
  }

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row" align="left">
        {row.category}
      </TableCell>
      <TableCell align="left">{row.allergen}</TableCell>
      <TableCell align="left">
        <Chip
          label={row.level}
          sx={{
            backgroundColor: `rgba(${rgb},0.1)`,
            color: `rgba(${rgb},1)`,
            fontWeight: "bold",
          }}
        />
      </TableCell>
      <TableCell align="left">
        <Button
          variant="text"
          color="secondary"
          sx={{ textDecoration: "underline", fontSize: "12px" }}
          onClick={toggleModal.bind(null, row.reaction)}
        >
          View
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default function AllergiesTable({ data, fromSummary = false }) {
  const modalRef = React.useRef(null);
  const [reaction, setreaction] = React.useState("");
  const toggleModal = (reaction) => {
    setreaction(reaction);
    modalRef?.current?.handleToggle();
  };
  const isEmpty = () => {
    return data.every((d) => !d?.["allergies"] || !d?.["allergies"]?.length);
  };

  const formattedData = data.filter(
    (d) => d?.["allergies"] && d?.["allergies"]?.length
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
              <TableRow sx={{}}>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Category
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Allergen
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Level
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Reaction
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formattedData?.map((d) =>
                d?.allergies?.map((row) => (
                  <Row key={row.allergen} row={row} toggleModal={toggleModal} />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Stack>
          {data.map((d) =>
            d?.allergies && d.allergies.length ? (
              <React.Fragment key={d._id}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: !fromSummary
                            ? "background.light"
                            : "",
                        }}
                      >
                        <TableCell sx={{ fontWeight: "bold" }} align="left">
                          Category
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="left">
                          Allergen
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="left">
                          Level
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="left">
                          Reaction
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {d?.allergies?.map((row) => (
                        <Row
                          key={row.allergen}
                          row={row}
                          toggleModal={toggleModal}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </React.Fragment>
            ) : null
          )}
        </Stack>
      )}
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          pt: 4,
          // height: "fit-content !important",
          // width: "100% !important",
          minWidth: "40vw",
          minHeight: "30vh",
        }}
      >
        <Stack spacing={1}>
          <Typography variant="heading">Reaction:</Typography>
          <Typography>{reaction}</Typography>
        </Stack>
      </CustomModal>
    </>
  );
}
