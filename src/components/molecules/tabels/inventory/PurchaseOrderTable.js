import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DoneIcon from "@mui/icons-material/Done";
import CustomDotMenu from "components/atoms/CustomDotMenu";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const rows = [
  {
    id: "123456789a",
    title: "Carton of Syringe Case",
    orderNumber: "2334546657575",
    totalCost: "12",
    totalQty: "3",
    vendor: "HXYZAVE",
    checkedBy: "Smith Adebayo",
    status: "Accepted",
  },
  {
    id: "123456789b",
    title: "Carton of Syringe Case",
    orderNumber: "2334546657575",
    totalCost: "12",
    totalQty: "3",
    vendor: "HXYZAVE",
    checkedBy: "Smith Adebayo",
    status: "Declined",
  },
  {
    id: "123456789c",
    title: "Carton of Syringe Case",
    orderNumber: "2334546657575",
    totalCost: "12",
    totalQty: "3",
    vendor: "HXYZAVE",
    checkedBy: "Smith Adebayo",
    status: "Fulfilled",
  },
];

const Row = ({
  row,
  selectedItems,
  handleSelect,
  handleUnSelect,
  toggleModal,
}) => {
  const isSelected = selectedItems.includes(row.id);
  let status;
  if (row.status === "Accepted") {
    status = (
      <Stack
        direction={"row"}
        alignItems="center"
        sx={{ color: "primary.success" }}
        spacing={1}
      >
        <DoneIcon /> Accepted
      </Stack>
    );
  } else if (row.status === "Declined") {
    status = (
      <Stack
        direction={"row"}
        alignItems="center"
        sx={{ color: "primary.error" }}
        spacing={1}
      >
        <ClearIcon /> Declined
      </Stack>
    );
  } else {
    status = (
      <Stack
        direction={"row"}
        alignItems="center"
        sx={{ color: "secondary.main" }}
        spacing={1}
      >
        <CheckCircleOutlineIcon /> Fulfilled
      </Stack>
    );
  }
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
        <IconButton
          onClick={() =>
            isSelected ? handleUnSelect(row.id) : handleSelect(row.id)
          }
          aria-label="check-box"
        >
          {isSelected ? (
            <CheckBoxIcon sx={{ color: "primary.main", fontSize: "20px" }} />
          ) : (
            <CheckBoxOutlineBlankIcon
              sx={{ color: "#DFDFDF", fontSize: "20px" }}
            />
          )}
        </IconButton>
      </TableCell>
      <TableCell
        component="th"
        scope="row"
        align="left"
        sx={{ color: "primary.darkGrey" }}
      >
        {row.title}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {row.orderNumber}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.totalCost}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.totalQty}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.vendor}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.checkedBy}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {status}
      </TableCell>

      <TableCell align="left">
        {" "}
        <CustomDotMenu
          items={[
            {
              caption: "View Patient Details",
              icon: <PersonOutlineOutlinedIcon sx={{ mr: 1 }} />,
              action: () => {},
            },
            {
              caption: "Confirm Discharge",
              icon: <LabelOutlinedIcon sx={{ mr: 1 }} />,
              action: () => {},
            },
          ]}
        />{" "}
      </TableCell>
    </TableRow>
  );
};
export default function PurchaseOrderTable({ toggleModal }) {
  const [selectedItems, setselectedItems] = React.useState([]);
  const [isAllSelected, setisAllSelected] = React.useState(false);
  const handleSelect = (id) => setselectedItems([...selectedItems, id]);
  const handleUnSelect = (id) => {
    const newState = selectedItems.filter((item) => item !== id);
    setselectedItems(newState);
    setisAllSelected(false);
  };
  const handleSelectAll = () => {
    const newState = rows.map((row) => row.id);
    setselectedItems(newState);
    setisAllSelected(true);
  };
  const handleUnSelectAll = () => {
    setselectedItems([]);
    setisAllSelected(false);
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="inventory-overview-table">
        <TableHead>
          <TableRow sx={{}}>
            <TableCell align="left" sx={{ width: "70px" }}>
              <IconButton
                onClick={isAllSelected ? handleUnSelectAll : handleSelectAll}
              >
                {isAllSelected ? (
                  <CheckBoxIcon
                    sx={{ color: "primary.main", fontSize: "20px" }}
                  />
                ) : (
                  <CheckBoxOutlineBlankIcon
                    sx={{ color: "#DFDFDF", fontSize: "20px" }}
                  />
                )}
              </IconButton>
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Title
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Order Number
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Total Cost
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Total Quantity
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Vendor
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Checked By
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Status
            </TableCell>

            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <Row
              key={i}
              row={row}
              handleSelect={handleSelect}
              handleUnSelect={handleUnSelect}
              selectedItems={selectedItems}
              toggleModal={toggleModal}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
