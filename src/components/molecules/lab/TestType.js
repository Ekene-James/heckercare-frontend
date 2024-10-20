import { Box, Stack, Typography } from "@mui/material";
import React from "react";

function TestType({ header, desc, count }) {
  return (
    <Stack
      direction={"row"}
      spacing={2}
      alignItems="center"
      justifyContent={"space-between"}
      sx={{
        p: 2,
        backgroundColor: "secondary.main",
        borderRadius: "5px",
        width: "100%",
      }}
    >
      <Stack direction={"column"} spacing={1}>
        <Typography variant="heading" sx={{ color: "primary.lightest" }}>
          {header}
        </Typography>
        <Typography
          variant="caption"
          sx={{ opacity: "0.7", color: "primary.lightest" }}
        >
          {desc}
        </Typography>
      </Stack>
      <Stack
        alignItems="center"
        justifyContent={"center"}
        sx={{
          height: "40px",
          width: "40px",
          borderRadius: "50%",
          color: "secondary.main",
          backgroundColor: "background.custom",
          fontWeight: "bold",
          p: 1,
        }}
      >
        {count}
      </Stack>
    </Stack>
  );
}

export default TestType;
