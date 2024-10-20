import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";

import React from "react";

import SearchBar from "components/atoms/SearchBar";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

import CustomMenu from "components/atoms/CustomMenu";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import LabRequestTable from "components/molecules/tabels/radio/LabRequestTable";
import CustomBarChart from "components/atoms/CustomBarChart";

import CustomButton from "components/atoms/CustomButton";
import LabHistoryTable from "components/molecules/tabels/radio/LabHistoryTable";
import Pagination from "components/molecules/pagination/Pagination";
import { useNavigate } from "react-router-dom";
import CustomModal from "components/atoms/CustomModal";
import DashboardModalView from "components/molecules/radio/modalContents/DashboardModalView";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_INVESTIGATION_TEST_STATS,
  GET_LAB_UPCOMING_INVESTIGATIONS,
  GET_RADIOLOGY_UPCOMING_INVESTIGATIONS,
  LAB_HISTORY,
  RADIOLOGY_HISTORY,
} from "utils/reactQueryKeys";
import CustomLoader from "components/atoms/CustomLoader";
import {
  daysOfThWeek,
  getdaysInAMonth,
} from "components/molecules/customScheduler/util";

import { useQueryClient } from "react-query";
import { exportToExcel } from "utils/exportToExcel";
import DateRangePicker from "components/atoms/dateRangePicker/DateRangePicker";
const pageSize = 10;
export const CountDisplay = ({ item: { desc, number } }) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        p: 1,
        // pt: 0.5,
        // pb: 0.5,
        width: "149px",
        borderRadius: "5px",
        backgroundColor:
          desc === "All Request"
            ? " rgba(105, 86, 229, 0.1)"
            : "background.lightest",

        border: desc !== "All Request" && "1px solid #EEEEEE",
      }}
      spacing={2}
      aria-label="count-display"
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: "bold",
          color: desc === "All Request" ? " rgba(105, 86, 229, 1)" : "",
        }}
      >
        {desc}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          p: 0.7,
          pt: 0.1,
          pb: 0.1,
          borderRadius: "50%",
          color: desc === "All Request" ? " rgba(105, 86, 229, 0.5)" : "",
          backgroundColor:
            desc === "All Request"
              ? " rgba(105, 86, 229, 0.13)"
              : "background.custom",
        }}
      >
        {number}
      </Typography>
    </Stack>
  );
};

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

const formatExportData = (data) => {
  if (!data.length) return;

  const formatedData = data.map((d) => {
    const copy = structuredClone(d);

    const formart = {
      ...copy,

      patientId: copy.patient._id,
      patient: `${copy.patient.firstName} ${copy.patient.lastName}`,
      doctor: copy.doctor.fullName,
      doctorId: copy.doctor._id,
      testCode: copy.test.testCode,
      testName: copy.test.testName,
      testType: copy.test.testType,
      testRate: copy.test.rate,
      testDuration: copy.test.duration,
    };

    delete formart.test;
    delete formart.id;

    return formart;
  });
  return formatedData;
};

