import { Box, Divider, Typography } from "@mui/material";
import React from "react";

function CaptionWithDivider({ caption }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        component="div"
        sx={{
          color: "gray",
          textAlign: "start",
        }}
      >
        {caption}
      </Typography>
      <Divider
        sx={{
          "&.MuiDivider-root": {
            borderColor: "gray",
            opacity: 0.5,
          },
        }}
      />
    </Box>
  );
}

export default CaptionWithDivider;
