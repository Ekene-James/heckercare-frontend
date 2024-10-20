import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import DashboardCard from "components/molecules/dashboardCard/DashboardCard";
import React from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

import CustomButton from "components/atoms/CustomButton";
import CustomLineChart from "components/atoms/CustomLineChart";
import CustomMenu from "components/atoms/CustomMenu";
import CustomPieChart from "components/atoms/CustomPieChart";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_ACCOUNTING_REVENUE,
  GET_ADMIN_DASHBOARD_ANALYTICS,
  GET_DASHBOARD_DATA,
} from "utils/reactQueryKeys";
import { numberFormatter } from "utils/numberFormatter";
import { useNavigate } from "react-router-dom";
import CustomLoader from "components/atoms/CustomLoader";

// function to return a number to the nearest whole number?

const toNearestWholeNumber = (data, field) => {
  return data.map((obj) => ({
    ...obj,
    [field]: Math.round(obj[field]),
  }));
};

function AdminDashboard({ dropDownContent }) {
  const navigate = useNavigate();
  const [views, setviews] = React.useState({
    name: "Monthly",
    value: "monthly",
  });
  const [activeBtn, setactiveBtn] = React.useState(0);

  const handleBtnClick = (btn) => {
    setviews({
      name: "Monthly",
      value: "monthly",
    });
    setactiveBtn(btn);
  };
  const handleClickDropdownItem = (item) => {
    setviews(item);
  };

  //get all dashboard details
  const { data: dashboardDetails } = useCustomQuery(
    [GET_DASHBOARD_DATA],
    {
      url: `/admin/dashboard`,
      method: "post",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: dashboardAnalytics, isLoading: analyticsLoading } =
    useCustomQuery(
      [GET_ADMIN_DASHBOARD_ANALYTICS, { query: views.value }],
      {
        url: `/admin/dashboard-analytics?query=${views.value}`,
        method: "get",
      },
      {
        refetchOnWindowFocus: false,
        enabled: activeBtn === 0,
        select: (data) => {
          return toNearestWholeNumber(data.data, "count");
        },
      }
    );

  const { data } = dashboardDetails ?? [];

  const { data: totalRevenue, isLoading: totalRevenueLoading } = useCustomQuery(
    [GET_ACCOUNTING_REVENUE, { query: views.value }],
    {
      url: `/accounting/revenue?data=${views.value}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      enabled: activeBtn === 1,
      select: (data) => {
        return toNearestWholeNumber(data.data, "totalCost");
      },
    }
  );

  const pieData = [
    {
      name: "Number of Occupied Beds",
      fill: "#092C4C",
      value: data?.wards?.usedBeds || 0,
    },
    {
      name: "Number of Unoccupied Beds",
      fill: "#457EE8",
      value: data?.wards?.unusedBeds || 0,
    },
  ];

  const pieData2 = [
    {
      name: "Total Admitted Patient",
      fill: "#2F80ED",
      value: data?.admittedDischargeStat?.admittedCount || 0,
    },
    {
      name: "Discharged  Patient",
      fill: "#EEA339",
      value: data?.admittedDischargeStat?.outPatientCount || 0,
    },
  ];
  let lineGraph;
  switch (activeBtn) {
    case 0:
      lineGraph = (
        <CustomLineChart
          sx={{
            height: "600px",
          }}
          xVal="name"
          data={dashboardAnalytics || []}
          lines={[
            {
              strokeColor: "#FB896B",
              yVal: "count",
              showDot: true,
            },
          ]}
        />
      );
      break;
    case 1:
      lineGraph = (
        <CustomLineChart
          xVal={
            views.value === "monthly"
              ? "month"
              : views.value === "weekly"
              ? "dayOfWeek"
              : "year"
          }
          sx={{
            height: "600px",
          }}
          data={totalRevenue || []}
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
  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "start", sm: "center" }}
        sx={{ width: "100%" }}
      >
        <Typography variant="displayLg">Dashboard</Typography>
        {/* <CustomMenu
          caption="Lagos Staffs Hospital HQ"
          onClickItem={() => {}}
          items={["One", "Two"]}
        /> */}
      </Stack>
      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            url=""
            smallTxt="TOTAL NUMBER OF STAFFS"
            bigTxt={numberFormatter(data?.staffs || 0)}
            icnBgSx={{
              backgroundColor: "rgba(2, 0, 17, 0.1)",
              borderRadius: "50%",
            }}
            icon={<PeopleAltIcon sx={{ color: "black", fontSize: "30px" }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            url=""
            icnBgSx={{
              backgroundColor: "rgba(2, 0, 17, 0.1)",
              borderRadius: "50%",
            }}
            smallTxt="TOTAL NUMBER OF PATIENTS"
            bigTxt={numberFormatter(data?.patientsCount || 0)}
            icon={<PeopleAltIcon sx={{ color: "black", fontSize: "30px" }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            url=""
            icnBgSx={{
              backgroundColor: "rgba(2, 0, 17, 0.1)",
              borderRadius: "50%",
            }}
            smallTxt="MORTALITY"
            bigTxt={numberFormatter(data?.mortarlityCount || 0)}
            icon={<PeopleAltIcon sx={{ color: "black", fontSize: "30px" }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            url=""
            icnBgSx={{
              backgroundColor: "rgba(2, 0, 17, 0.1)",
              borderRadius: "50%",
            }}
            smallTxt="TOTAL NUMBER OF WARDS"
            bigTxt={numberFormatter(data?.totalWards || 0)}
            icon={<PeopleAltIcon sx={{ color: "black", fontSize: "30px" }} />}
          />
        </Grid>

        <Grid item xs={12} lg={9}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="column" spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                }}
              >
                <Typography variant="heading" sx={{}}>
                  Overall Analytics
                </Typography>

                <CustomMenu
                  caption={views.name}
                  items={dropDownContent}
                  onClickItem={handleClickDropdownItem}
                  popperSx={{ width: "7.6%" }}
                />
              </Box>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="start"
                alignItems="start"
                spacing={1}
              >
                <CustomButton
                  text={"Number of Visits"}
                  variant={activeBtn === 0 ? "contained" : "outlined"}
                  color={activeBtn === 0 ? "secondary" : "primary"}
                  onClick={handleBtnClick.bind(this, 0)}
                />
                <CustomButton
                  text={"Total Revenue"}
                  variant={activeBtn === 1 ? "contained" : "outlined"}
                  color={activeBtn === 1 ? "secondary" : "primary"}
                  onClick={handleBtnClick.bind(this, 1)}
                />
              </Stack>
              {analyticsLoading || totalRevenueLoading ? (
                <CustomLoader />
              ) : (
                lineGraph
              )}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={3}>
          <Stack
            direction={{ xs: "column" }}
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={1}
            sx={{ width: "100%" }}
          >
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                mb: 2,
                width: "100%",
              }}
            >
              <CustomPieChart
                data={pieData}
                title="BEDS MANAGEMENT"
                xs={12}
                sm={12}
                showValue={true}
              />
              <Button
                variant="text"
                sx={{
                  fontSize: "10px",
                  alignSelf: "end",
                  mt: 2,
                }}
                onClick={() => navigate("/home/ward-overview")}
                endIcon={<ArrowRightAltIcon />}
              >
                {" "}
                Show details
              </Button>
            </Paper>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                mb: 2,
                width: "100%",
              }}
            >
              <CustomPieChart
                data={pieData2}
                title="ADMITTANCE/ DISCHARGE"
                xs={12}
                sm={12}
                showValue={true}
              />
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

AdminDashboard.defaultProps = {
  pieData1: [
    {
      name: "Total Admitted Patient",
      fill: "#2F80ED",
      value: 1000,
    },
    {
      name: "Discharged  Patient",
      fill: "#EEA339",
      value: 200,
    },
  ],

  dropDownContent: [
    {
      name: "Weekly",
      value: "weekly",
    },
    {
      name: "Monthly",
      value: "monthly",
    },
    {
      name: "Yearly",
      value: "yearly",
    },
  ],
  lineData: [
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
  ],
};

export default AdminDashboard;
