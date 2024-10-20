import { Box, Typography } from "@mui/material";
import React from "react";

function BasicvitalsText({ desc, text }) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 2,
        mb: 2,
      }}
    >
      <Typography sx={{ fontWeight: "bold" }} variant="caption">
        {desc}
      </Typography>
      <Typography sx={{ color: "gray" }} variant="caption">
        {text}
      </Typography>
    </Box>
  );
}

export default BasicvitalsText;
