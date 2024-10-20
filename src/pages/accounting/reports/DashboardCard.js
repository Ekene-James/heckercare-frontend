import { Stack, Typography } from "@mui/material";
import React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
function DashboardCard({
  icon,
  topText = "",
  middleText = "",
  bottomText = "",
}) {
  return (
    <Stack
      width={"100%"}
      alignItems="center"
      justifyContent={"center"}
      spacing={1}
      p={2}
      sx={{ border: "0.2px solid rgba(0,0,0,0.1)" }}
    >
      <Typography variant="body1" fontWeight={500}>
        {topText}
      </Typography>
      <Typography variant="displaySm">{middleText}</Typography>
      <Stack direction={"row"} spacing={1} alignItems="center">
        {icon}
        <Typography variant="subtitle2" fontSize={"0.75rem"}>
          {bottomText}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default DashboardCard;
