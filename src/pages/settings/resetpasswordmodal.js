import { Grid, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import React from "react";

export const ResetPasswordModal = () => {
  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "start",
        flexDirection: "column",
        width: "100%",
        gap: 4,
      }}
    >
      <Typography variant="displaySm">Password Reset</Typography>
      <Typography>
        A mail has been sent to “example@example.com” contaning a default
        password. if the user didn’t receive a mail, please close the window and
        click on the button to reset again
      </Typography>
      <CustomButton variant="contained" color="secondary" text="Ok, Continue" />
    </Stack>
  );
};
