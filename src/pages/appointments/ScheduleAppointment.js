import { Box, Stack, IconButton, Paper, Typography } from "@mui/material";
import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import CustomTab from "components/atoms/CustomTab";
import Specialist from "components/molecules/appointment/Specialist";
import Generalist from "components/molecules/appointment/Generalist";
const navItems = [
  {
    label: "Specialist/Consultant",

    id: 0,
  },
  {
    label: "Generalist",

    id: 1,
  },
];
function ScheduleAppointment() {
  const navigate = useNavigate();
  const [value, setvalue] = React.useState(0);

  let view;
  switch (value) {
    case 0:
      view = <Specialist />;
      break;
    case 1:
      view = <Generalist />;
      break;

    default:
      break;
  }
  return (
    <Box>
      <Stack direction={"column"} spacing={3}>
        <Stack direction={"column"} spacing={1}>
          <Typography variant="displayMd">
            Schedule a New Appointment
          </Typography>
        </Stack>
        <CustomTab navItems={navItems} value={value} setValue={setvalue} />
        {view}
      </Stack>
    </Box>
  );
}

export default ScheduleAppointment;
