import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

const Row = ({ row, deleteProduct }) => {
  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell align="left" sx={{ fontWeight: "bold" }}>
        {row.itemName}
      </TableCell>
      <TableCell align="left" sx={{ fontWeight: "bold" }}>
        {row?.availableQuantity}
      </TableCell>
      <TableCell align="left" sx={{ fontWeight: "bold" }}>
        {row?.unitCost}
      </TableCell>

      <TableCell align="left">
        <IconButton size="small" onClick={deleteProduct.bind(null, row)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default function VendorProductsTable({ data, deleteProduct }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ backgroundColor: "background.custom" }}>
          <TableRow>
            <TableCell align="left">Product Name</TableCell>
            <TableCell align="left">Stock Quantity</TableCell>
            <TableCell align="left">Unit Cost</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, i) => (
            <Row row={row} key={i} deleteProduct={deleteProduct} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
