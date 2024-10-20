import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import CustomDatePicker from "components/atoms/DatePicker";
import React from "react";
import Row from "./Row";
import { times } from "../staticData";
import TableTop from "./TableTop";
import { daysOfThWeek } from "../util";
import { ConstructionOutlined } from "@mui/icons-material";

function WeekViewScheduler({ currentDay, apiData, cellType }) {
  const [weekDays, setweekDays] = React.useState([]);

  React.useMemo(() => setweekDays(daysOfThWeek(currentDay)), [currentDay]);
  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 650, overflow: "hidden" }}
        aria-label="simple table"
      >
        {weekDays?.length ? (
          <>
            <TableTop data={weekDays} />
            <TableBody>
              {times.map((row, i) => (
                <Row
                  key={i}
                  time={row}
                  i={i}
                  weekDays={weekDays}
                  apiData={apiData}
                  cellType={cellType}
                />
              ))}
            </TableBody>
          </>
        ) : null}
      </Table>
    </TableContainer>
  );
}

export default WeekViewScheduler;
