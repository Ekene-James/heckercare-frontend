import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useNavigate } from "react-router-dom";
import CustomDotMenu from "components/atoms/CustomDotMenu";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import moment from "moment";
import { Typography } from "@mui/material";

const Row = ({ row, i, handleTransferPatient, handleRemovePatient }) => {
  let admisionDate = new Date();
  if (row?.admisionDate?.length) {
    admisionDate = row?.admisionDate[0];
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
      <TableCell align="left">{i + 1}</TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.bedNumber || 0}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {`${row.firstName} ${row.lastName}`}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.gender}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.age}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {moment(admisionDate).format("MMMM Do YYYY")}
      </TableCell>

      <TableCell align="left">
        {" "}
        <CustomDotMenu
          items={[
            {
              caption: "Transfer Patient",
              icon: <PersonOutlineOutlinedIcon sx={{ mr: 1 }} />,
              action: handleTransferPatient.bind(this, row),
            },

            {
              caption: "Remove Patient",
              icon: <LogoutIcon sx={{ mr: 1 }} />,
              action: handleRemovePatient.bind(this, row),
            },
          ]}
        />{" "}
      </TableCell>
    </TableRow>
  );
};

export default function WardTable({
  handleRemovePatient,
  handleTransferPatient,
  data = [],
}) {
  return (
    <>
      {data.length ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell />

                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  Bed Number
                </TableCell>

                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  Patient Name
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  Sex
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  Age
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  Date Admitted
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, i) => (
                <Row
                  key={i}
                  row={row}
                  i={i}
                  handleTransferPatient={handleTransferPatient}
                  handleRemovePatient={handleRemovePatient}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="heading">No Item to display</Typography>
      )}
    </>
  );
}
