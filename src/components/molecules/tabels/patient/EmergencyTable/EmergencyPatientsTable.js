import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useNavigate } from "react-router-dom";
import CustomDotMenu from "components/atoms/CustomDotMenu";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import moment from "moment";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import CustomCheckbox from "components/atoms/CustomCheckbox";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_EMERGENCY_PATIENTS,
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
import AdmitWardModal from "./AdmitPatientModal";
import { useQueryClient } from "react-query";

const Row = ({
  admitPatientHandler,
  row,
  selectedItems,
  handleSelect,
  handleUnSelect,
}) => {
  const navigate = useNavigate();
  const handleViewDetails = () => {
    navigate(`/home/patient/basic-information/${row._id}`);
  };
  const queryClient = useQueryClient();

  //discharge patient
  const { mutate: dischargePatient, isLoading: dischargePatientLoading } =
    useCustomMutation(
      {
        url: `/patients/discharge-patient/${row?.id}`,
        method: "patch",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_EMERGENCY_PATIENTS]);

          toast.success("Success");
        },

        onError: (error) => {
          if (error.message.length) {
            error.message.map((msg) => toast.error(msg));
          } else {
            toast.error(error.message);
          }
        },
      }
    );

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

      <TableCell
        component="th"
        scope="row"
        align="left"
        sx={{ color: "primary.darkGrey" }}
      >
        {row.ID}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row._id}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {`${row.firstName} ${row.lastName}`}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.age}/{row.gender}
      </TableCell>
      {/* <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.roomType}/{row.roomNumber}
      </TableCell> */}
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {moment(row.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
      </TableCell>
      <TableCell align="left">
        {" "}
        <CustomDotMenu
          disabled={dischargePatientLoading}
          items={[
            {
              caption: "View Patient Details",
              icon: <PersonOutlineOutlinedIcon sx={{ mr: 1 }} />,
              action: handleViewDetails,
            },
            // {
            //   caption: "Discharge Patient",
            //   icon: <LabelOutlinedIcon sx={{ mr: 1 }} />,
            //   action: dischargePatient,
            // },
            {
              caption: "Admit Patient",
              icon: <CreateNewFolderOutlinedIcon sx={{ mr: 1 }} />,
              action: () => admitPatientHandler(row),
            },
          ]}
        />{" "}
      </TableCell>
    </TableRow>
  );
};

export default function EmergencyPatientsTable({
  data,
  checkBoxItems,
  setcheckBoxItems,
}) {
  const modalRef = React.useRef(null);
  const [patient, setPatient] = React.useState();
  const [wardId, setWardId] = React.useState("");
  const queryClient = useQueryClient();

  const handleModalOpen = () => {
    modalRef?.current?.handleToggle();
  };

  const admitPatientHandler = (row) => {
    handleModalOpen();
    setPatient(row);
  };

  const handleModalClose = () => {
    modalRef?.current?.handleToggle();
  };

  //search wards
  const { data: wards } = useCustomQuery(
    GET_WARDS,
    {
      url: `/wards/get-all-wards`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const formartedData = data.data.wards.map((ward) => {
          return { name: ward.name, value: ward._id };
        });
        return formartedData;
      },
    }
  );

  //handle admit patient

  const { mutate: handleAdmit, isLoading: handleAdmitLoading } =
    useCustomMutation(
      {
        url: `/wards/admit-patient-to-ward/${wardId}/${patient?._id}`,
        method: "patch",
        // data: { patientId, wardId: to },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_EMERGENCY_PATIENTS]);
          toast.success("Success");
          handleModalClose();
        },

        onError: (error) => toast.error(error.message),
      }
    );

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
                Visit ID
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Unique ID
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Patient Name
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Age/Gender
              </TableCell>
              {/* <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Room Type/No
            </TableCell> */}
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Admin Date/Time
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
                    key={row._id}
                    row={row}
                    handleSelect={handleSelect}
                    handleUnSelect={handleUnSelect}
                    selectedItems={checkBoxItems}
                    handleModalClose={handleModalClose}
                    admitPatientHandler={admitPatientHandler}
                  />
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomModal ref={modalRef} ariaLabel={"test-center-modal"}>
        <AdmitWardModal
          wards={wards}
          wardId={wardId}
          setWardId={setWardId}
          patient={patient}
          handleAdmit={handleAdmit}
          handleAdmitLoading={handleAdmitLoading}
          onClose={handleModalOpen}
        />
      </CustomModal>
    </>
  );
}
