import { Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import React from "react";
import VerifiedIcon from "@mui/icons-material/Verified";

function Approved({ close }) {
  return (
    <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
      <VerifiedIcon color="success" sx={{ fontSize: "80px" }} />
      <Typography variant="displaySm">Payment has been approved</Typography>
      <Typography sx={{ textAlign: "center" }}>
        Your payment has been approved and a copy of the receipt is available to
        be downloaded
      </Typography>
      <Stack
        direction="row"
        justifyContent={"space-between"}
        sx={{
          mt: 6,
        }}
      >
        <CustomButton
          text={"Download Receipt"}
          color="secondary"
          onClick={() => {}}
          variant="text"
          //   sx={{ width: "48%" }}
        />
      </Stack>
    </Stack>
  );
}

export default Approved;
