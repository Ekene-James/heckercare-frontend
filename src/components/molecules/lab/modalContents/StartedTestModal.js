import { Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import React from "react";

function StartedTestModal({ handleClose }) {
  return (
    <Stack
      alignItems={"center"}
      justifyContent="center"
      spacing={2}
      sx={{ p: 4, pt: 6 }}
    >
      <Typography variant="heading">Test has Started Now</Typography>

      <Stack
        alignItems={"center"}
        justifyContent="center"
        direction={"row"}
        spacing={1}
      >
        <CustomButton
          variant="outlined"
          text={"Cancel"}
          onClick={handleClose}
        />
      </Stack>
    </Stack>
  );
}

export default StartedTestModal;
