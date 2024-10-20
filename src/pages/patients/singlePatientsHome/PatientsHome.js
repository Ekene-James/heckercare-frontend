import { Button, Container, Grid } from "@mui/material";
import TabBar from "pages/patients/singlePatientsHome/TabBar";
import BasicInfoSidebar from "components/molecules/patient/singlePatient/layout/BasicInfoSidebar";

import React from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Stack } from "@mui/system";
import CustomButton from "components/atoms/CustomButton";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_ALL_APPOINTMENTS_BY_PATIENT,
  GET_PATIENT_APPOINTMENT_HISTORY,
  GET_PATIENT_RECENT_VISIT,
  GET_RUNNING_APPOINTMENT_BY_PATIENT,
  GET_UPCOMING_APPOINTMENTS_BY_PATIENT,
} from "utils/reactQueryKeys";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import NonBasicInfoSidebar from "components/molecules/patient/singlePatient/layout/NonBasicInfoSidebar";

function PatientsHome() {
  const { pathname } = useLocation();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  let sideBar;

  //get recent visits
  const { data: recentVisit } = useCustomQuery(
    [GET_PATIENT_RECENT_VISIT, id],
    {
      url: `/visit/recent/${id}`,
      method: "get",
      avoidCancelling: true,
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  //get running appointments by patient
  const { data: runningAppointments, isLoading: runningAppointmentsLoading } =
    useCustomQuery(
      [GET_RUNNING_APPOINTMENT_BY_PATIENT, id],
      {
        url: `/appointments/get-running-appointment/${id}`,
        method: "get",
        avoidCancelling: true,
      },
      {
        refetchOnWindowFocus: false,
        avoidCancelling: true,
      }
    );

  //post create visit
  const { mutate: createVisit, isLoading: createVisitLoading } =
    useCustomMutation(
      {
        url: `/visit`,
        method: "post",
        data: {
          patientId: id,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_PATIENT_RECENT_VISIT, id]);
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
  //patch end visit
  const { mutate: endVisit, isLoading: endVisitLoading } = useCustomMutation(
    {
      url: `/visit/end/${recentVisit?.data?._id}`,
      method: "patch",
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_PATIENT_RECENT_VISIT, id]);
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
  // console.log(runningAppointments?.data);
  //complete appointment
  const { mutate: endAppointment, isLoading: endAppointmentLoading } =
    useCustomMutation(
      {
        url: `appointments/complete-appointment/${runningAppointments?.data?._id}`,
        method: "patch",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([
            GET_RUNNING_APPOINTMENT_BY_PATIENT,
            id,
          ]);
          queryClient.invalidateQueries({
            queryKey: [GET_UPCOMING_APPOINTMENTS_BY_PATIENT, id],
          });
          queryClient.invalidateQueries({
            queryKey: [GET_PATIENT_APPOINTMENT_HISTORY, id],
          });

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

  if (
    pathname === `/home/patient/basic-information/${id}` ||
    pathname === "/home/patient"
  ) {
    sideBar = <BasicInfoSidebar />;
  } else {
    sideBar = <NonBasicInfoSidebar />;
  }

  return (
    <Container sx={{ m: "0px !important", p: 0, maxWidth: "100% !important" }}>
      <TabBar />
      <Stack
        direction={{
          xs: "row",
        }}
        spacing={1}
        mt={2}
        sx={{ width: "100%" }}
        alignItems="flex-end"
        justifyContent={"flex-end"}
      >
        {!runningAppointmentsLoading &&
        typeof runningAppointments?.data === "object" &&
        Object.keys(runningAppointments?.data).length ? (
          <CustomButton
            text="End Appointment"
            variant="contained"
            color="warning"
            sx={{
              minWidth: "120px",
              fontSize: "11px",
              p: 0.75,
            }}
            onClick={endAppointment}
            disabled={endAppointmentLoading}
          />
        ) : null}

        {recentVisit?.data?.status === "ACTIVE" ? (
          <>
            <CustomButton
              text="End Visit"
              variant="contained"
              color="warning"
              sx={{
                minWidth: "120px",
                fontSize: "11px",
                p: 0.75,
              }}
              onClick={endVisit}
              disabled={endVisitLoading}
            />
          </>
        ) : (
          <CustomButton
            text="Start Visit"
            variant="contained"
            color="success"
            sx={{
              minWidth: "120px",
              fontSize: "11px",
              p: 0.75,
            }}
            onClick={createVisit}
            disabled={createVisitLoading}
          />
        )}
        <CustomButton
          text="Edit Patient"
          variant="contained"
          color="secondary"
          sx={{
            minWidth: "120px",
            fontSize: "11px",
            p: 0.75,
          }}
          onClick={() => navigate(`/home/patient/edit-patient/${id}`)}
        />
      </Stack>

      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12} lg={3}>
          {sideBar}
        </Grid>
        <Grid item xs={12} lg={9}>
          <Outlet />
        </Grid>
      </Grid>
    </Container>
  );
}

export default PatientsHome;
