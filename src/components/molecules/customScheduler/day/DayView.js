import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import CustomDatePicker from "components/atoms/DatePicker";
import React from "react";
import Row from "./Row";
import { times } from "../staticData";
import TableTop from "./TableTop";
import { daysOfThWeek } from "../util";
import CustomLoader from "components/atoms/CustomLoader";
const d = {
  day: "",
  et: "",
  st: "",
  shiftName: "",
  fullDate: "",
  staffDetails: [],
};

const sampleData = [
  {
    id: 1,
    doctorDetails: {
      name: "Dr. Sam",
      imgUrl: "",
    },
    shifts: [
      {
        startTime: 9,
        endTime: 14,
        shiftName: "Morning shift",
      },
      {
        startTime: 14,
        endTime: 20,
        shiftName: "Afternon shift",
      },
    ],
  },
  {
    id: 1,
    doctorDetails: {
      name: "Dr. Jane",
      imgUrl: "",
    },
    shifts: [
      {
        startTime: 9,
        endTime: 14,
        shiftName: "Morning shift",
      },
      {
        startTime: 20,
        endTime: 24,
        shiftName: "Night shift",
      },
    ],
  },
];
function DayView({ apiData = [], currentDay, isLoading }) {
  return (
    <>
      {isLoading ? (
        <CustomLoader />
      ) : apiData.length ? (
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650, borderCollapse: "separate", p: 4, pl: 0 }}
            aria-label="simple table"
          >
            <TableTop />
            <TableBody>
              {apiData.map((row, i) => (
                <Row key={i} data={row} i={i} currentDay={currentDay} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography p={4}>No data to display</Typography>
      )}
    </>
  );
}
//groupBy day,then by doctor

export default DayView;
