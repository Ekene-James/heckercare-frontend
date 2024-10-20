import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import CustomButton from "components/atoms/CustomButton";
import moment from "moment";
import CustomModal from "components/atoms/CustomModal";
import TestResultModal from "components/molecules/radio/modalContents/TestResultModal";

const Row = ({ row, i, openModal }) => {
  return (
    <TableRow
      sx={{
        "&:nth-of-type(odd)": {
          backgroundColor: "background.custom",
        },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell align="left">{i + 1}</TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {moment(row.createdAt).format("MMMM Do, YYYY")}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.uniqueCode}
      </TableCell>

      <TableCell align="left">{`${row.patient.firstName} ${row.patient.lastName}`}</TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.patient.age}/{row.patient.gender}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.doctor.fullName}
      </TableCell>
      <TableCell align="left">
        <CustomButton
          text={"View Result"}
          variant="containedBrown"
          onClick={openModal.bind(this, row)}
        />
      </TableCell>
    </TableRow>
  );
};

export default function LabHistoryTable({ data }) {
  const modalRef = React.useRef(null);
  const [result, setresult] = React.useState({});
  const toggleModal = (data) => {
    setresult(data);
    modalRef?.current?.handleToggle();
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                S/N
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Date
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Unique ID
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Patient Name
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Age/Gender
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Test By
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Result
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <Row key={i} row={row} i={i} openModal={toggleModal} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomModal
        ref={modalRef}
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
      >
        <TestResultModal data={result} handleClose={toggleModal} />
      </CustomModal>
    </>
  );
}
