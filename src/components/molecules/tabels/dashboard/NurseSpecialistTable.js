import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import CustomButton from "components/atoms/CustomButton";
import { Typography } from "@mui/material";
import CustomLoader from "components/atoms/CustomLoader";
import { Stack } from "@mui/system";
import Pagination from "components/molecules/pagination/Pagination";
import CustomModal from "components/atoms/CustomModal";
import RescheduleAppointmentModal from "../patient/upcomingAppointmentTable/RescheduleAppointmentModal";
import NotificationsIcon from "@mui/icons-material/Notifications";
import moment from "moment";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { GET_SPECIALIST_APPOINTMENTS } from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import CustomDotMenu from "components/atoms/CustomDotMenu";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

const Row = ({ row, toggleModal }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  //mark vitals done
  const { mutate: completeAppointment, isLoading: completeAppointmentLoading } =
    useCustomMutation(
      {
        url: `appointments/update-appointment/${row?._id}`,
        method: "patch",
        data: {
          status: "vitals done",
        },
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

  const menuItems = [
    {
      caption: "Open",

      action: () => navigate(`/home/patient/treatments/${row?.patient?._id}`),
    },

    {
      caption: "Mark as Complete",

      action: () => completeAppointment(),
    },
    {
      caption: "Reschedule",

      action: () => toggleModal(row),
    },
  ];
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
        {moment(row.startDateTime).format("MMMM Do YYYY") ===
        moment(row.endDateTime).format("MMMM Do YYYY")
          ? moment(row.startDateTime).format("MMMM Do YYYY")
          : `${moment(row.startDateTime).format("MMMM Do YYYY")} - ${moment(
              row.endDateTime
            ).format("MMMM Do YYYY")}`}
        <br />
        <Typography sx={{ color: "primary.darkGrey" }}>
          {" "}
          {row?.startTime} - {row?.endTime}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: "capitalize" }}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={1}
        >
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
          {`${row?.patient?.firstName || ""} ${row?.patient?.lastName || ""}`}
        </Stack>
      </TableCell>
      <TableCell
        align="left"
        sx={{ fontWeight: "bold", textTransform: "capitalize" }}
      >
        {row?.doctor?.fullName}
        <br />
        <Typography sx={{ color: "primary.darkGrey" }}>
          {row?.position}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <CustomDotMenu
          items={menuItems}
          disabled={completeAppointmentLoading}
        />
      </TableCell>
    </TableRow>
  );
};

export default function NurseSpecialistTable({
  data,
  isLoading,
  currentPage,
  handlePageChange,
}) {
  const modalRef = React.useRef(null);
  const [modalContent, setmodalContent] = React.useState({});

  const toggleModal = (detail) => {
    setmodalContent(detail);
    modalRef?.current?.handleToggle();
  };
  return (
    <>
      {isLoading ? (
        <CustomLoader />
      ) : data?.appointments?.length ? (
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
                {data?.appointments?.map((row, i) => (
                  <Row key={i} row={row} toggleModal={toggleModal} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack
            maxWidth={{
              xs: "95%",
              sm: "70%",
              lg: "95%",
            }}
          >
            <Pagination
              currentPage={currentPage}
              totalCount={data?.count || 10}
              pageSize={10}
              activeColor="secondary.main"
              onPageChange={handlePageChange}
            />
          </Stack>
        </>
      ) : (
        "No data found"
      )}
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          pt: 5,
          width: {
            xs: "95%",
            sm: "50vw",
          },
        }}
        ariaLabel="modal"
      >
        <RescheduleAppointmentModal
          modalContent={modalContent}
          closeModal={() => modalRef?.current?.handleToggle()}
          currentPage={currentPage}
        />
      </CustomModal>
    </>
  );
}
