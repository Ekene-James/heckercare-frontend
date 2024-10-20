import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import CustomCheckbox from "components/atoms/CustomCheckbox";

import { currencyFormatter } from "utils/numberFormatter";

const Row = ({
  row,
  selectedItems,
  handleSelect,
  handleUnSelect,
  toggleModal,
}) => {
  const isSelected = selectedItems.some((item) => item.uid === row.uid);

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
          autoCheck={isSelected}
        />
      </TableCell>
      <TableCell component="th" scope="row" align="left" color="primary.main">
        {row?.item.itemName}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {row?.quantity}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {row?.item?.availableQuantity}
      </TableCell>

      <TableCell component="th" scope="row" align="left">
        {row?.item?.unitType}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {currencyFormatter(row?.item?.unitCost)}
      </TableCell>

      {/* <TableCell
        align="left"
        sx={{
          color: "secondary.main",
          cursor: "pointer",
        }}
      >
        <CustomButton
          text="Grant"
          variant="custom"
          rgb={"0, 132, 53"}
          onClick={toggleModal}
        />
        <CustomButton
          text="Decline"
          variant="custom"
          rgb={"219, 30, 54"}
          onClick={toggleModal}
        />
      </TableCell> */}
    </TableRow>
  );
};
export default function RequestApprovalTable({
  data,
  checkBoxItems,
  setcheckBoxItems,
  toggleModal,
}) {
  const [autocheck, setautocheck] = React.useState(false);

  const handleSelect = (item) => {
    setautocheck(false);
    const newState = [...checkBoxItems, item];
    setcheckBoxItems(newState);
  };
  const handleUnSelect = (item) => {
    setautocheck(false);
    setcheckBoxItems((prev) => {
      const newState = prev.filter((selected) => selected.uid !== item.uid);
      return newState;
    });
  };
  const handleSelectAll = () => {
    setcheckBoxItems(data);
  };

  const handleUnSelectAll = () => {
    setcheckBoxItems([]);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="inventory-overview-table">
          <TableHead>
            <TableRow sx={{}}>
              <TableCell align="left" sx={{ width: "70px" }}>
                <CustomCheckbox
                  autoCheck={autocheck}
                  onClick={(checkState) =>
                    checkState ? handleSelectAll() : handleUnSelectAll()
                  }
                />
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Product Name
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Requested Quantity
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Available Quantity
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Unit
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Cost
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, i) => (
              <Row
                key={i}
                row={row}
                handleSelect={handleSelect}
                handleUnSelect={handleUnSelect}
                selectedItems={checkBoxItems}
                toggleModal={toggleModal}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
