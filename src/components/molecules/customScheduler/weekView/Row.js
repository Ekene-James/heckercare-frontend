import React from "react";
import DefaultCelltype from "./DefaultCelltype";
import { cellHeight } from "../staticData";
import AppointmentCellType from "./AppointmentCellType";

const { TableCell, TableRow } = require("@mui/material");

const Row = ({ time, weekDays = [], apiData, cellType }) => {
  return (
    <TableRow
      sx={{
        height: cellHeight,
        position: "relative",
      }}
    >
      <TableCell
        component="th"
        scope="row"
        align="left"
        sx={{ border: "1px solid rgba(224, 224, 224, 1)", width: "50px" }}
      >
        {time.normalTime}
      </TableCell>
      <TableCell
        component="th"
        scope="row"
        align="left"
        sx={{
          border: "1px solid rgba(224, 224, 224, 1)",
          position: "relative",
          "&::before": {
            content: '" "',
            top: "50%",
            left: "0%",
            height: "1px",
            width: "100%",
            backgroundColor: "rgba(224, 224, 224, 1)",
            position: "absolute",
            zIndex: 0,
          },
        }}
      >
        {cellType === "default" ? (
          <DefaultCelltype
            weekDay={weekDays[0]}
            time={time}
            apiData={apiData}
          />
        ) : (
          <AppointmentCellType
            weekDay={weekDays[0]}
            time={time}
            apiData={apiData}
          />
        )}
      </TableCell>
      <TableCell
        align="left"
        sx={{
          border: "1px solid rgba(224, 224, 224, 1)",
          position: "relative",
          "&::before": {
            content: '" "',
            top: "50%",
            left: "0%",
            height: "1px",
            width: "100%",
            backgroundColor: "rgba(224, 224, 224, 1)",
            position: "absolute",
          },
        }}
      >
        {cellType === "default" ? (
          <DefaultCelltype
            weekDay={weekDays[1]}
            time={time}
            apiData={apiData}
          />
        ) : (
          <AppointmentCellType
            weekDay={weekDays[1]}
            time={time}
            apiData={apiData}
          />
        )}
      </TableCell>
      <TableCell
        align="left"
        sx={{
          border: "1px solid rgba(224, 224, 224, 1)",
          position: "relative",
          "&::before": {
            content: '" "',
            top: "50%",
            left: "0%",
            height: "1px",
            width: "100%",
            backgroundColor: "rgba(224, 224, 224, 1)",
            position: "absolute",
          },
        }}
      >
        {cellType === "default" ? (
          <DefaultCelltype
            weekDay={weekDays[2]}
            time={time}
            apiData={apiData}
          />
        ) : (
          <AppointmentCellType
            weekDay={weekDays[2]}
            time={time}
            apiData={apiData}
          />
        )}
      </TableCell>
      <TableCell
        align="left"
        sx={{
          border: "1px solid rgba(224, 224, 224, 1)",
          position: "relative",
          "&::before": {
            content: '" "',
            top: "50%",
            left: "0%",
            height: "1px",
            width: "100%",
            backgroundColor: "rgba(224, 224, 224, 1)",
            position: "absolute",
          },
        }}
      >
        {cellType === "default" ? (
          <DefaultCelltype
            weekDay={weekDays[3]}
            time={time}
            apiData={apiData}
          />
        ) : (
          <AppointmentCellType
            weekDay={weekDays[3]}
            time={time}
            apiData={apiData}
          />
        )}
      </TableCell>
      <TableCell
        align="left"
        sx={{
          border: "1px solid rgba(224, 224, 224, 1)",
          position: "relative",
          "&::before": {
            content: '" "',
            top: "50%",
            left: "0%",
            height: "1px",
            width: "100%",
            backgroundColor: "rgba(224, 224, 224, 1)",
            position: "absolute",
          },
        }}
      >
        {cellType === "default" ? (
          <DefaultCelltype
            weekDay={weekDays[4]}
            time={time}
            apiData={apiData}
          />
        ) : (
          <AppointmentCellType
            weekDay={weekDays[4]}
            time={time}
            apiData={apiData}
          />
        )}
      </TableCell>
      <TableCell
        align="left"
        sx={{
          border: "1px solid rgba(224, 224, 224, 1)",
          position: "relative",
          "&::before": {
            content: '" "',
            top: "50%",
            left: "0%",
            height: "1px",
            width: "100%",
            backgroundColor: "rgba(224, 224, 224, 1)",
            position: "absolute",
          },
        }}
      >
        {cellType === "default" ? (
          <DefaultCelltype
            weekDay={weekDays[5]}
            time={time}
            apiData={apiData}
          />
        ) : (
          <AppointmentCellType
            weekDay={weekDays[5]}
            time={time}
            apiData={apiData}
          />
        )}
      </TableCell>
      <TableCell
        align="left"
        sx={{
          border: "1px solid rgba(224, 224, 224, 1)",
          position: "relative",
          "&::before": {
            content: '" "',
            top: "50%",
            left: "0%",
            height: "1px",
            width: "100%",
            backgroundColor: "rgba(224, 224, 224, 1)",
            position: "absolute",
          },
        }}
      >
        {cellType === "default" ? (
          <DefaultCelltype
            weekDay={weekDays[6]}
            time={time}
            apiData={apiData}
          />
        ) : (
          <AppointmentCellType
            weekDay={weekDays[6]}
            time={time}
            apiData={apiData}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default Row;
