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
import { Stack, Typography } from "@mui/material";
import moment from "moment";
import { useNavigate, useOutletContext } from "react-router-dom";

import CustomModal from "components/atoms/CustomModal";
import FrontDeskRescheduleAppointmentModal from "../patient/upcomingAppointmentTable/FrontDeskRescheduleAppointmentModal";
import { useAuthCtx } from "store/contextStore/auth/AuthStore";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import {
  GET_RUNNING_APPOINTMENT_BY_PATIENT,
  GET_SPECIALIST_APPOINTMENTS,
} from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";
import { convertFromMilitaryTime } from "utils/convertFromMillitaryTime";

const Row = ({ row, refetch = () => {}, toggleModal, isDoctorDashboard }) => {
  const navigate = useNavigate();
  const { state } = useAuthCtx();
  const queryClient = useQueryClient();
  // const outletProp = useOutletContext();

  //start patient appointment and alert doctor
  const { mutate: startAppointment, isLoading: startAppointmentLoading } =
    useCustomMutation(
      {
        url: `appointments/start-appointment/${row?._id}`,
        method: "patch",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_RUNNING_APPOINTMENT_BY_PATIENT]);
          queryClient.invalidateQueries([GET_SPECIALIST_APPOINTMENTS]);
          refetch();
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

  //complete appointment
  const { mutate: completeAppointment, isLoading: completeAppointmentLoading } =
    useCustomMutation(
      {
        url: `appointments/complete-appointment/${row?._id}`,
        method: "patch",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_SPECIALIST_APPOINTMENTS]);

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
        {moment(new Date(row?.startDateTime)).format("MMMM Do YYYY")}

        <br />
        <Typography sx={{ color: "primary.darkGrey" }}>
          {convertFromMilitaryTime(row?.startTime)}-
          {convertFromMilitaryTime(row?.endTime)}
        </Typography>
      </TableCell>
      <TableCell align="left" sx={{ fontWeight: "bold" }}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={1}
        >
          {isDoctorDashboard && (
            <img
              alt="profile_img"
              src={
                row?.patient?.patientImage || "/imgs/blank-profile-picture.png"
              }
              style={{
                borderRadius: "50%",
                objectFit: "contain",
                objectPosition: "center",
                width: "24px",
                height: "24px",
              }}
            />
          )}
          {`${row?.patient?.firstName || ""} ${row?.patient?.lastName || ""}`}
        </Stack>
      </TableCell>
      <TableCell align="left" sx={{ fontWeight: "bold" }}>
        {`${row?.doctor?.firstName} ${row?.doctor?.lastName}`}
        <br />
        <Typography sx={{ color: "primary.darkGrey" }}>
          {row?.doctor?.designation?.name}
        </Typography>
      </TableCell>{" "}
      <TableCell align="left">
        <Stack direction={"row"} gap={1}>
          {isDoctorDashboard ? (
            <CustomButton
              onClick={() =>
                navigate(`/home/patient/basic-information/${row?.patient?._id}`)
              }
              variant="contained"
              color="primary"
              text="Open"
            />
          ) : (
            <CustomButton
              onClick={startAppointment}
              variant="contained"
              color="primary"
              text="Alert"
              startIcon={<NotificationsIcon />}
              disabled={startAppointmentLoading}
            />
          )}

          {state?.user?.role?.toLowerCase() !== "doctor" && (
            <CustomButton
              variant="outlined"
              color="primary"
              sx={{ ml: 1 }}
              text="Reschedule"
              onClick={toggleModal.bind(null, row)}
            />
          )}
        </Stack>
      </TableCell>
      {isDoctorDashboard ? (
        <TableCell align="left">
          <CustomButton
            variant="custom"
            color="primary"
            text="Mark as Complete"
            disabled={completeAppointmentLoading}
            onClick={completeAppointment}
            rgb="105, 86, 229"
            sx={{ textWrap: "nowrap" }}
          />
        </TableCell>
      ) : null}
    </TableRow>
  );
};

export default function SpecialistDoctorTable({
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
  const [modalContent, setmodalContent] = React.useState({});
  const handleUnSelect = (item) => {
    const newState = checkBoxItems.filter(
      (selected) => selected._id !== item._id
    );
    setcheckBoxItems(newState);
  };

  const toggleModal = (item) => {
    setmodalContent(item);
    modalRef?.current?.handleToggle();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="specialist doctor table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Date & Time
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
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
        ref={modalRef}
        childrenContSx={{
          p: 3,
          height: "fit-content !important",
          // width: "100% !important",
        }}
      >
        <FrontDeskRescheduleAppointmentModal
          refetch={refetch}
          modalContent={modalContent}
          closeModal={() => modalRef?.current?.handleToggle()}
          currentPage={currentPage}
        />
      </CustomModal>
    </>
  );
}
SpecialistDoctorTable.defaultProps = {
  isDoctorDashboard: false,
};
