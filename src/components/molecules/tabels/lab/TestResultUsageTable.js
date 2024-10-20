import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { Box } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";

const Row = ({ row, i }) => {
  const keys = Object.keys(row);
  const key = keys[0];

  return (
    <TableRow
      sx={
        {
          // "&:last-child td, &:last-child th": { border: 0 },
        }
      }
    >
      <TableCell align="left" sx={{ width: "5%", borderBottom: "none" }}>
        {i + 1}
      </TableCell>
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
        <CustomTextInput
          value={key}
          disabled="true"
          variant="standard"
          inputProps={{ disableUnderline: true }}
          sx={{
            height: "45px !important",
            backgroundColor: "background.lightest",
            borderRadius: "5px",
            m: 0,
            mt: 1.4,
            p: 1,
            border: "1px solid rgba(0,0,0,0.2)",
          }}
        />
      </TableCell>
      <TableCell
        align="left"
        sx={{
          width: "30%",
          p: 0,
          pl: 1,
          borderBottom: "none !important",
        }}
      >
        <CustomTextInput
          value={row[key]}
          disabled="true"
          placeholder="Input Quantity"
          variant="standard"
          inputProps={{ disableUnderline: true }}
          sx={{
            height: "45px !important",
            backgroundColor: "background.lightest",
            borderRadius: "5px",
            m: 0,
            mt: 1.4,
            p: 1,
            border: "1px solid rgba(0,0,0,0.2)",
          }}
        />
      </TableCell>
    </TableRow>
  );
};

export default function TestResultUsageTable({ rows = [] }) {
  return (
    <TableContainer
      component={Box}
      sx={{
        width: {
          xs: "100%",
          sm: "87%",
        },
        p: { xs: 0.5, sm: 2 },
        backgroundColor: "background.custom",
      }}
    >
      <Table
        sx={{
          minWidth: 550,
          borderSpacing: "10px",
          borderCollapse: "separate",
          borderColor: "transparent",
        }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ borderBottom: "none" }} />

            <TableCell
              align="left"
              sx={{ fontWeight: "bold", borderBottom: "none" }}
            >
              Item
            </TableCell>
            <TableCell
              align="left"
              sx={{ fontWeight: "bold", borderBottom: "none" }}
            >
              Quantity
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <Row key={i} row={row} i={i} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
