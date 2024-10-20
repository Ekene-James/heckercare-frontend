import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import React from "react";

const Row = () => {
  return (
    <TableRow>
      <TableCell
        align="left"
        sx={{
          borderRadius: "10px",
          p: 0,
          m: 0,
          width: "30%",
          borderBottom: "none !important",
        }}
      >
        <Typography>Paracetamol</Typography>
      </TableCell>
      <TableCell>Edit</TableCell>
      <TableCell>Delete</TableCell>
    </TableRow>
  );
};

export default function DrugRequestTable({
  rows = [],
  handleRemove,
  formState,
}) {
  return (
    <TableContainer component={""}>
      <Table
        sx={{
          minWidth: 50,
          borderSpacing: "10px",
          borderCollapse: "separate",
          borderColor: "transparent",
        }}
        aria-label="drug request table"
      >
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ borderBottom: "none" }} />
            <TableCell align="left" sx={{ borderBottom: "none" }} />
            <TableCell align="left" sx={{ borderBottom: "none" }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => {
            <Row
              key={row.id}
              row={row}
              i={i}
              handleRemove={handleRemove}
              formState={formState}
            />;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
