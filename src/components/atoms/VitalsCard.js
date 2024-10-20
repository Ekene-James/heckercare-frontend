import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function VitalsCard({
  desc,
  number,
  unit,
  min,
  max,

  bottomColor = "green",
}) {
  return (
    <Paper
      sx={{
        pt: 1,
        borderBottom: `6px solid ${bottomColor}`,
        pl: 1,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Typography variant="subheading" sx={{ textAlign: "start" }}>
        {desc}
      </Typography>
      <Box
        sx={{
          display: "flex",
          ml: desc === "Pressure" ? 1 : 3,
          flexDirection: {
            xs: "row",
            md: "column",
            lg: "row",
          },
        }}
      >
        {+number > max ? (
          <ArrowDropUpIcon sx={{ fontSize: "15px", color: "orange" }} />
        ) : +number < min ? (
          <ArrowDropDownIcon sx={{ fontSize: "13px", color: "red" }} />
        ) : (
          <ArrowDropUpIcon sx={{ fontSize: "15px", color: "green" }} />
        )}
        <Typography
          variant="h6"
          sx={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            width: "100%",
            fontSize: desc === "Pressure" ? "0.85rem" : "1rem",
          }}
        >
          {number}
          <sub style={{ marginLeft: "3px" }}> {unit}</sub>
        </Typography>
      </Box>
    </Paper>
  );
}

export default VitalsCard;
