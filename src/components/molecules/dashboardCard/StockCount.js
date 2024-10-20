import { Paper, Stack, Typography } from "@mui/material";
import React from "react";

import CustomMenu from "components/atoms/CustomMenu";
import CustomLineChart from "components/atoms/CustomLineChart";
const dropDownContent = [
  {
    name: "Today",
    value: "today",
  },
  {
    name: "This Week",
    value: "week",
  },
  {
    name: "This Month",
    value: "Month",
  },
];
const dropDownContent1 = [
  {
    name: "Pharmacy",
    value: "pharmacy",
  },
  {
    name: "Inventory",
    value: "inventory",
  },
  {
    name: "Laboratory",
    value: "lab",
  },
  {
    name: "Patient",
    value: "patient",
  },
  {
    name: "Staff",
    value: "staff",
  },
  {
    name: "Accounting",
    value: "accounting",
  },
];
const lineData = [
  {
    name: "Monday",
    "Number of Patients": 3500,
  },
  {
    name: "Tuesday",
    "Number of Patients": 3000,
  },
  {
    name: "Wednesday",
    "Number of Patients": 2000,
  },
  {
    name: "Thursday",
    "Number of Patients": 2780,
  },
  {
    name: "Friday",
    "Number of Patients": 1890,
  },
  {
    name: "Saturday",
    "Number of Patients": 2390,
  },
  {
    name: "Sunday",
    "Number of Patients": 3490,
  },
];

/**
 *
 * StockCount reusable component
 * @component
 *@property {function} icon the card icon
 *@property {string} smallTxt the card subheading
 *@property {string | number} bigTxt the card count number
 *@property {string} url the card url on click show more button
 *@property {object} icnBgSx the card styling
 * @return {React.ReactElement} LinkTab element with a box wrapper
 * @category Molecule
 *
 *
 *
 */
function StockCount({}) {
  const [views, setviews] = React.useState({
    name: "Today",
    value: "today",
  });
  const [views1, setviews1] = React.useState({
    name: "Pharmacy",
    value: "pharmacy",
  });
  return (
    <Paper
      sx={{
        p: 2,
        width: "100%",
        backgroundColor: "background.black",
        color: "white",
      }}
      aria-label="stock-count"
    >
      <Stack direction="column" spacing={0}>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Stack direction="column" spacing={0}>
            <Stack direction="row" alignItems={"flex-end"} spacing={0.2}>
              <Typography variant="heading" sx={{ fontWeight: "bold", m: 0 }}>
                STOCK COUNT
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  m: 0,
                  opacity: 0.5,
                  fontSize: "0.87rem",
                }}
              >
                /Amount
              </Typography>
            </Stack>

            <CustomMenu
              caption={views1.name}
              items={dropDownContent1}
              onClickItem={(view) => setviews1(view)}
              buttonSx={{
                fontSize: "0.65rem",
              }}
            />
          </Stack>
          <Stack direction="column" alignItems={"flex-start"} spacing={0.2}>
            <CustomMenu
              caption={views.name}
              items={dropDownContent}
              onClickItem={(view) => setviews(view)}
              buttonSx={{
                backgroundColor: "white",
                fontSize: "0.65rem",
                "&:hover": {
                  backgroundColor: "white",
                },
              }}
            />
            <CustomLineChart
              xVal="name"
              data={lineData}
              height="35px"
              showLabels={false}
              lines={[
                {
                  strokeColor: "#FB896B",
                  yVal: "Number of Patients",
                  showDot: true,
                },
              ]}
            />
          </Stack>
        </Stack>
        <Stack direction="row" alignItems={"flex-end"} spacing={0.2}>
          <Typography variant="heading" sx={{ fontWeight: "bold", m: 0 }}>
            2000
          </Typography>
          <Typography
            variant="caption"
            sx={{
              m: 0,
              opacity: 0.5,
              fontSize: "0.87rem",
            }}
          >
            / ₦4.200,000
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default StockCount;
