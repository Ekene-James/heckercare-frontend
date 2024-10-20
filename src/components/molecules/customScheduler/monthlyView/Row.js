import React from "react";
import CellComponent from "./Cell";
import { cellHeight, daysFromSunday, months } from "../staticData";

const { Box, Typography } = require("@mui/material");

const Row = ({ day, apiData }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: cellHeight,
      }}
    >
      <Typography>
        {daysFromSunday[day.getDay()]} {day.getDate()} {months[day.getMonth()]}
      </Typography>
      <CellComponent weekDay={day} apiData={apiData} />
    </Box>
  );
};

export default Row;
