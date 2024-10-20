import { Box, Chip, Stack, Typography } from "@mui/material";
import React from "react";

function ViewReportNote({ item }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        p: 2,
        backgroundColor: "rgba(105, 86, 229, 0.05)",
        width: "100%",
      }}
    >
      <Typography
        sx={{ fontWeight: "bold", mb: 1, color: "secondary.main" }}
        className="assesment_report_title"
      >
        {item?.title || item?.topic}
      </Typography>
      <Box
        sx={{
          p: 1,
          pl: 2,
        }}
        className="assesment_report_message"
      >
        <Typography variant="body1">{item?.body || item?.note}</Typography>
      </Box>
      <Box
        sx={{
          mt: 1,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction={"row"} spacing={1}>
          {item?.tags?.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              sx={{
                fontSize: {
                  xs: "0.5em",
                  sm: "0.7em",
                },
              }}
              className="assesment_report_tag"
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default ViewReportNote;
