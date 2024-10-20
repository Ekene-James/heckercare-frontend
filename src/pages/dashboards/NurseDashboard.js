import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DashboardCard from "components/molecules/dashboardCard/DashboardCard";
import React from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BiotechIcon from "@mui/icons-material/Biotech";
import SearchBar from "components/atoms/SearchBar";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

import CustomTab from "components/atoms/CustomTab";

import CustomDatePicker from "components/atoms/DatePicker";
import DoctorsNoteCard from "components/atoms/DoctorsNoteCard";
import { useNavigate } from "react-router-dom";
import CustomPieChart from "components/atoms/CustomPieChart";
import {
  GET_GENERALIST_APPOINTMENTS,
  GET_NURSE_DASHBOARD_ASSESSMENT_LOGS,
  GET_NURSE_DASHBOARD_STATS,
  GET_SPECIALIST_APPOINTMENTS,
} from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import CustomLoader from "components/atoms/CustomLoader";
import { numberFormatter } from "utils/numberFormatter";
import NurseSpecialistTable from "components/molecules/tabels/dashboard/NurseSpecialistTable";
import NurseGeneralistTable from "components/molecules/tabels/dashboard/NurseGeneralistTable";
import { useAuthCtx } from "store/contextStore/auth/AuthStore";
const pieData = [
  {
    name: "Occupied Bed",
    fill: "rgba(9, 44, 76, 1)",
    value: 0,
  },
  {
    name: "Unoccupied Bed",
    fill: "rgba(69, 126, 232, 1)",
    value: 0,
  },
];
const formatPiedata = (data) => {
  if (!data || !Object.keys(data)?.length) return pieData;
  return [
    {
      name: "Occupied Bed",
      fill: "rgba(9, 44, 76, 1)",
      value: data?.usedBeds || 0,
    },
    {
      name: "Unoccupied Bed",
      fill: "rgba(69, 126, 232, 1)",
      value: data?.unusedBeds || 0,
    },
  ];
};
const pageSize = 10;
const getOnlyDate = (date) => {
  if (!date) return;
  const yr = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}-${day}-${yr}`;
};
function NurseDashboard({ docNote, pieData, navItems }) {
  const queryClient = useQueryClient();
  const { state } = useAuthCtx();
  const navigate = useNavigate();
  const [value, setvalue] = React.useState(0);
  const [search, setsearch] = React.useState("");
  const [date, setdate] = React.useState(null);

  const [currentPage1, setCurrentPage1] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);
  const handlePageChange1 = (page) => {
    setCurrentPage1(page);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //get genaralist appointments
  const { data: dashboardStats, isLoading: dashboardStatsLoading } =
    useCustomQuery(
      [GET_NURSE_DASHBOARD_STATS],
      {
        url: `/admin/nurse-dashboard`,
        method: "get",
      },
      {
        refetchOnWindowFocus: false,
      }
    );

  //get genaralist appointments
  const { data: generalistData, isLoading: isGeneralistLoading } =
    useCustomQuery(
      [
        GET_GENERALIST_APPOINTMENTS,
        {
          page: currentPage1,
          status: "running",
        },
      ],
      {
        url: `/appointments/get-generalist-appointments?limit=${pageSize}&page=${currentPage1}&status=running`,
        method: "get",
      },
      {
        refetchOnWindowFocus: false,
      }
    );

  //search genaralist appointments
  const {
    isLoading: searchGeneralisttLoading,
    refetch: refetchGeneralistSearch,
  } = useCustomQuery(
    [GET_GENERALIST_APPOINTMENTS, search],
    {
      url: `/appointments/get-generalist-appointments?search=${search}&status=running`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: (data) => {
        queryClient.setQueryData(
          [
            GET_GENERALIST_APPOINTMENTS,
            {
              page: currentPage1,
              status: "running",
            },
          ],
          (oldQueryData) => {
            return {
              ...data,
            };
          }
        );
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }
        return toast.error(error.message);
      },
    }
  );

  //get specialist appointments using post
  const { data: specialistAppointments, isLoading: appointmentsLoading } =
    useCustomQuery(
      [
        GET_SPECIALIST_APPOINTMENTS,
        {
          startDate: value === 1 ? getOnlyDate(date) : null,
          page: currentPage,
          status: "running",
        },
      ],
      {
        url: `/appointments/get-specialist-appointments`,
        method: "post",

        data: {
          startDate: value === 1 ? getOnlyDate(date) : null,
          page: currentPage,
          limit: pageSize,
          status: "running",
        },
      },
      {
        refetchOnWindowFocus: false,
      }
    );

  //search specialist appointments using post
  const {
    isLoading: specialistAppointmentsLoading,
    refetch: refetchSpecialist,
  } = useCustomQuery(
    [
      GET_SPECIALIST_APPOINTMENTS,
      {
        search: value === 1 ? search : null,
        status: "running",
      },
    ],
    {
      url: `/appointments/get-specialist-appointments`,
      method: "post",

      data: {
        search: value === 1 ? search : null,
        status: "running",
      },
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: (data) => {
        queryClient.setQueryData(
          [
            GET_SPECIALIST_APPOINTMENTS,
            {
              startDate: value === 1 ? getOnlyDate(date) : null,
              page: currentPage,
              status: "running",
            },
          ],
          (oldQueryData) => {
            return {
              ...data,
            };
          }
        );
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }
        return toast.error(error.message);
      },
    }
  );

  //get doctors assement logs
  const { data: assessmentLogs, isLoading: assessmentLogsLoading } =
    useCustomQuery(
      [GET_NURSE_DASHBOARD_ASSESSMENT_LOGS],
      {
        url: `/admin/nurse-ward-logs/${state.user._id}`,
        method: "get",
      },
      {
        refetchOnWindowFocus: false,
        enabled: !!state.user._id,
        select: (res) => {
          const data = [];
          res.data.forEach((d) => {
            d.assessmentLog.forEach((log) => {
              if (log?.topic) {
                data.push({
                  ...log,
                  patientName: d.patientName,
                  patientId: d.patientId,
                  doctorsName: `${log.noteBy.firstName} ${log.noteBy.lastName}`,
                  body: log.note,
                  title: log?.topic || "No Title",
                  time: log?.time || "",
                });
              }
            });
          });

          return data;
        },
      }
    );

  let view;
  switch (value) {
    case 0:
      view = (
        <NurseGeneralistTable
          data={generalistData?.data}
          isLoading={isGeneralistLoading}
          currentPage={currentPage1}
          handlePageChange={handlePageChange1}
        />
      );

      break;
    case 1:
      view = (
        <NurseSpecialistTable
          data={specialistAppointments?.data}
          isLoading={appointmentsLoading}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      );

      break;

    default:
      break;
  }

  const onRefetch = () => {
    if (value === 0) {
      refetchGeneralistSearch();
    } else {
      refetchSpecialist();
    }
  };
  const handleSetTabValue = (val) => {
    setsearch("");
    setvalue(val);
  };

  return (
    <Box>
      <Typography variant="displayLg">Dashboard</Typography>
      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={9}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {dashboardStatsLoading ? (
              <CustomLoader />
            ) : (
              <>
                <DashboardCard
                  url=""
                  smallTxt="PATIENTS SEEN"
                  bigTxt={numberFormatter(
                    dashboardStats?.data?.totalPatientsSeen || 0
                  )}
                  icnBgSx={{
                    backgroundColor: "rgba(2, 0, 17, 0.1)",
                    borderRadius: "50%",
                  }}
                  icon={
                    <PeopleAltIcon sx={{ color: "black", fontSize: "30px" }} />
                  }
                />
                <DashboardCard
                  url="/home/patients-overview"
                  icnBgSx={{
                    backgroundColor: "rgba(255, 129, 96, 0.1)",
                    borderRadius: "50%",
                  }}
                  smallTxt="NEW PATIENTS"
                  bigTxt={numberFormatter(
                    dashboardStats?.data?.patientCount || 0
                  )}
                  icon={
                    <BiotechIcon sx={{ color: "#FF8160", fontSize: "30px" }} />
                  }
                />
              </>
            )}
          </Stack>
          <Paper sx={{ p: 2, mt: 2, minHeight: "500px" }}>
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
                  Upcoming Appointment
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    m: {
                      xs: 2,
                      sm: 1,
                    },
                  }}
                >
                  <SearchBar
                    refetch={onRefetch}
                    search={search}
                    setsearch={setsearch}
                    isLoading={
                      searchGeneralisttLoading || specialistAppointmentsLoading
                    }
                    placeholder="Search Patient"
                  />
                  {value === 1 ? (
                    <Box sx={{ ml: 2 }}>
                      <CustomDatePicker
                        type="date"
                        views={["year", "month", "day"]}
                        size="small"
                        lightBorder={true}
                        disableFuture={false}
                        date={date}
                        setdate={setdate}
                      />
                    </Box>
                  ) : null}
                </Box>
              </Box>
              <CustomTab
                navItems={navItems}
                value={value}
                setValue={handleSetTabValue}
              />
              {view}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column", mb: 2 }}>
            {dashboardStatsLoading ? (
              <CustomLoader />
            ) : (
              <CustomPieChart
                data={formatPiedata(dashboardStats?.data?.wards)}
                title="BEDS MANAGEMENT"
                xs={12}
                sm={12}
                showValue={true}
              />
            )}

            <Button
              variant="text"
              sx={{
                fontSize: "10px",
                alignSelf: "end",
                mt: 2,
              }}
              color="secondary"
              endIcon={<ArrowRightAltIcon />}
              onClick={() => navigate("/home/ward-overview")}
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
              height: "39%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",

                  mb: {
                    xs: 2,
                    sm: 1,
                  },
                }}
              >
                <Typography variant="heading" sx={{}}>
                  Doctor’s Note
                </Typography>
              </Box>
              {/* <SearchBar handleSearch={() => {}} width={"100% !important"} /> */}
            </Box>
            <Typography
              variant="small"
              sx={{ color: "primary.lightGrey", mt: 1 }}
            >
              Most Recent
            </Typography>

            {assessmentLogsLoading ? (
              <CustomLoader />
            ) : assessmentLogs?.length ? (
              assessmentLogs
                ?.slice(0, 3)
                ?.map((item, i) => <DoctorsNoteCard key={i} item={item} />)
            ) : (
              "No Log Found"
            )}
            {assessmentLogs?.length ? (
              <Button
                variant="text"
                color="secondary"
                sx={{
                  fontSize: "10px",
                  alignSelf: "end",
                  justifySelf: "flex-end",
                  mt: 2,
                  fontWeight: "bold",
                }}
                onClick={() => navigate("/home/nurse/doctors-note")}
              >
                {" "}
                See all History <ArrowRightAltIcon sx={{ ml: 1 }} />{" "}
              </Button>
            ) : null}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

NurseDashboard.defaultProps = {
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
  pieData: [
    {
      name: "Occupied Bed",
      fill: "rgba(9, 44, 76, 1)",
      value: 20,
    },
    {
      name: "Unoccupied Bed",
      fill: "rgba(69, 126, 232, 1)",
      value: 100,
    },
  ],

  docNote: [
    {
      doctorsName: "Dr Adewale Smith",
      patientName: "Samson Esegwu",
      title: "Major Chest Region Examination ",
      body: "",
      time: "Fri 9, Sept 2022 : 9:23am",
      src: "",
    },
    {
      doctorsName: "Dr Adewale Smith",
      patientName: "Samson Esegwu",
      title: "Major Chest Region Examination ",
      body: "",
      time: "Fri 9, Sept 2022 : 9:23am",
      src: "",
    },
  ],
};
export default NurseDashboard;
