import { Box } from "@mui/material";
import React from "react";

function TwoItemsCard({ children, flexDirection = "column" }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: flexDirection === "column" ? "flex-start" : "center",
        justifyContent: "space-between",
        flexDirection,
        textAlign: "start",
        width: "fit-content",
      }}
    >
      {children}
    </Box>
  );
}

export default TwoItemsCard;
