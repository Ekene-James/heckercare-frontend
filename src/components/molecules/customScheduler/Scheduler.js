import { Box } from "@mui/material";
import React from "react";
import DayView from "./day/DayView";
import MonthlyView from "./monthlyView/MonthlyView";
import WeekViewScheduler from "./weekView/WeekViewScheduler";

function Scheduler({
  view,
  currentDay,
  apiData,
  cellType = "default",
  dayApiData = [],
  isLoading,
}) {
  let schedule;
  switch (view) {
    case "Week":
      schedule = (
        <WeekViewScheduler
          currentDay={currentDay}
          apiData={apiData}
          cellType={cellType}
        />
      );
      break;
    case "Day":
      schedule = (
        <DayView
          apiData={dayApiData}
          currentDay={currentDay}
          isLoading={isLoading}
        />
      );
      break;
    case "Month":
      schedule = (
        <MonthlyView
          currentDay={currentDay}
          apiData={apiData}
          cellType={cellType}
        />
      );
      break;

    default:
      break;
  }
  return <>{schedule}</>;
}

export default Scheduler;
