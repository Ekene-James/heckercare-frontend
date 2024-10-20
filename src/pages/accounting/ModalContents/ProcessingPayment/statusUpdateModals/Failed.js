import { Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
function Failed({ close, setmodalType }) {
  return (
    <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
      <CancelIcon color="error" sx={{ fontSize: "80px" }} />
      <Typography variant="displaySm">Payment Failed ... Try Again</Typography>
      <Typography sx={{ textAlign: "center" }}>
        We're sorry, but we were unable to complete your payment due to an error
        on our end. Please try again later or contact our support team for
        further assistance.
      </Typography>
      <Stack
        direction="row"
        justifyContent={"space-between"}
        sx={{
          mt: 6,
        }}
      >
        <CustomButton
          text={"Go Back"}
          startIcon={<KeyboardBackspaceIcon />}
          onClick={() => setmodalType("update")}
          variant="containedBrown"
        />
      </Stack>
    </Stack>
  );
}

export default Failed;
