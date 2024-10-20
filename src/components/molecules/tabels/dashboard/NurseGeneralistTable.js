import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import CustomButton from "components/atoms/CustomButton";

import CustomLoader from "components/atoms/CustomLoader";
import { Grid, Stack, Typography } from "@mui/material";
import Pagination from "components/molecules/pagination/Pagination";
import moment from "moment";
import CustomModal from "components/atoms/CustomModal";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { GET_GENERALIST_APPOINTMENTS } from "utils/reactQueryKeys";
import { toast } from "react-toastify";

const Detail = ({ title, desc }) => {
  return (
    <Stack spacing={0.5}>
      <Typography variant="small">{title}</Typography>
      <Typography variant="heading">{desc}</Typography>
    </Stack>
  );
};

const Modal = ({ data }) => {
  return (
    <Stack spacing={2}>
      <Typography variant="displaySm">Appointment Detail</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Detail
            title={"Patient"}
            desc={`${data?.patient?.firstName} ${data?.patient?.lastName}`}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Detail title={"Department"} desc={data?.department?.name} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Detail title={"Average Time"} desc={data?.averageTime} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Detail title={"Order Number"} desc={data?.orderNumber} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Detail
            title={"Appointment Status"}
            desc={
              <Typography
                variant="heading"
                color={
                  data?.appointmentStatus === "completed"
                    ? "primary.success"
                    : "primary.main"
                }
                textTransform="capitalize"
              >
                {data?.appointmentStatus}
              </Typography>
            }
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

const Row = ({ row }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  //mark vitals done
  const { mutate: completeAppointment, isLoading: completeAppointmentLoading } =
    useCustomMutation(
      {
        url: `appointments/update-appointment/${row?._id}`,
        method: "patch",
        data: { status: "vitals done" },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_GENERALIST_APPOINTMENTS]);

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
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {moment(row?.createdAt).format("MMMM Do, YYYY")}
      </TableCell>

      <TableCell align="left" sx={{ fontWeight: "bold" }}>
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
          {`${row?.patient?.firstName} ${row?.patient?.lastName}`}
        </Stack>
      </TableCell>

      <TableCell align="center">
        <Stack direction={"row"} gap={2}>
          <CustomButton
            variant="custom"
            color="primary"
            text="Mark as Complete"
            disabled={completeAppointmentLoading}
            onClick={completeAppointment}
            rgb="105, 86, 229"
          />
          <CustomButton
            color="primary"
            text="Open"
            rgb="105, 86, 229"
            onClick={() =>
              navigate(`/home/patient/treatments/${row?.patient?._id}`)
            }
            variant="contained"
          />
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default function NurseGeneralistTable({
  data,
  isLoading,
  currentPage,
  handlePageChange,
}) {
  return (
    <>
      {isLoading ? (
        <CustomLoader />
      ) : data?.appointments?.length ? (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="general doctor table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Date
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Patient Name
                  </TableCell>

                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.appointments?.map((row) => (
                  <Row key={row?._id} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack>
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
    </>
  );
}
