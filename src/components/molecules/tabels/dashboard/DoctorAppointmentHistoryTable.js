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

import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CheckIcon from "@mui/icons-material/Check";
import { Chip } from "@mui/material";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Link } from "react-router-dom";
import CustomDotMenu from "components/atoms/CustomDotMenu";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import CustomButton from "components/atoms/CustomButton";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import ViewItemModal from "components/molecules/inventory/modalContent/overview/ViewItemModal";
import moment from "moment";
import CustomCheckbox from "components/atoms/CustomCheckbox";
import ViewDisputeModal from "components/molecules/accounting/modal/ViewDisputeModal";

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
  const autoCheck = selectedItems.includes(row);

  let actionBtnArr;
  actionBtnArr = [
    {
      caption: "View Dispute Details",
      icon: <PersonOutlineOutlinedIcon sx={{ mr: 1 }} />,
      action: toggleModal,
    },
  ];

  let status;
  if (row?.status === "RESOLVED") {
    status = (
      <Chip
        variant="outlined"
        icon={<CheckIcon />}
        color="success"
        label="Resolved"
      />
    );
  } else {
    status = (
      <Chip
        variant="outlined"
        icon={<RemoveCircleOutlineIcon />}
        color="warning"
        label="Pending"
      />
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
        <CustomCheckbox
          onClick={(checkState) =>
            checkState ? handleSelect(row) : handleUnSelect(row)
          }
          autoCheck={autoCheck}
        />
      </TableCell>
      <TableCell component="th" scope="row" align="left" color="primary.main">
        {row.patient.ID}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {`${row.patient.firstName} ${row.patient.lastName}`}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {moment(row?.startDateTime).format("MMMM Do YYYY h:mm:ss a")}
      </TableCell>

      {/* <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        <CustomButton
          variant="outlined"
          color="secondary"
          sx={{ ml: 1 }}
          text="Report"
          // onClick={toggleModal.bind(null, row)}
        />
      </TableCell> */}
    </TableRow>
  );
};
export default function DoctorAppointmentHistoryTable({
  data,
  refetch,
  checkBoxItems,
  setcheckBoxItems,
}) {
  const modalRef = React.useRef(null);
  const [disputeItem, setDisputeItem] = React.useState("");
  const [selectedItems, setselectedItems] = React.useState([]);
  const [inventoryItem, setInventoryItem] = React.useState(null);
  const [isAllSelected, setisAllSelected] = React.useState(false);
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

  const toggleModal = (item) => {
    setDisputeItem(item);
    modalRef?.current?.handleToggle();
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="inventory-overview-table">
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
                Patient ID
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Patient Name
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Date
              </TableCell>
              {/* <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Action
              </TableCell> */}
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
                    selectedItems={checkBoxItems}
                    toggleModal={() => toggleModal(row)}
                  />
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomRightDrawer
        ref={modalRef}
        title="Open Dispute"
        subTitle="View Details of Open Dispute"
      >
        <ViewDisputeModal
          detail={disputeItem}
          refetch={refetch}
          closeModal={() => modalRef?.current?.handleToggle()}
        />
      </CustomRightDrawer>
    </>
  );
}
