import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box, IconButton } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";

const Row = ({ row, i, handleRemove, formState, handleChange }) => {
  const formName = row.name.replace(/\s+/g, "");

  // console.log(formState, row);
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
          value={row.name}
          name={formName}
          disabled="true"
          readOnly
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
          value={formState[formName]}
          name={formName}
          handleChange={handleChange}
          placeholder="Input Field Value"
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
          disabled={handleChange ? "false" : "true"}
          readOnly={handleChange ? false : true}
        />
      </TableCell>
      <TableCell sx={{ width: "5%", borderBottom: "none" }}>
        <IconButton
          aria-label={`delete ${row.name} button`}
          color="error"
          onClick={handleRemove.bind(this, row)}
          sx={{ mt: 1.4 }}
        >
          <CancelIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default function StockUsageTable({
  rows = [],
  handleRemove,
  formState,
  handleChange,
}) {
  return (
    <TableContainer component={Box}>
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
              Field
            </TableCell>
            <TableCell
              align="left"
              sx={{ fontWeight: "bold", borderBottom: "none" }}
            >
              Value
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <Row
              key={row.id}
              row={row}
              i={i}
              handleRemove={handleRemove}
              handleChange={handleChange}
              formState={formState}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
