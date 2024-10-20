import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function AccordionPrescriptionTable({ data }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "background.light" }}>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Drug Name
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Doctor-in-charge
            </TableCell>

            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Frequency
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Route of Admin
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Food Relation
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Duration
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Amount
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.items?.map((row, i) => (
            <TableRow
              key={i}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row" align="left" sx={{}}>
                {row.product.drugName}
              </TableCell>
              <TableCell component="th" scope="row" align="left">
                {data?.doctor?.fullName}
              </TableCell>

              <TableCell align="left">{row.frequency}</TableCell>
              <TableCell align="left">{row.routeOfAdmin}</TableCell>
              <TableCell align="left">{row.foodRelation}</TableCell>
              <TableCell align="left">{row.duration}</TableCell>
              <TableCell align="left">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
