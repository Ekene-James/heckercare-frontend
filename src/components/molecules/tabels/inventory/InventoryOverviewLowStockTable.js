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

const Row = ({
  row,
  selectedItems,
  handleSelect,
  handleUnSelect,
  toggleModal,
}) => {
  const isSelected = selectedItems.includes(row.id);
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
        {row?.product?.itemName}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {`${row?.product?.availableQuantity} ${row?.product?.unitType}`}
      </TableCell>
    </TableRow>
  );
};
export default function InventoryOverviewLowStockTable({ data }) {
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
                    key={row?._id}
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
