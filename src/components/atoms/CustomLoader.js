import { CircularProgress, Stack } from "@mui/material";
import React from "react";

function CustomLoader({ sx = {}, size = 60, thickness = 3.6 }) {
  return (
    <Stack
      direction={"row"}
      alignItems="center"
      justifyContent={"center"}
      sx={{ width: "100%", height: "50vh", ...sx }}
    >
      <CircularProgress size={size} thickness={thickness} />
    </Stack>
  );
}

export default CustomLoader;
