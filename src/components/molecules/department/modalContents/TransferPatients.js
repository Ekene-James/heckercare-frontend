import { Button, Divider, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import React from "react";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_WARD, GET_WARDS } from "utils/reactQueryKeys";

function TransferPatient({ handleClose, refetchWardOverview }) {
  const [to, setto] = React.useState("");
  const [from, setfrom] = React.useState("");
  const [patientId, setpatientId] = React.useState("");

  //get all wards
  const { data: wardData } = useCustomQuery(
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

  //get patients in a ward
  const { data: patients } = useCustomQuery(
    [GET_WARD, from],
    {
      url: `/wards/get-single-ward/${from}?search=`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!from,
      select: (data) =>
        data?.data?.patients.map((d) => {
          return {
            name: `${d.firstName} ${d.lastName}`,
            value: d._id,
          };
        }),
    }
  );

  //transfer patient from ward to ward

  const { mutate: handleTransfer, isLoading: transferLoading } =
    useCustomMutation(
      {
        url: `/wards/transfer-patient/${from}`,
        method: "patch",
        data: { patientId, wardId: to },
      },
      {
        onSuccess: () => {
          setpatientId("");
          setto("");
          setfrom("");
          refetchWardOverview();
          toast.success("Success");
          handleClose();
        },

        onError: (error) => toast.error(error.message),
      }
    );

  return (
    <Stack direction={"column"} spacing={2}>
      <Stack direction={"column"} spacing={0.5}>
        <Typography variant="displayMd">Transfer Patient</Typography>
      </Stack>

      <Divider />
      <Stack direction={"column"} spacing={1} sx={{ width: "50%" }}>
        <Typography variant="heading">Ward</Typography>

        <CustomSelect
          options={wardData || []}
          label="From"
          state={from}
          handleChange={(e) => setfrom(e.target.value)}
          name="from"
          haveTopLabel={true}
          placeholder="Select Starting ward"
        />
        <CustomSelect
          options={wardData || []}
          label="To"
          state={to}
          handleChange={(e) => setto(e.target.value)}
          name="to"
          haveTopLabel={true}
          placeholder="Select destination ward"
        />
        <CustomSelect
          options={patients || []}
          label="Patient"
          state={patientId}
          handleChange={(e) => setpatientId(e.target.value)}
          name="patientId"
          haveTopLabel={true}
          placeholder="Select Patient"
        />

        <Stack direction={"row"} spacing={1}>
          <Button
            variant="contained"
            color="secondary"
            disabled={transferLoading || !patientId}
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

export default TransferPatient;
