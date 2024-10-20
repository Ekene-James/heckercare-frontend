import { Box, Typography } from "@mui/material";

import React from "react";
import ScheduleComponent from "./ScheduleComponent";

function Appointments() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="displayMd">Appointment</Typography>
      </Box>
      <ScheduleComponent />
    </Box>
  );
}

export default Appointments;
