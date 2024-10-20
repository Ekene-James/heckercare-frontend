import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { Box } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomDatePicker from "components/atoms/DatePicker";

const Row = ({ row, i, handleChangeDetail, handleExpiryDate }) => {
  return (
    <TableRow
      sx={
        {
          // "&:last-child td, &:last-child th": { border: 0 },
        }
      }
    >
      <TableCell align="left" sx={{ width: "10%", borderBottom: "none" }}>
        {row?.productType?.itemName}
      </TableCell>
      <TableCell align="left" sx={{ width: "10%", borderBottom: "none" }}>
        {row.quantity}
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
          placeholder={"Enter quantity received"}
          name="quantityReceived"
          type="number"
          boxSx={{
            width: "150px!important",
          }}
          value={row?.quantityReceived}
          handleChange={handleChangeDetail.bind(null, i)}
          inputProps={{ inputProps: { min: 0 } }}
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
          placeholder={"Enter Batch ID/Number"}
          name="batchNumber"
          boxSx={{
            width: "150px!important",
          }}
          value={row?.batchNumber}
          handleChange={handleChangeDetail.bind(null, i)}
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
        <CustomDatePicker
          type="date"
          views={["year", "month", "day"]}
          title=""
          disableFuture={false}
          name="expiryDate"
          datePickerRootSx={{ height: "auto", width: "150px!important", mt: 1 }}
          datePickerSx={{ width: "100%" }}
          setdate={handleExpiryDate.bind(null, i)}
          date={row?.expiryDate || null}
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
          placeholder={"Enter Purchase Price"}
          name="purchasePrice"
          boxSx={{
            width: "150px!important",
          }}
          value={row?.purchasePrice}
          handleChange={handleChangeDetail.bind(null, i)}
          type="number"
          inputProps={{ inputProps: { min: 0 } }}
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
          placeholder={"Enter Selling Price"}
          name="sellingPrice"
          boxSx={{
            width: "150px!important",
          }}
          value={row?.sellingPrice}
          type="number"
          inputProps={{ inputProps: { min: 0 } }}
          handleChange={handleChangeDetail.bind(null, i)}
        />
      </TableCell>
    </TableRow>
  );
};

export default function GoodsReceivedTable({
  data,
  handleChangeDetail,
  handleExpiryDate,
}) {
  return (
    <TableContainer component={Box}>
      <Table
        sx={{
          minWidth: 900,
          borderSpacing: "10px",
          borderCollapse: "separate",
          borderColor: "transparent",
        }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
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
              Required Qty
            </TableCell>

            <TableCell
              align="left"
              sx={{ fontWeight: "bold", borderBottom: "none" }}
            >
              Quantity Received
            </TableCell>
            <TableCell
              align="left"
              sx={{ fontWeight: "bold", borderBottom: "none" }}
            >
              Batch Id
            </TableCell>
            <TableCell
              align="left"
              sx={{ fontWeight: "bold", borderBottom: "none" }}
            >
              Expiry Date
            </TableCell>
            <TableCell
              align="left"
              sx={{ fontWeight: "bold", borderBottom: "none" }}
            >
              Purchase Price
            </TableCell>
            <TableCell
              align="left"
              sx={{ fontWeight: "bold", borderBottom: "none" }}
            >
              Selling Price
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <Row
              key={i}
              row={row}
              handleChangeDetail={handleChangeDetail}
              i={i}
              handleExpiryDate={handleExpiryDate}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
