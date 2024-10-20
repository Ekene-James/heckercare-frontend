import { Box, Button, Grid, Typography } from "@mui/material";

import CustomDatePicker from "components/atoms/DatePicker";

import React from "react";

import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";

import { useQueryClient } from "react-query";

import {
  GET_SPECIALIST_APPOINTMENTS,
  GET_UPCOMING_APPOINTMENTS_BY_PATIENT,
} from "utils/reactQueryKeys";

import CustomTextInput from "components/atoms/CustomTextInput";
import { useParams } from "react-router-dom";

const formatState = (state) => {
  const data = { ...state };
  delete data.department;
  return data;
};
const formatDate = (date) => {
  if (!date)
    return {
      yr: "",
      month: "",
      day: "",
    };
  const d = new Date(date);
  const yr = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return { yr, month, day };
};
const formatTime = (date) => {
  if (!date)
    return {
      hour: "",
      min: "",
    };
  const d = new Date(date);

  let hour = d.getHours();
  hour = hour < 10 ? `0${hour}` : hour;
  let min = d.getMinutes();
  min = min < 10 ? `0${min}` : min;
  return { hour, min };
};
function RescheduleAppointmentModal({ modalContent, closeModal, currentPage }) {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const [formsState, setformsState] = React.useState({
    startDate: "",
    startTime: "",
    endTime: "",
    // frequency: "",
    doctor: "",
    patient: "",
    // endFrequency: "",
    department: "",
  });
  const [date, setdate] = React.useState({});

  React.useMemo(() => {
    const {
      yr: startDateYr,
      month: startDateMnth,
      day: startDateDay,
    } = formatDate(modalContent?.startDateTime);
    // const {
    //   yr: endDateYr,
    //   month: endDateMnth,
    //   day: endDateDay,
    // } = formatDate(modalContent?.endDateTime);

    setformsState({
      ...formsState,
      startDate: `${startDateYr}-${startDateMnth}-${startDateDay}`,
      // endDate: `${endDateYr}-${endDateMnth}-${endDateDay}`,

      doctor: modalContent?.doctor?._id,
      patient: modalContent?.patient?._id,
    });

    setdate({
      ...formsState,
      startDate: new Date(modalContent?.startDateTime),
      // endDate: new Date(modalContent?.endDateTime),
    });
  }, [modalContent]);

  //reschedule appointmnent
  const {
    mutate: rescheduleAppointment,
    isLoading: rescheduleAppointmentLoading,
  } = useCustomMutation(
    {
      url: `/appointments/reschedule-appointment/${modalContent._id}`,
      method: "patch",
      data: formatState(formsState),
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          GET_UPCOMING_APPOINTMENTS_BY_PATIENT,
          id,

          {
            page: currentPage,
            limit: 10,
          },
        ]);
        queryClient.invalidateQueries([GET_SPECIALIST_APPOINTMENTS]);
        toast.success("Success");
        closeModal();
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }
        return toast.error(error.message);
      },
    }
  );

  const handleSelectDate = (date, name) => {
    setdate((prev) => {
      return {
        ...prev,
        [name]: date,
      };
    });

    const { yr, month, day } = formatDate(date);

    setformsState({
      ...formsState,
      [name]: `${yr}-${month}-${day}`,
    });
  };
  const handleSelectTime = (date, name) => {
    setdate((prev) => {
      return {
        ...prev,
        [name]: date,
      };
    });
    const { hour, min } = formatTime(date);

    setformsState({
      ...formsState,
      [name]: `${hour}:${min}`,
    });
  };

  return (
    <Box>
      <Typography variant={"h4"}>Reschedule Appointment</Typography>
      <Grid container spacing={1} sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={10}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <CustomTextInput
                title="Patient"
                value={`${modalContent?.patient?.firstName || ""} ${
                  modalContent?.patient?.lastName || ""
                }`}
                disabled="true"
                readOnly
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <CustomTextInput
                title="Appointment with"
                value={`${modalContent?.doctor?.firstName} ${modalContent?.doctor?.lastName}`}
                disabled="true"
                readOnly
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomDatePicker
                type="date"
                views={["year", "month", "day"]}
                title="Date"
                disableFuture={false}
                name="startDate"
                datePickerRootSx={{ height: "auto", width: "100%" }}
                datePickerSx={{ width: "100%" }}
                setdate={handleSelectDate}
                date={date?.startDate || null}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomDatePicker
                type="time"
                title="From"
                placeholder="Select from time"
                name="startTime"
                disableFuture={false}
                setdate={handleSelectTime}
                datePickerRootSx={{ height: "auto" }}
                date={date?.startTime || null}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomDatePicker
                type="time"
                title="To"
                name="endTime"
                placeholder="Select to time"
                disableFuture={false}
                setdate={handleSelectTime}
                datePickerRootSx={{ height: "auto" }}
                date={date?.endTime || null}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                color="secondary"
                sx={{ width: "168px" }}
                variant="contained"
                onClick={() => {
                  rescheduleAppointment();
                }}
                disabled={rescheduleAppointmentLoading}
              >
                Reschedule
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RescheduleAppointmentModal;