function LabOverview({ dropDownContent }) {
  const navigate = useNavigate();
  const modalRef = React.useRef(null);
  const queryClient = useQueryClient();
  //daysOfThWeek
  const [views, setviews] = React.useState({
    name: "This Week",
    value: "Week",
  });
  const [modalView, setmodalView] = React.useState(0);

  const [search, setsearch] = React.useState("");

  const [dates, setdates] = React.useState([]);
  const [dateRange, setdateRange] = React.useState(daysOfThWeek());

  const [currentPage, setCurrentPage] = React.useState(1);

  //get lab upcoming investigations
  const { data: upcomingReqData, isLoading: upcomingReqLoading } =
    useCustomQuery(
      [
        GET_RADIOLOGY_UPCOMING_INVESTIGATIONS,
        {
          startDate: formatDate(dateRange[0]),
          endDate: formatDate(dateRange[dateRange?.length - 1]),
          page: 1,
          limit: 10,
          departmentType: "RADIOLOGY",
        },
      ],
      {
        url: `/radiology/upcoming-investigations`,
        method: "post",
        avoidCancelling: true,
        data: {
          limit: pageSize,
          startDate: formatDate(dateRange[0]),
          endDate: formatDate(dateRange[dateRange?.length - 1]),
          page: 1,
          departmentType: "RADIOLOGY",
        },
      },
      {
        refetchOnWindowFocus: false,
        enabled: !!dateRange?.length,
      }
    );

  //get lab  history
  const { data: labHistoryData, isLoading: labHistoryLoading } = useCustomQuery(
    [
      RADIOLOGY_HISTORY,
      {
        startDate: formatDate(dates[0]),
        endDate: formatDate(dates[1]),
        page: currentPage,
        limit: pageSize,
      },
    ],
    {
      url: `/radiology/radiology-history`,
      method: "post",
      data: {
        startDate: formatDate(dates[0]),
        endDate: formatDate(dates[1]),
        page: currentPage,
        limit: pageSize,
      },
      avoidCancelling: true,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //get test stats

  const { data: stats, isLoading: statsLoading } = useCustomQuery(
    [GET_INVESTIGATION_TEST_STATS, { departmentType: "RADIOLOGY" }],
    {
      url: `/investigation/test-stats?departmentType=RADIOLOGY`,
      method: "get",

      avoidCancelling: true,
    },
    {
      refetchOnWindowFocus: false,

      select: (data) => {
        if (!data?.data?.length) return [];
        const colors = [
          "blue",
          "orange",
          "violet",
          "indigo",
          "yellow",
          "green",
          "red",
        ];
        const chartData = data?.data?.map((stat, i) => {
          // const red = Math.floor(Math.random() * 255);
          // const green = Math.floor(Math.random() * 255);
          // const blue = Math.floor(Math.random() * 255);
          return {
            name: typeof stat._id === "string" ? stat._id : stat._id.testName,
            fill: colors[i],
            // fill: `rgb(${red},${green},${blue})`,
            test: stat?.count,
          };
        });

        return chartData;
      },
    }
  );

  //search lab  history
  const { isLoading: searchLabHistoryLoading, refetch: refetchSearch } =
    useCustomQuery(
      [
        RADIOLOGY_HISTORY,
        {
          search,
        },
      ],
      {
        url: `/radiology/radiology-history`,
        method: "post",
        data: {
          search,
        },
      },
      {
        refetchOnWindowFocus: false,
        enabled: false,
        onSuccess: (response) => {
          queryClient.setQueryData(
            [
              RADIOLOGY_HISTORY,
              {
                startDate: formatDate(dates[0]),
                endDate: formatDate(dates[1]),
                page: currentPage,
                limit: pageSize,
              },
            ],
            (oldQueryData) => {
              return {
                ...response,
              };
            }
          );
        },
      }
    );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClickDropdownItem = (item) => {
    const date = new Date();
    if (item.value === "Week") setdateRange(daysOfThWeek());
    if (item.value === "Month")
      setdateRange(getdaysInAMonth(date.getMonth(), date.getFullYear()));
    if (item.value === "Day") setdateRange([date]);
    setviews(item);
  };

  const toggleModal = () => modalRef?.current?.handleToggle();

  const openModal = (view) => {
    setmodalView(view);
    toggleModal();
  };

  const handleExport = () => {
    exportToExcel(
      formatExportData(labHistoryData?.data?.filteredInvestigations),
      `radiology_lab_history_${new Date()}`
    );
  };

  return (
    <Box>
      <Typography variant="displayLg">Radiology</Typography>
      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, height: "460px" }}>
            <Stack
              direction="column"
              height="100%"
              justifyContent={"space-between"}
              sx={{ minHeight: "360px" }}
            >
              <Stack direction="column" spacing={3}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    width: "100%",
                    flexDirection: {
                      xs: "column",
                    },
                  }}
                >
                  <Typography variant="displayMd" sx={{}}>
                    Upcoming Request
                  </Typography>
                </Box>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{
                    xs: "flex-start",
                    sm: "center",
                  }}
                  sx={{ width: "100%" }}
                  spacing={2}
                >
                  <CountDisplay
                    item={{
                      desc: "All Request",
                      number: upcomingReqData?.data?.count,
                    }}
                  />
                  <CustomMenu
                    caption={views.name}
                    items={dropDownContent}
                    onClickItem={handleClickDropdownItem}
                  />
                </Stack>
                {upcomingReqLoading ? (
                  <CustomLoader />
                ) : upcomingReqData?.data?.filteredInvestigations?.length ? (
                  <LabRequestTable
                    openModal={openModal}
                    data={upcomingReqData?.data?.filteredInvestigations.slice(
                      0,
                      3
                    )}
                  />
                ) : (
                  "No data to display"
                )}
              </Stack>
              {upcomingReqData?.data?.filteredInvestigations?.length ? (
                <Button
                  variant="text"
                  sx={{
                    alignSelf: "end",
                    fontWeight: "bold",
                    justifySelf: "flex-end",
                  }}
                  onClick={() => navigate("/home/all-radiology-requests")}
                  color="secondary"
                >
                  {" "}
                  See all request <ArrowRightAltIcon sx={{ ml: 1 }} />{" "}
                </Button>
              ) : null}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              mb: 2,
              // minHeight: "415px",
              height: "460px",
            }}
          >
            <Stack
              direction={"column"}
              spacing={1}
              alignItems={"center"}
              justifyContent="center"
            >
              <Stack
                direction={"row"}
                spacing={0}
                alignItems={"center"}
                justifyContent="space-between"
                sx={{ width: "100%", mb: 2 }}
              >
                <Typography variant="displaySm">Report</Typography>
              </Stack>
              {statsLoading ? (
                <CustomLoader />
              ) : stats?.length ? (
                <CustomBarChart data={stats} />
              ) : null}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Stack direction="column" spacing={2}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent={{ xs: "center", sm: "space-between" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1}
              >
                <Typography variant="displayMd" sx={{}}>
                  Radiology History
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent={{ xs: "center", sm: "space-between" }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={1}
                >
                  <DateRangePicker
                    values={dates}
                    setValues={setdates}
                    placeholder="Select date range"
                  />

                  <SearchBar
                    search={search}
                    setsearch={setsearch}
                    refetch={refetchSearch}
                    isLoading={searchLabHistoryLoading}
                  />

                  <CustomButton
                    text={"export"}
                    variant="outlined"
                    startIcon={<LocalPrintshopIcon />}
                    onClick={handleExport}
                    disabled={
                      !labHistoryData?.data?.filteredInvestigations?.length
                    }
                  />
                </Stack>
              </Stack>
              {labHistoryLoading ? (
                <CustomLoader />
              ) : labHistoryData?.data?.filteredInvestigations?.length ? (
                <>
                  <LabHistoryTable
                    data={labHistoryData?.data?.filteredInvestigations}
                  />
                  <Box sx={{ width: "100%", mt: 2 }}>
                    <Pagination
                      currentPage={currentPage}
                      totalCount={labHistoryData?.data?.count || 5}
                      pageSize={pageSize}
                      onPageChange={handlePageChange}
                    />
                  </Box>
                </>
              ) : (
                "No data found"
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 2,
          width: {
            xs: "90%",
            sm: modalView === 1 ? "80vw" : "50vw",
          },
        }}
      >
        <DashboardModalView handleClose={toggleModal} view={modalView} />
      </CustomModal>
    </Box>
  );
}
LabOverview.defaultProps = {
  navItems: [
    {
      label: "General",
      id: 0,
    },
    {
      label: "Specialist",
      id: 1,
    },
  ],
  barData: [
    {
      name: "Basic Metabolic Panel",
      fill: "red",
      test: 2400,
    },
    {
      name: "Glucose Test",
      fill: "orange",
      test: 2210,
    },
    {
      name: "Malaria Test",
      fill: "blue",
      test: 2290,
    },
    {
      name: "Liver panel Test",
      fill: "green",
      test: 2000,
    },
    {
      name: "Kidney analysis Test",
      fill: "indigo",
      test: 2181,
    },
    {
      name: "Others",
      fill: "gray",
      test: 2500,
    },
  ],

  dropDownContent: [
    {
      name: "Today",
      value: "Day",
    },
    {
      name: "This Week",
      value: "Week",
    },
    {
      name: "This Month",
      value: "Month",
    },
  ],
};
export default React.memo(LabOverview);
