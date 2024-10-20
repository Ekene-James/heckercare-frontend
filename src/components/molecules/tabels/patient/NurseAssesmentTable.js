import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, IconButton, Typography } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const rows = [
  {
    id: "ID-1234",
    patientName: "Jon Doe",
    dob: "12/12/12",
    dateJoined: "12/12/12",
    status: "active",
  },
  {
    id: "ID-1235",
    patientName: "Jane Doe",
    dob: "12/12/12",
    dateJoined: "12/12/13",
    status: "Inactive",
  },
  {
    id: "ID-1236",
    patientName: "Janey Doe",
    dob: "12/12/12",
    dateJoined: "12/12/18",
    status: "Inactive",
  },
  {
    id: "ID-1237",
    patientName: "Janet Doe",
    dob: "12/12/12",
    dateJoined: "12/12/18",
    status: "active",
  },
];

const Btn = ({ handleClick, id }) => {
  const [clicked, setclicked] = React.useState(false);
  const btnClick = () => {
    setclicked(!clicked);
    handleClick(id);
  };
  return (
    <IconButton onClick={btnClick}>
      {clicked ? (
        <CheckBoxIcon sx={{ color: "primary.main" }} />
      ) : (
        <CheckBoxOutlineBlankIcon sx={{ color: "gray" }} />
      )}
    </IconButton>
  );
};

export default function NurseAssesmentTable() {
  const [selectedArray, setselectedArray] = React.useState([]);
  const handleClick = (id) => {
    const isSelected = selectedArray.find((item) => item === id);
    if (isSelected) {
      return setselectedArray((prev) => {
        return prev.filter((item) => item !== id);
      });
    }
    setselectedArray([...selectedArray, id]);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Patient Name</TableCell>
            <TableCell align="left">DOB</TableCell>
            <TableCell align="left">Date Joined</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{ p: 0 }}>
                <Btn id={row.id} handleClick={handleClick} />
              </TableCell>
              <TableCell component="th" scope="row" align="left">
                {row.id}
              </TableCell>
              <TableCell align="left">{row.patientName}</TableCell>
              <TableCell align="left">{row.dob}</TableCell>
              <TableCell align="left">{row.dateJoined}</TableCell>

              <TableCell align="left">
                {row.status === "active" ? (
                  <Typography
                    variant="subheading"
                    sx={{
                      color: "green",
                    }}
                  >
                    active
                  </Typography>
                ) : (
                  <Typography variant="caption">Inactive</Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
