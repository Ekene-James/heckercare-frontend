import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Link, useNavigate } from "react-router-dom";
import CustomDotMenu from "components/atoms/CustomDotMenu";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import moment from "moment";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import CustomCheckbox from "components/atoms/CustomCheckbox";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_EMERGENCY_PATIENTS,
  GET_PENDING_REQUEST,
  GET_WARDS,
  SCHEDULE_DISCHARGE,
} from "utils/reactQueryKeys";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { Backdrop, Divider, Grid, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import CustomMenu from "components/atoms/CustomMenu";
import CustomModal from "components/atoms/CustomModal";
import AdmitWardModal from "../patient/EmergencyTable/AdmitPatientModal";
import { useQueryClient } from "react-query";
import CustomDatePicker from "components/atoms/DatePicker";
import SearchBar from "components/atoms/SearchBar";
import RightDrawer from "pages/pharmacy/components/RightDrawer";
import CreateDrugOrder from "pages/pharmacy/overview/CreateDrugOrder";
import EditDrugOrder from "pages/pharmacy/overview/EditDrugOrder";
import DispensedListModal from "pages/pharmacy/overview/DispensedListModal";
let PageSize = 5;
let total = 50;
const Row = ({
  refetch,
  page,
  handleView,
  row,
  selectedItems,
  handleSelect,
  handleUnSelect,
}) => {
  const [openAdmitPatientModal, setOpenAdmitPatientModal] =
    React.useState(false);
  const [patient, setPatient] = React.useState();
  const [wardId, setWardId] = React.useState("");
  const queryClient = useQueryClient();

  const modalRef = React.useRef(null);

  const navigate = useNavigate();
  const handleViewDetails = () => {
    navigate(`/home/patient/basic-information/${row?._id}`);
  };

  const handleModalOpen = (view) => {
    modalRef?.current?.handleToggle();
  };

  const admitPatientHandler = (row) => {
    handleModalOpen();
    setPatient(row);
    // setPatientId(row._id);
  };

  const handleModalClose = () => {
    modalRef?.current?.handleToggle();
    // onCloseRequest?.(false);
  };

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

      {/* <TableCell
        component="th"
        scope="row"S
        align="left"
        sx={{ color: "primary.darkGrey" }}
      >
        {row.ID}
      </TableCell> */}
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.uniqueCode}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {`${row?.patient?.firstName} ${row?.patient?.lastName}`}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.items[0]?.product?.drugName}
      </TableCell>
      {/* <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.roomType}/{row.roomNumber}
      </TableCell> */}
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.items[0]?.product?.brandName}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.items[0]?.product?.availableQuantity}
      </TableCell>
      {/* <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {moment(row.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
      </TableCell> */}
      <TableCell align="left">
        <CustomButton
          // to={`/home/patient/basic-information/${row._id}`}
          // s1tyle={{ textDecoration: "none" }}
          variant="lightSecondary"
          color="secondary"
          text="View"
          sx={{ border: "1px solid black", color: "primary.main" }}
          onClick={handleView}
        />
      </TableCell>

      {/* <ShowSuccessModal
        open={openAdmitPatientModal}
        onClose={closeAdmitPatientHandler}
      /> */}
    </TableRow>
  );
};

export default function DispensedTable({
  refetch,
  data,
  checkBoxItems,
  setcheckBoxItems,
}) {
  const [showOrderForm, setShowOrderForm] = React.useState(false);
  const [requestDetail, setRequestDetail] = React.useState(null);
  const [search, setsearch] = React.useState("");
  const [date, setdate] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const queryClient = useQueryClient();
  const [row, setRow] = React.useState();

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
  const openDrawerHandler = () => {
    // setRow(row);
    setShowOrderForm(true);
  };

  // const openEditDrawer = (row) => {
  //   setRequestDetail(row);
  // };
  //get date
  const getDate = (date) => {
    if (date) {
      const newDate = new Date(date);
      const yr = newDate.getFullYear();
      const month = newDate.getMonth() + 1;
      const day = newDate.getDate();
      return `${yr}-${month}-${day}`;
    }
    return "";
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "70px" }}>
                <CustomCheckbox
                  onClick={(checkState) =>
                    checkState ? handleSelectAll() : handleUnSelectAll()
                  }
                />
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Prescription ID
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Patient Name
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Drug Name
              </TableCell>
              {/* <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Room Type/No
            </TableCell> */}

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Brand Name
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Available Qty
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
                    key={row?._id}
                    row={row}
                    handleView={() => setRequestDetail(row)}
                    handleSelect={handleSelect}
                    handleUnSelect={handleUnSelect}
                    selectedItems={checkBoxItems}
                  />
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      <RightDrawer
        open={Boolean(requestDetail)}
        closeHandler={() => setRequestDetail(null)}
        title="Dispensed Drug Detail"
      >
        <DispensedListModal
          editData={requestDetail}
          closeModal={() => setRequestDetail(null)}
        />
      </RightDrawer>
    </>
  );
}
