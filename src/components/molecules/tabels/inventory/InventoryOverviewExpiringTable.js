import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Link } from "react-router-dom";
import CustomDotMenu from "components/atoms/CustomDotMenu";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import CustomButton from "components/atoms/CustomButton";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import ViewItemModal from "components/molecules/inventory/modalContent/overview/ViewItemModal";
import moment from "moment";

const rows = [
  {
    id: "123456789a",
    products: "Omnipaque",
    location: "Baruwa, Head office",
    module: "Radiology",
    quantity: "3",
    department: "Hand Gloves",
    category: "Handy Material",
  },
  {
    id: "123456789b",
    products: "Ciprofloxacin",
    location: "Baruwa, Head office",
    module: "Radiology",
    quantity: "3",
    department: "Hand Gloves",
    category: "Handy Material",
  },
  {
    id: "123456789c",
    products: "Azithromycin",
    location: "Baruwa, Head office",
    module: "Radiology",
    quantity: "3",
    department: "Hand Gloves",
    category: "Handy Material",
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

  function expiryDate(date_string) {
    var expiration = moment(date_string).format("YYYY-MM-DD");
    var current_date = moment().format("YYYY-MM-DD");
    var days = moment(expiration).diff(current_date, "days");
    return days;
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
      <TableCell component="th" scope="row" align="left" color="primary.main">
        {row?.product?.itemName || "null"}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {moment(row?.expiryDate).format("MMMM Do YYYY")}
      </TableCell>
    </TableRow>
  );
};
export default function InventoryOverviewExpiringTable({ data }) {
  const modalRef = React.useRef(null);

  const [selectedItems, setselectedItems] = React.useState([]);
  const [inventoryItem, setInventoryItem] = React.useState(null);
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

  const toggleModal = (item) => {
    setInventoryItem(item);
    modalRef?.current?.handleToggle();
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="inventory-overview-table">
          <TableBody>
            {data?.length
              ? data.map((row, i) => (
                  <Row
                    key={row._id}
                    row={row}
                    handleSelect={handleSelect}
                    handleUnSelect={handleUnSelect}
                    selectedItems={selectedItems}
                    toggleModal={() => toggleModal(row)}
                  />
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
