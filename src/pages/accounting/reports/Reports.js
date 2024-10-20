import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";

import React from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import CustomDatePicker from "components/atoms/DatePicker";
import CustomButton from "components/atoms/CustomButton";
import CustomLineChart from "components/atoms/CustomLineChart";
import CustomMenu from "components/atoms/CustomMenu";
import CustomPieChart from "components/atoms/CustomPieChart";
import DateRangePicker from "components/atoms/dateRangePicker/DateRangePicker";
import PrintIcon from "@mui/icons-material/Print";
import DashboardCard from "./DashboardCard";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { currencyFormatter, numberFormatter } from "utils/numberFormatter";
import {
  GET_ACCOUNTING_REPORTS,
  GET_ACCOUNTING_REPORTS_PAYMENT_METHOD,
  GET_ALL_TRANSACTIONS,
  GET_LINE_CHART_DATA,
} from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

const formatDate = (date) => {
  if (!date) return;

  const copy = new Date(date);
  return [
    copy.getFullYear(),
    padTo2Digits(copy.getMonth() + 1),
    padTo2Digits(copy.getDate()),
  ].join("-");
};

function Reports({ lineData, dropDownContent, pieData, pieData1 }) {
  const [views, setviews] = React.useState({ name: "Weekly", value: "Week" });
  const [activeBtn, setactiveBtn] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setsearch] = React.useState("");

  const [date, setdate] = React.useState([]);
  const PageSize = 10;

  //get date
  const getDate = (date) => {
    if (date) {
      const newDate = new Date(date);
      const yr = newDate.getFullYear();
      const month = newDate.getMonth() + 1;
      const day = newDate.getDate();
      return `${yr}-${month}-${day}`;
    }
    return "";
  };

  //get wards
  const {
    isLoading: lineChartDataLoading,
    isError: lineChartDataError,
    data: lineChartData,
    refetch: refetchLineChartData,
  } = useCustomQuery(
    [GET_LINE_CHART_DATA, views],
    {
      url: `/accounting/report-second-column?data=${views?.name?.toLowerCase()}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //get all transactions
  const { data: reportData } = useCustomQuery(
    [
      GET_ACCOUNTING_REPORTS,
      {
        // search,
        page: currentPage,
        limit: PageSize,
        startDate: date ? formatDate(date[0]) : null,
        endDate: date ? formatDate(date[1]) : null,
      },
    ],
    {
      url: `/accounting/report-first-column`,
      method: "post",
      data: {
        search: "",
        page: currentPage,
        limit: PageSize,
        startDate: date ? formatDate(date[0]) : null,
        endDate: date ? formatDate(date[1]) : null,
      },
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  const handleBtnClick = (btn) => {
    if (btn === 0) {
      // 'make call for visits'
    } else {
    }
    setactiveBtn(btn);
  };

  const handleClickDropdownItem = (item) => {
    setviews(item);
  };

  //reset transaction type chart data
  let transactionTypeChartData = [
    {
      name: "Prescription Transactions",
      fill: "#222222",
      value: reportData?.data?.pharmacyNumber || 0,
    },
    {
      name: "Investigation Transactions",
      fill: "#EC8E02",
      value: reportData?.data?.laboratoryNumber || 0,
    },
    {
      name: "Consultation Transactions",
      fill: "purple",
      value: reportData?.data?.consultationNumber || 0,
    },
    {
      name: "Admission Transactions",
      fill: "violet",
      value: reportData?.data?.admissionNumber || 0,
    },
  ];

  let paymentMethodChartData = [
    {
      name: "Cash",
      fill: "#008435",
      value: reportData?.data?.cashNumber || 0,
    },
    {
      name: "Card",
      fill: "#5AC8FA",
      value: reportData?.data?.cardNumber || 0,
    },
    {
      name: "HMO",
      fill: "orange",
      value: reportData?.data?.hmoNumber || 0,
    },
  ];

  let view;

  switch (activeBtn) {
    case 0:
      view = (
        <CustomLineChart
          xVal={
            views.name === "Weekly"
              ? "dayOfWeek"
              : views.name === "Monthly"
              ? "month"
              : "year"
          }
          height="650px"
          data={lineChartData?.data?.bills || []}
          type="linear"
          lines={[
            {
              strokeColor: "#FB896B",
              yVal: "totalCost",
              showDot: true,
            },
          ]}
        />
      );
      break;
    case 1:
      view = (
        <CustomLineChart
          xVal={
            views.name === "Weekly"
              ? "day"
              : views.name === "Monthly"
              ? "monthName"
              : "year"
          }
          type="linear"
          height="650px"
          data={lineChartData?.data?.dispute || []}
          lines={[
            {
              strokeColor: "#FB896B",
              yVal: "totalAmount",
              showDot: true,
            },
          ]}
        />
      );
      break;
    case 2:
      view = (
        <CustomLineChart
          xVal={
            views.name === "Weekly"
              ? "dayOfWeek"
              : views.name === "Monthly"
              ? "month"
              : "year"
          }
          type="linear"
          height="650px"
          data={lineChartData?.data?.expenses || []}
          lines={[
            {
              strokeColor: "#FB896B",
              yVal: "totalCost",
              showDot: true,
            },
          ]}
        />
      );
      break;

    default:
      break;
  }

  const handleReset = () => {
    setdate([]);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="displayLg">Reports</Typography>

      <Paper sx={{ p: 3 }}>
        <Stack
          alignItems={"center"}
          justifyContent="flex-end"
          width={"100%"}
          direction={"row"}
          spacing={1}
        >
          <Box sx={{ display: "flex" }}>
            <DateRangePicker
              calendarSx={{
                left: "10",
              }}
              values={date}
              setValues={setdate}
              placeholder="Select date range"
            />
            <Grid item xs={1} sx={{ display: "flex", justifyContent: "end" }}>
              <Button variant="text" onClick={handleReset}>
                Reset
              </Button>
            </Grid>
          </Box>

          {/* <CustomButton
            text={"Export"}
            variant="outlined"
            color="primary"
            startIcon={<PrintIcon />}
            // onClick={handleExport}
          /> */}
        </Stack>

        <Grid container spacing={1} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <DashboardCard
              topText="Total Transactions"
              icon={
                date?.length === 0 &&
                (reportData?.data
                  ?.percentageIncreaseOrDecreaseInNumberOfSuccessfulPayments >
                0 ? (
                  <ArrowUpwardIcon color="success" fontSize="17px" />
                ) : (
                  <ArrowDownwardIcon color="error" fontSize="17px" />
                ))
              }
              middleText={currencyFormatter(
                reportData?.data?.totalTransactionCost || 0
              )}
              bottomText={
                date?.length === 0 &&
                `${numberFormatter(
                  reportData?.data
                    ?.percentageIncreaseOrDecreaseInNumberOfSuccessfulPayments ||
                    0
                )}% Since yesterday`
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DashboardCard
              icon={
                date?.length === 0 &&
                (reportData?.data?.percentageIncreaseInDisputes > 0 ? (
                  <ArrowUpwardIcon color="success" fontSize="17px" />
                ) : (
                  <ArrowDownwardIcon color="error" fontSize="17px" />
                ))
              }
              topText="Total Disputes"
              middleText={numberFormatter(reportData?.data?.totalDisputes || 0)}
              bottomText={
                date?.length === 0 &&
                `${numberFormatter(
                  reportData?.data?.percentageIncreaseInDisputes || 0
                )}% Since yesterday`
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DashboardCard
              icon={
                date?.length === 0 &&
                (reportData?.data?.requisitionPercentageIncrease > 0 ? (
                  <ArrowUpwardIcon color="success" fontSize="17px" />
                ) : (
                  <ArrowDownwardIcon color="error" fontSize="17px" />
                ))
              }
              topText="Total Requisition"
              middleText={numberFormatter(
                reportData?.data?.totalRequisitionCount || 0
              )}
              bottomText={
                date?.length === 0 &&
                `${numberFormatter(
                  reportData?.data?.requisitionPercentageIncrease || 0
                )}% Since yesterday`
              }
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Stack
              direction="column"
              spacing={2}
              width="100%"
              sx={{ border: "0.2px solid rgba(0,0,0,0.1)", mt: 1, p: 2 }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems="start"
                spacing={1}
                width="100%"
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="start"
                  alignItems="start"
                  spacing={1}
                  mb={4}
                >
                  <CustomButton
                    text={"Revenue Generated"}
                    variant={activeBtn === 0 ? "contained" : "outlined"}
                    color={activeBtn === 0 ? "secondary" : "primary"}
                    onClick={handleBtnClick.bind(this, 0)}
                  />
                  <CustomButton
                    text={"Dispute Settled"}
                    variant={activeBtn === 1 ? "contained" : "outlined"}
                    color={activeBtn === 1 ? "secondary" : "primary"}
                    onClick={handleBtnClick.bind(this, 1)}
                  />
                  <CustomButton
                    text={"Expenses"}
                    variant={activeBtn === 2 ? "contained" : "outlined"}
                    color={activeBtn === 2 ? "secondary" : "primary"}
                    onClick={handleBtnClick.bind(this, 2)}
                  />
                </Stack>
                <CustomMenu
                  caption={views.name}
                  items={dropDownContent}
                  onClickItem={handleClickDropdownItem}
                  popperSx={{ width: "7.5%" }}
                />
              </Stack>
              {view}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack spacing={2} sx={{ width: "100%" }}>
              <Stack
                spacing={1}
                sx={{
                  width: "100%",
                  border: "0.2px solid rgba(0,0,0,0.1)",
                  mt: 1,
                  p: 1,
                }}
                direction={{ xs: "column", sm: "row" }}
              >
                <CustomPieChart
                  data={transactionTypeChartData}
                  title="Transaction Types"
                  xs={12}
                  sm={12}
                  innerRadius={45}
                  outerRadius={80}
                  showValue={true}
                  width="97%"
                  // height="400px"
                  roundedLabelColor
                  smallLabel
                />
              </Stack>

              <Stack
                spacing={1}
                sx={{
                  width: "100%",
                  border: "0.2px solid rgba(0,0,0,0.1)",
                  mt: 2,
                  p: 2,
                }}
                direction={{ xs: "column" }}
              >
                <Stack
                  direction={"row"}
                  justifyContent="flex-end"
                  width={"100%"}
                >
                  {/* <CustomMenu
                    caption={views.name}
                    items={dropDownContent}
                    onClickItem={handleClickDropdownItem}
                    popperSx={{ width: "7.5%" }}
                  /> */}
                </Stack>
                <CustomPieChart
                  data={paymentMethodChartData}
                  title="Payment Method"
                  xs={12}
                  sm={12}
                  innerRadius={45}
                  outerRadius={80}
                  width="97%"
                  height="400px"
                  showValue={true}
                  roundedLabelColor
                  smallLabel
                />
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
}

Reports.defaultProps = {
  pieData1: [
    {
      name: "Patients",
      fill: "#222222",
      value: 1000,
    },
    {
      name: "Laboratory",
      fill: "#EC8E02",
      value: 200,
    },
    {
      name: "Pharmacy",
      fill: "#2F80ED",
      value: 300,
    },
  ],
  pieData: [
    {
      name: "POS",
      fill: "#5AC8FA",
      value: 200,
    },
    {
      name: "Deposit",
      fill: "#008435",
      value: 1000,
    },
    {
      name: "HMO",
      fill: "#D70015",
      value: 300,
    },
  ],

  dropDownContent: [
    {
      name: "Weekly",
      value: "Week",
    },
    {
      name: "Monthly",
      value: "Month",
    },
    {
      name: "Yearly",
      value: "Year",
    },
  ],
  lineData: [
    {
      name: "Monday",
      "Days (week, month, year)": 3500,
    },
    {
      name: "Tuesday",
      "Days (week, month, year)": 3000,
    },
    {
      name: "Wednesday",
      "Days (week, month, year)": 2000,
    },
    {
      name: "Thursday",
      "Days (week, month, year)": 2780,
    },
    {
      name: "Friday",
      "Days (week, month, year)": 1890,
    },
    {
      name: "Saturday",
      "Days (week, month, year)": 2390,
    },
    {
      name: "Sunday",
      "Days (week, month, year)": 3490,
    },
  ],
};

export default Reports;
