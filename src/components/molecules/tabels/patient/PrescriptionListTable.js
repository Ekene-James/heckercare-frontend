import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { Link } from "react-router-dom";

const rows = [
  {
    drugName: "Phentamine Adifex Phentamine Adifex Phentamine Adifex",
    dosage: "90 pc",
    day: "Twice Daily",
    drugType: "Cream",
  },
  {
    drugName: "Phentamine Adifex",
    dosage: "90 pc",
    day: "Twice Daily",
    drugType: "Tablet",
  },
  {
    drugName: "Phentamine Adifex",
    dosage: "90 pc",
    day: "Twice Daily",
    drugType: "Pill",
  },
  {
    drugName: "Phentamine Adifex",
    dosage: "90 pc",
    day: "Twice Daily",
    drugType: "Cream",
  },
];

const MenuBtn = ({ item, onClick }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    onClick(item);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleClose}>one</MenuItem>
        <MenuItem onClick={handleClose}>Two</MenuItem>
        <MenuItem onClick={handleClose}>Three</MenuItem>
      </Menu>
    </>
  );
};

export default function PrescriptionListTable() {
  const handleClickMenuBtn = (item) => {};
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Drug Name
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Dosage
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Day
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Drug Type
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Action
            </TableCell>
            <TableCell align="left"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row" align="left" sx={{}}>
                <p
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    width: "10em",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.drugName}
                </p>
              </TableCell>
              <TableCell component="th" scope="row" align="left">
                {row.dosage}
              </TableCell>
              <TableCell align="left">{row.day}</TableCell>
              <TableCell align="left">{row.drugType}</TableCell>
              <TableCell align="left">
                <Link to="">View details</Link>
              </TableCell>
              <TableCell align="left">
                {" "}
                <MenuBtn item={row} onClick={handleClickMenuBtn} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
