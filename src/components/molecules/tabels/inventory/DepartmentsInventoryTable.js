import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CustomButton from "components/atoms/CustomButton";

import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import CustomCheckbox from "components/atoms/CustomCheckbox";
import UsageHistory from "components/molecules/inventory/modalContent/stockMgt/UsageHistory";
import CustomModal from "components/atoms/CustomModal";
import { GET_USAGE_HISTORY } from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";

const rows = [
  {
    items: "Glucometer",
    category: "Handy material",
    location: "Iganmu Hospital",
    quantity: "3",
  },
  {
    items: "Glucometer",
    category: "Handy material",
    location: "Iganmu Hospital",
    quantity: "3",
  },
  {
    items: "Glucometer",
    category: "Handy material",
    location: "Iganmu Hospital",
    quantity: "3",
  },
];

const Row = ({
  row,
  i,
  selectedItems,
  toggleModal,
  openModal,
  handleSelect,
  handleUnSelect,
}) => {
  const autoCheck = selectedItems?.includes(row);

  return (
    <TableRow
      sx={{
        "&:nth-of-type(odd)": {
          backgroundColor: "background.custom",
        },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell
        component="th"
        scope="row"
        align="left"
        sx={{ width: "50px", fontWeight: "bold" }}
      >
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
        {row?.itemName}
      </TableCell>
      <TableCell scope="row" align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.itemDescription || "--"}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.totalQuantity}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.unitOfItem}
      </TableCell>

      <TableCell
        align="left"
        sx={{
          color: "secondary.main",
          cursor: "pointer",
        }}
      >
        <CustomButton
          variant="outlined"
          color="secondary"
          text="View"
          sx={{ border: "1px solid black", color: "primary.main" }}
          onClick={openModal?.bind(this, row)}
        />
      </TableCell>
    </TableRow>
  );
};
export default function DepartmentsInventoryTable({
  checkBoxItems,
  setcheckBoxItems,
  data,
}) {
  const PageSize = 10;
  const modalRef = React.useRef(null);
  const [currentPage, setCurrentPage] = React.useState(1);

  const [rowData, setRowData] = React.useState({});

  const handleSelect = (item) => {
    const newState = [...checkBoxItems, item];
    setcheckBoxItems(newState);
  };

  const toggleModal = (data) => {
    setRowData(data);
    modalRef?.current?.handleToggle();
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

  //get all department stock items

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="departments-inventory-table">
          <TableHead>
            <TableRow sx={{}}>
              <TableCell align="left" sx={{ fontWeight: "70px" }}>
                <CustomCheckbox
                  onClick={(checkState) =>
                    checkState ? handleSelectAll() : handleUnSelectAll()
                  }
                />
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Item
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Description
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Quantity
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Unit
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length
              ? data.map((row, i) => (
                  <Row
                    key={row._id}
                    row={row}
                    i={i}
                    handleSelect={handleSelect}
                    handleUnSelect={handleUnSelect}
                    selectedItems={checkBoxItems}
                    openModal={toggleModal}
                    // toggleModal={toggleModal}
                  />
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
        }}
        ariaLabel="usage-history-modal"
      >
        <UsageHistory stockDetails={rowData} handleClose={toggleModal} />;
      </CustomModal>
    </>
  );
}
