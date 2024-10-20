import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { Link } from "react-router-dom";
import CustomCheckbox from "components/atoms/CustomCheckbox";
import moment from "moment";

const Row = ({ row, selectedItems, handleSelect, handleUnSelect }) => {
  let color = "green";
  if (row.admissionStatus === "emergency" || row.admissionStatus === "dead") {
    color = "red";
  } else if (row.admissionStatus === "outpatient") {
    color = "primary.darkGrey";
  } else if (row.admissionStatus === "discharged") {
    color = "text.custom";
  }
  const autoCheck = selectedItems.includes(row);
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
        <CustomCheckbox
          onClick={(checkState) =>
            checkState ? handleSelect(row) : handleUnSelect(row)
          }
          autoCheck={autoCheck}
        />
      </TableCell>
      <TableCell
        component="th"
        scope="row"
        align="left"
        sx={{ color: "primary.darkGrey" }}
      >
        {row.ID}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {row.name}
        {`${row.firstName} ${row.lastName}`}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {moment(row?.dateOfBirth).format("MMMM Do YYYY")}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {moment(row.createdAt).format("MMMM Do YYYY")}
      </TableCell>
      <TableCell align="left" sx={{ color, fontWeight: "bold" }}>
        {row.admissionStatus}
      </TableCell>

      <TableCell align="left">
        <Link
          to={`/home/patient/basic-information/${row._id}`}
          style={{ textDecoration: "none" }}
        >
          View
        </Link>
      </TableCell>
    </TableRow>
  );
};
export default function PatientOverviewTable({
  data,
  checkBoxItems,
  setcheckBoxItems,
}) {
  const handleSelect = (item) => {
    const newState = [...checkBoxItems, item];

    setcheckBoxItems(newState);
  };
  const handleUnSelect = (item) => {
    const newState = checkBoxItems.filter(
      (selected) => selected._id !== item._id
    );

    setcheckBoxItems(newState);
  };

  const handleSelectAll = () => {
    setcheckBoxItems(data);
  };
  const handleUnSelectAll = () => {
    setcheckBoxItems([]);
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{}}>
            <TableCell align="left" sx={{ width: "70px" }}>
              <CustomCheckbox
                onClick={(checkState) =>
                  checkState ? handleSelectAll() : handleUnSelectAll()
                }
              />
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Unique Id
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Patients Name
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              DOB
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Date Joined
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Status
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.length
            ? data?.map((row, i) => (
                <Row
                  key={row._id}
                  row={row}
                  handleSelect={handleSelect}
                  handleUnSelect={handleUnSelect}
                  selectedItems={checkBoxItems}
                />
              ))
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
