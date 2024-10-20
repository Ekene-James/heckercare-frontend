import React from "react";

import { cellWidth, timeWithInterval } from "../staticData";
import SpecialistCellType from "./SpecialistCelltype";
const { Stack, Typography } = require("@mui/material");
const { TableCell, TableRow } = require("@mui/material");

const Row = ({ data, currentDay }) => {
  const apiDay = data.day;
  const day = new Date(currentDay).getDate();

  return (
    <TableRow
      sx={{
        // height: 60,
        position: "relative",
        // width: "100%",
      }}
    >
      {apiDay === day ? (
        <>
          <TableCell
            component="th"
            scope="row"
            align="left"
            sx={{
              minWidth: "150px !important",
              borderBottom: "none",
              pt: 0.5,
              pb: 0.5,
            }}
          >
            <Stack
              direction={"row"}
              backgroundColor="background.custom"
              spacing={1}
              sx={{ width: "100%", alignItems: "center" }}
            >
              <img
                style={{ heigth: "100%", width: "30px" }}
                src={
                  data?.doctorDetails?.imgUrl ||
                  "/imgs/blank-profile-picture.png"
                }
                alt="docs_img"
              />
              <Typography variant="small" sx={{ fontWeight: "bold" }}>
                {data.doctorDetails.fullName}
              </Typography>
            </Stack>
          </TableCell>
          {timeWithInterval.map((interval) => (
            <TableCell
              key={interval.militaryTime}
              component="th"
              scope="row"
              align="left"
              sx={{
                border: "1px solid rgba(224, 224, 224, 1)",
                minWidth: cellWidth,
                position: "relative",
              }}
            >
              <SpecialistCellType
                interval={interval.militaryTime}
                shifts={data.shifts}
                currentDay={currentDay}
              />
            </TableCell>
          ))}
        </>
      ) : null}
    </TableRow>
  );
};

export default Row;
