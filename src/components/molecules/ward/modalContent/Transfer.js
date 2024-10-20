import { Button, Divider, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import React from "react";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_WARDS } from "utils/reactQueryKeys";

function Transfer({ wardDetails = {}, handleClose, refetchWard, bedDetails }) {
  const [to, setto] = React.useState("");

  //get all wards
  const {
    isLoading: wardLoading,

    data: wardData,
    refetch: refetchWardDetails,
  } = useCustomQuery(
    GET_WARDS,
    {
      url: `/wards/get-all-wards`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (data) =>
        data?.data?.wards.map((d) => {
          return {
            name: d.name,
            value: d._id,
          };
        }),
    }
  );

  //transfer patient from ward to ward
  const id = wardDetails?._id;
  const { mutate: handleTransfer, isLoading: transferLoading } =
    useCustomMutation(
      {
        url: `/wards/transfer-patient/${id}`,
        method: "patch",
        data: { patientId: bedDetails?._id, wardId: to },
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
    setto(e.target.value);
  };
  return (
    <Stack direction={"column"} spacing={2}>
      <Stack direction={"column"} spacing={0.5}>
        <Typography variant="displayMd">Transfer Patient</Typography>
      </Stack>

      <Divider />
      <Stack direction={"column"} spacing={1} sx={{ width: "50%" }}>
        <Typography variant="heading">Ward</Typography>
        <CustomTextInput
          title="From "
          value={wardDetails?.name}
          name="from"
          readOnly={true}
          boxSx={{ width: "100%" }}
        />
        <CustomSelect
          options={wardData || []}
          label="To"
          state={to}
          handleChange={handleChange}
          name="to"
          haveTopLabel={true}
          placeholder="Select destination ward"
        />
        <Stack direction={"row"} spacing={1}>
          <Button
            variant="contained"
            color="secondary"
            disabled={transferLoading}
            onClick={handleTransfer}
          >
            Transfer
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

export default Transfer;
