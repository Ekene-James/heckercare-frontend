import { Box, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import React, { useState } from "react";

function UpdateStatus({
  rejectLoading,
  reject,
  approve,
  approveLoading,
  transactionDetails,
}) {
  const [reference, setreference] = useState("");

  return (
    <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
      <Typography variant="displaySm">Status Update</Typography>
      <Typography sx={{ textAlign: "center" }}>
        Having confirmed the patients affliation with the provided, kindly
        respond to the response below to change the status of this transaction
      </Typography>
      <Box sx={{ width: "80%" }}>
        <CustomTextInput
          title=""
          value={reference}
          placeholder={"Reference from HMO Provider"}
          name="reference"
          handleChange={(e) => setreference(e.target.value)}
          sx={{ width: "100%" }}
        />
      </Box>
      <Stack
        direction="row"
        justifyContent={"space-between"}
        sx={{
          mt: 6,
          width: {
            xs: "100%",
            sm: "60%",
          },
        }}
      >
        <CustomButton
          text={"Approve"}
          color="secondary"
          onClick={() =>
            approve({
              reference,
              paymentIds: transactionDetails.payments.map(
                (transaction) => transaction._id
              ),
            })
          }
          disabled={approveLoading}
          sx={{ width: "48%" }}
        />
        <CustomButton
          text={"Reject"}
          variant="containedBrown"
          onClick={() =>
            reject({
              paymentIds: transactionDetails.payments.map(
                (transaction) => transaction._id
              ),
            })
          }
          disabled={rejectLoading}
          sx={{ width: "48%" }}
        />
      </Stack>
    </Stack>
  );
}

export default UpdateStatus;
