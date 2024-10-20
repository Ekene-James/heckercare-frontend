import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import moment from "moment";

import { Stack, Typography } from "@mui/material";
import ColorCodeChip from "components/atoms/ColorCodeChip";

export default function ResultDetails({ data, from }) {
  const getRangeVal = (data) => {
    let range = "low";
    if (data?.range?.type === "text") {
      if (data?.range?.normal.toLowerCase() === data?.value?.toLowerCase()) {
        range = "normal";
      } else {
        range = "bad";
      }
    } else {
      if (+data?.value < +data?.range?.normal.min) {
        range = "low";
      } else if (+data?.value > +data?.range?.normal.max) {
        range = "high";
      } else {
        range = "normal";
      }
    }
    return range;
  };
  return (
    <Stack gap={2}>
      <Stack sx={{ backgroundColor: "", p: 4 }}>
        <Typography
          sx={{ opacity: 0.7, fontWeight: 700, fontSize: "14px" }}
        >{`${data?.test?.testName} / ${moment(data?.date).format(
          "MMMM Do, YYYY"
        )}`}</Typography>
        <Typography variant="h6">Investigation Details</Typography>
      </Stack>
      <TableContainer component={Paper} sx={{}}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "background.lightest" }}>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Investigation
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Result
              </TableCell>
              {from === "lab" && (
                <>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Reference Value
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Unit
                  </TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(data?.result?.dynamicFields || {})?.map(
              ([fieldName, feildVal], i) => (
                <TableRow
                  key={fieldName}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row" align="left">
                    {fieldName}
                  </TableCell>
                  <TableCell align="left">{feildVal?.value}</TableCell>
                  {from === "lab" && (
                    <>
                      <TableCell align="left">
                        <ColorCodeChip type={getRangeVal(feildVal || {})} />
                      </TableCell>
                      <TableCell align="left">
                        {data?.test?.unit || "--"}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
