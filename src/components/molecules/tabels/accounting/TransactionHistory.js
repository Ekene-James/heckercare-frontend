import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { numberFormatter } from "utils/numberFormatter";
import CustomDotMenu from "components/atoms/CustomDotMenu";
import CustomButton from "components/atoms/CustomButton";

const Row = ({ row, idx }) => {
  return (
    <TableRow
      sx={{
        "&:nth-of-type(odd)": {
          backgroundColor: "background.custom",
        },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell component="th" scope="row" align="left" sx={{ width: "70px" }}>
        {idx + 1}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.patient?.ID}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.paymentReference}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {`${row?.patient?.firstName || ""} ${row?.patient?.lastName || ""}`}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {`₦${numberFormatter(row?.totalCost)}`}
      </TableCell>

      <TableCell align="left">{row?.transactionType}</TableCell>
      <TableCell align="left">{row?.paymentMethod}</TableCell>
      <TableCell align="left">
        <CustomButton
          text="View Details"
          onClick={() => window.open(row?.receiptUrl, "_blank")}
          variant="containedBrown"
          disabled={!row?.receiptUrl}
          sx={{ minWidth: "150px" }}
        />
      </TableCell>
    </TableRow>
  );
};

export default function AccountingTransactionHistoryTable({ data }) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 640 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                S/N
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Patient ID
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Payment Reference
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Patient's Name
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Amount
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Transaction Type
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Payment Method
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length
              ? data?.map((row, i) => <Row key={row?._id} row={row} idx={i} />)
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
