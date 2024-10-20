import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { currencyFormatter, numberFormatter } from "utils/numberFormatter";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import ViewItemModal from "components/molecules/inventory/modalContent/overview/ViewItemModal";
import moment from "moment";

const Row = ({
  row,
  selectedItems,
  handleSelect,
  handleUnSelect,
  productId,
}) => {
  // const isSelected = selectedItems.includes(row.id);

  return (
    <TableRow
      sx={{
        "&:nth-of-type(odd)": {
          backgroundColor: "background.custom",
        },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      {/* <TableCell component="th" scope="row" align="left" sx={{ width: "70px" }}>
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
      </TableCell> */}
      <TableCell component="th" scope="row" align="left" color="primary.main">
        {moment(row?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {row?.batchNumber}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {numberFormatter(row?.quantity)}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {currencyFormatter(row?.purchasePrice)}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {currencyFormatter(row?.sellingPrice)}
      </TableCell>
    </TableRow>
  );
};
export default function ItemRequisitionTable({ data }) {
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
        <Table sx={{ minWidth: 650 }} aria-label="inventory-overview-table">
          <TableHead>
            <TableRow sx={{}}>
              {/* <TableCell align="left" sx={{ width: "70px" }}>
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
              </TableCell> */}
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Date
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Batch ID
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Requested Qty
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Purchase Price
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Selling Price
              </TableCell>
            </TableRow>
          </TableHead>
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

      <CustomRightDrawer ref={modalRef} title="Summary">
        <ViewItemModal
          detail={inventoryItem}
          closeModal={() => modalRef?.current?.handleToggle()}
        />
      </CustomRightDrawer>
    </>
  );
}
