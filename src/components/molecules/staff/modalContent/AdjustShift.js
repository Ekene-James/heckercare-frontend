import { Grid, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomDatePicker from "components/atoms/DatePicker";
import CustomSelect from "components/atoms/Select";
import moment from "moment";

import React from "react";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { convertFromMilitaryTime } from "utils/convertFromMillitaryTime";

import { GET_SHIFT_TYPES } from "utils/reactQueryKeys";
const formarTime = (time) => moment(time).format("HH:mm");
function AdjustShift({ handleClose }) {
  const [shiftType, setshiftType] = React.useState("");

  const [selectedShiftDuration, setselectedShiftDuration] = React.useState({});
  const [time, settime] = React.useState({
    endTime: null,
    startTime: null,
  });

  //get all shifts
  const { data: shiftTypes } = useCustomQuery(
    GET_SHIFT_TYPES,
    {
      url: `/shifts`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const formartedData = data.data.map((shift) => {
          return { ...shift, name: shift.name, value: shift._id };
        });
        return formartedData;
      },
    }
  );

  //Adjust shift
  const { mutate, isLoading } = useCustomMutation(
    {
      url: `/shifts/adjust-shift/${shiftType}`,
      method: "patch",
      data: {
        startTime: formarTime(time.startTime),
        endTime: formarTime(time.endTime),
      },
    },
    {
      onSuccess: () => {
        toast.success("Success");
        setshiftType("");
        settime({
          endTime: "",
          startTime: "",
        });
        handleClose(true);
      },

      onError: (error) => toast.error(error.message),
    }
  );

  const handleChange = (e) => {
    const selectedShift = shiftTypes.filter(
      (shift) => shift._id === e.target.value
    );

    if (selectedShift.length)
      setselectedShiftDuration({
        startTime: convertFromMilitaryTime(selectedShift[0].startTime),
        endTime: convertFromMilitaryTime(selectedShift[0].endTime),
      });

    setshiftType(e.target.value);
  };

  const handleSelectDate = (timing, name) => {
    // const formarTime = (time) =>
    // `${new Date(time).getHours()}:${new Date(time).getMinutes()}`;

    settime((prev) => ({
      ...prev,
      [name]: timing,
    }));
  };
  return (
    <Stack
      direction={"column"}
      spacing={3}
      p={2}
      sx={{
        width: {
          xs: "100%",
          md: "70%",
        },
      }}
    >
      <Stack direction={"column"} spacing={1} justifyContent="flex-start">
        <Typography variant="displaySm">Adjust Shifts</Typography>
      </Stack>

      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <CustomSelect
            options={shiftTypes}
            label="Shift Type"
            state={shiftType}
            handleChange={handleChange}
            name="shiftType"
            haveTopLabel={true}
            placeholder="Select from list"
            defaultValue={""}
          />
        </Grid>
        {Object.keys(selectedShiftDuration).length ? (
          <Grid item xs={12} sm={6}>
            <Typography sx={{ opacity: 0.5 }}>Shift Starts From :</Typography>
            <Typography variant="caption">
              {selectedShiftDuration?.startTime}
            </Typography>
          </Grid>
        ) : null}
        {Object.keys(selectedShiftDuration).length ? (
          <Grid item xs={12} sm={6}>
            <Typography sx={{ opacity: 0.5 }}>Ends At :</Typography>
            <Typography variant="caption">
              {selectedShiftDuration?.endTime}
            </Typography>
          </Grid>
        ) : null}

        <Grid item xs={12} variant="heading">
          <Typography variant="heading">Day</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomDatePicker
            type="time"
            title="From"
            size="small"
            datePickerRootSx={{ height: "auto" }}
            datePickerSx={{ width: "100%" }}
            placeholder="From"
            name="startTime"
            setdate={handleSelectDate}
            date={time?.startTime}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomDatePicker
            type="time"
            title="To"
            size="small"
            datePickerRootSx={{ height: "auto" }}
            datePickerSx={{ width: "100%" }}
            placeholder="To"
            name="endTime"
            setdate={handleSelectDate}
            date={time?.endTime}
          />
        </Grid>
      </Grid>
      <Stack direction={"row"} spacing={1} alignItems="center">
        <CustomButton
          text={"Save"}
          color="secondary"
          onClick={mutate}
          disabled={isLoading}
        />
        <CustomButton
          text={"Cancel"}
          variant="containedBrown"
          onClick={handleClose}
        />
      </Stack>
    </Stack>
  );
}

export default AdjustShift;
