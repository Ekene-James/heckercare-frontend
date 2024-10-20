import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CustomButton from "components/atoms/CustomButton";
import { Typography } from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import RescheduleAppointmentModal from "../patient/upcomingAppointmentTable/RescheduleAppointmentModal";
import CustomModal from "components/atoms/CustomModal";
import FrontDeskRescheduleAppointmentModal from "../patient/upcomingAppointmentTable/FrontDeskRescheduleAppointmentModal";
import { useAuthCtx } from "store/contextStore/auth/AuthStore";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { GET_RUNNING_APPOINTMENT_BY_PATIENT } from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";
import ScheduleAppointment from "pages/appointments/ScheduleAppointment";
import ScheduleFollowUpAppointment from "pages/appointments/ScheduleFollowUpAppointment";
import FollowUpRescheduleAppointmentModal from "../patient/upcomingAppointmentTable/FollowUpRescheduleAppointmentModal";

const rows = [
  {
    date: "Fri 9, Sept 2022",
    patientName: "Samson Smith",
    assignedDoctor: "Dr. Ibukun O",
    position: "Orthopaedic Surgeon",
    time: "9:00am - 2:00pm",
  },
  {
    date: "Fri 9, Sept 2022",
    patientName: "Samson Smith",
    assignedDoctor: "Dr. Ibukun O",
    position: "Orthopaedic Surgeon",
    time: "9:00am - 2:00pm",
  },
  {
    date: "Fri 9, Sept 2022",
    patientName: "Samson Smith",
    assignedDoctor: "Dr. Ibukun O",
    position: "Orthopaedic Surgeon",
    time: "9:00am - 2:00pm",
  },
];
const Row = ({
  row,
  refetch,
  toggleModal,
  toggleRescheduleModal,
  isDoctorDashboard,
}) => {
  const navigate = useNavigate();
  const { state } = useAuthCtx();
  const queryClient = useQueryClient();
  const modalRef = React.useRef(null);

  //start patient appointment and alert doctor
  const { mutate: completeAppointment, isLoading: completeAppointmentLoading } =
    useCustomMutation(
      {
        url: `appointments/start-appointment/${row?._id}`,
        method: "patch",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([
            GET_RUNNING_APPOINTMENT_BY_PATIENT,
            {
              // page: currentPage,
              // limit: 10,
            },
          ]);
          refetch();
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

  //create a followup appointment
  const {
    mutate: createFollowUpAppointment,
    isLoading: createFollowUpLoading,
  } = useCustomMutation(
    {
      url: `/appointments/create-follow-up-appointment/${row?._id}`,
      method: "post",
      // data: values,
    },
    {
      onSuccess: () => {
        toast.success("Success");
      },
      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }

        return toast.error(error.message);
      },
    }
  );
  // const handleCompleteAppointment = () => {
  //   completeAppointment();
  // };

  const handleReschedule = () => {
    createFollowUpAppointment();
  };

  return (
    <TableRow
      sx={{
        "&:nth-of-type(odd)": {
          backgroundColor: "background.custom",
        },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell align="left" sx={{ fontWeight: "bold" }}>
        {row?.visitId}

        <br />
        <Typography sx={{ color: "primary.darkGrey" }}>{row.time}</Typography>
      </TableCell>

      <TableCell align="left">{`${row?.patientId?.firstName} ${row?.patientId?.lastName}`}</TableCell>
      <TableCell align="left" sx={{ fontWeight: "bold" }}>
        {`${
          row?.doctor?.firstName && row?.doctor?.lastName
            ? row?.doctor?.firstName + " " + row?.doctor?.lastName
            : "No doctor assigned"
        }`}
        <br />
        <Typography sx={{ color: "primary.darkGrey" }}>{`${
          row?.doctor?.firstName ? "Dentist" : ""
        }`}</Typography>
      </TableCell>

      <TableCell align="left">
        {row?.status === "PENDING" ? (
          <CustomButton
            variant="outlined"
            color="primary"
            sx={{ ml: 1 }}
            text="Create Appointment"
            onClick={toggleModal.bind(null, row)}
          />
        ) : (
          <CustomButton
            variant="outlined"
            color="primary"
            sx={{ ml: 1 }}
            text="Reschedule"
            onClick={toggleRescheduleModal.bind(null, row)}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default function FollowUpAppointmentTable({
  data,
  role,
  currentPage,
  checkBoxItems,
  refetch,
  setcheckBoxItems,
  isDoctorDashboard,
}) {
  const handleSelect = (item) => {
    const newState = [...checkBoxItems, item];
    setcheckBoxItems(newState);
  };
  const modalRef = React.useRef(null);
  const rescheduleModalRef = React.useRef(null);
  const [modalContent, setmodalContent] = React.useState({});
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
    setmodalContent(item);
    modalRef?.current?.handleToggle();
  };
  const toggleRescheduleModal = (item) => {
    setmodalContent(item);
    rescheduleModalRef?.current?.handleToggle();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="specialist doctor table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Visit ID
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Patient Name
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Assigned Doctor
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
                    key={row?._id}
                    row={row}
                    refetch={refetch}
                    toggleModal={toggleModal}
                    toggleRescheduleModal={toggleRescheduleModal}
                    handleSelect={handleSelect}
                    handleUnSelect={handleUnSelect}
                    selectedItems={checkBoxItems}
                    isDoctorDashboard={isDoctorDashboard}
                  />
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomModal
        ref={rescheduleModalRef}
        childrenContSx={{
          p: 3,
          // height: "100% !important",
          // minHeight: "85vh",
          // minWidth: "75vw",
          height: "fit-content !important",
          // width: "100% !important",
        }}
      >
        <FollowUpRescheduleAppointmentModal
          refetch={refetch}
          modalContent={modalContent}
          closeModal={() => rescheduleModalRef?.current?.handleToggle()}
          currentPage={currentPage}
        />
      </CustomModal>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          // height: "100% !important",
          // minHeight: "85vh",
          // minWidth: "75vw",
          height: "fit-content !important",
          // width: "100% !important",
        }}
      >
        <ScheduleFollowUpAppointment
          refetch={refetch}
          modalContent={modalContent}
          closeModal={() => modalRef?.current?.handleToggle()}
        />
      </CustomModal>
    </>
  );
}
FollowUpAppointmentTable.defaultProps = {
  isDoctorDashboard: false,
};
