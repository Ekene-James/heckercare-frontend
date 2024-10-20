import { Button, Divider, Stack, Typography } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import React from "react";
import CustomDatePicker from "components/atoms/DatePicker";
import CustomButton from "components/atoms/CustomButton";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { GET_ALL_PENDING_TRANSACTIONS } from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";

function Remove({ bedDetails, handleClose, refetchWard, wardDetails }) {
  const queryClient = useQueryClient();
  const [formsState, setformsState] = React.useState({
    reasonForRemoval: "Death",
    reasonForDeath: "",
    date: new Date(),
    patientId: bedDetails._id,
  });

  //remove patient

  const { mutate: remove, isLoading: removeLoading } = useCustomMutation(
    {
      url: `/wards/discharge-patient-from-ward/${wardDetails._id}`,
      method: "patch",
      data: {
        date: formsState.date,
        patientId: bedDetails._id,
      },
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_ALL_PENDING_TRANSACTIONS]);

        refetchWard();
        toast.success("Success");
        handleClose();
      },

      onError: (error) => toast.error(error.message),
    }
  );
  //remove dead patient

  const { mutate: removeDeceased, isLoading: deceasedLoading } =
    useCustomMutation(
      {
        url: `/wards/record-death/${wardDetails._id}`,
        method: "patch",
        data: {
          reasonForDeath: formsState.reasonForDeath,
          patientId: bedDetails._id,
        },
      },
      {
        onSuccess: () => {
          refetchWard();
          toast.success("Success");
          handleClose();
        },

        onError: (error) => toast.error(error.message),
      }
    );

  const handleChange = (e) => {
    setformsState({
      ...formsState,
      [e.target.name]: e.target.value,
    });
  };
  const handleSelectDate = (date) => {
    setformsState({
      ...formsState,
      date: date,
    });
  };

  const handleRemove = () => {
    if (formsState.reasonForRemoval === "Death") {
      if (!formsState.reasonForDeath)
        return toast.error("reason for death cant be empty");
      removeDeceased();
    } else {
      remove();
    }
  };

  return (
    <Stack direction={"column"} spacing={2}>
      <Stack direction={"column"} spacing={0.5}>
        <Typography variant="displayMd">Remove Patient</Typography>
      </Stack>

      <Divider />
      <Stack direction={"column"} spacing={1} sx={{ width: "50%" }}>
        <Typography variant="heading">Ward</Typography>

        <CustomSelect
          options={["Discharge", "Death"]}
          label="Reasons for Removal"
          state={formsState.reasonForRemoval}
          handleChange={handleChange}
          name="reasonForRemoval"
          haveTopLabel={true}
          placeholder="Select reason"
        />
        {formsState.reasonForRemoval === "Death" ? (
          <CustomTextInput
            title="Reason for Death "
            value={formsState.reasonForDeath}
            name="reasonForDeath"
            handleChange={handleChange}
            boxSx={{ width: "100%" }}
            multiline={true}
            helperText={`${formsState.reasonForDeath.length} / 200`}
          />
        ) : (
          <Stack direction={"column"} spacing={1}>
            <CustomTextInput
              title="Patient Name"
              value={`${bedDetails.firstName} ${bedDetails.lastName}`}
              name="patient"
              readOnly={true}
              boxSx={{ width: "100%" }}
            />
            <CustomDatePicker
              type="date"
              views={["year", "month", "day"]}
              title="Date"
              disableFuture={true}
              datePickerRootSx={{ height: "auto" }}
              setdate={handleSelectDate}
              date={formsState?.date}
            />
          </Stack>
        )}
        <Stack direction={"row"} spacing={1}>
          <Button
            variant="contained"
            color="secondary"
            disabled={removeLoading || deceasedLoading}
            onClick={handleRemove}
          >
            Submit
          </Button>
          <CustomButton
            variant="containedBrown"
            onClick={handleClose}
            text="Cancel"
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Remove;
