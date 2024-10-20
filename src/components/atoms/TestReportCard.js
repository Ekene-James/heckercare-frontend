import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

function TestReportCard({ title, desc, reportedBy }) {
  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        p: 1,
        bgcolor: "background.custom",
        mt: 2,
      }}
    >
      <FiberManualRecordIcon sx={{ color: "orange" }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "start",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ fontSize: "13px" }} variant="h6">
          {title}
        </Typography>
        <Typography sx={{ fontSize: "10px" }} variant="body">
          {desc}
        </Typography>
        <Typography sx={{ fontSize: "9px" }} variant="body">
          Reported By: {reportedBy}
        </Typography>
      </Box>
    </Paper>
  );
}

export default TestReportCard;
