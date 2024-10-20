import { Box, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomMenu from "components/atoms/CustomMenu";
import CustomSelect from "components/atoms/Select";
import React from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { GET_ACCOUNTING_REQUISITION_DISPUTE } from "utils/reactQueryKeys";
const statusOptions = [
  {
    name: "Rejected",
    value: "REJECTED",
  },
  {
    name: "Pending",
    value: "PENDING",
  },
  {
    name: "Resolved",
    value: "RESOLVED",
  },
];
function ViewRequisitionDisputeModal({ closeModal, data }) {
  const queryClient = useQueryClient();
  const [status, setstatus] = React.useState("");

  // update status
  const { mutate: updateStatus, isLoading: updateStatusLoading } =
    useCustomMutation(
      {
        url: `/accounting/toggle-dispute-status/${data._id}`,
        method: "patch",
        data: {
          status,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(GET_ACCOUNTING_REQUISITION_DISPUTE);
          setstatus("");
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

  return (
    <Stack spacing={4} p={2} m={0} sx={{ m: "0px !important" }}>
      <Typography variant="displayMd">Dispute Details</Typography>

      <Stack spacing={1}>
        <Typography variant="heading" opacity={0.4} sx={{ opacity: 0.5 }}>
          Selected Reason
        </Typography>
        <Typography variant="h5">{data?.comment}</Typography>
      </Stack>

      <CustomSelect
        options={statusOptions}
        label="Status"
        state={status}
        handleChange={(e) => setstatus(e.target.value)}
        name="status"
        haveTopLabel={true}
        placeholder="Select Status"
        boxSx={{
          width: {
            xs: "100%",
            sm: "50%",
          },
        }}
      />

      <Box>
        <CustomButton
          text={"Update Status"}
          color="secondary"
          onClick={updateStatus}
          disabled={updateStatusLoading}
        />
      </Box>
    </Stack>
  );
}

export default ViewRequisitionDisputeModal;
