import { Grid } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import { useFormik } from "formik";
import React from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { GET_ALL_PHARMACY_REQUISITIONS } from "utils/reactQueryKeys";
const initialValues = {
  reason: "",
  comment: "",
};
const disputeTypes = [
  {
    name: "Wrong Specifications",
    value: "WRONG_SPECIFICATIONS",
  },
  {
    name: "Incorrect Quantity",
    value: "INCORRECT_QUANTITY",
  },
  {
    name: "Incorrect Item",
    value: "INCORRECT_ITEM",
  },
  {
    name: "Incorrect Unit",
    value: "INCORRECT_UNIT",
  },
  {
    name: "Incorrect Price",
    value: "INCORRECT_PRICE",
  },
  {
    name: "Incorrect Date",
    value: "INCORRECT_DATE",
  },
  {
    name: "Incorrect Date",
    value: "INCORRECT_BATCH",
  },
  {
    name: "Incorrect Expiry",
    value: "INCORRECT_EXPIRY",
  },
  {
    name: "Incorrect Manufacturer",
    value: "INCORRECT_MANUFACTURER",
  },
  {
    name: "Incorrect Supplier",
    value: "INCORRECT_SUPPLIER",
  },
  {
    name: "Incorrect Remarks",
    value: "INCORRECT_REMARKS",
  },
  {
    name: "Incorrect Others",
    value: "INCORRECT_OTHERS",
  },
  {
    name: "Invoicing Error",
    value: "INVOICING_ERROR",
  },
  {
    name: "Others",
    value: "OTHERS",
  },
];
function OpenDisputeModal({
  requisitionId,
  closeViewReqModal,
  closeDisputeModal,
}) {
  const queryClient = useQueryClient();
  const { handleChange, values } = useFormik({
    initialValues,
  });

  //start dispute
  const { mutate: startDispute, isLoading: startDisputeLoading } =
    useCustomMutation(
      {
        url: `/requisition/create-dispute/${requisitionId}`,
        method: "post",
        data: values,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(GET_ALL_PHARMACY_REQUISITIONS);

          toast.success("Success");
          closeDisputeModal();
          closeViewReqModal();
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
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        <CustomSelect
          options={disputeTypes}
          label="Select Dispute"
          state={values?.reason}
          handleChange={handleChange}
          name="reason"
          haveTopLabel={true}
          placeholder="Select"
        />
      </Grid>
      <Grid item xs={12} sm={6} />

      <Grid item xs={12} sm={6}>
        <CustomTextInput
          title="Others"
          value={values.comment}
          placeholder={"Start Typing"}
          name="comment"
          handleChange={handleChange}
          multiline
        />
      </Grid>
      <Grid item xs={12} sm={6} />
      <Grid item xs={8} sm={4}>
        <CustomButton
          text="Create Dispute"
          color="secondary"
          onClick={startDispute}
          disabled={startDisputeLoading}
        />
      </Grid>
    </Grid>
  );
}

export default OpenDisputeModal;
