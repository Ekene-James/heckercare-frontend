import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import DashboardCard from "components/molecules/dashboardCard/DashboardCard";
import React from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BiotechIcon from "@mui/icons-material/Biotech";
import SearchBar from "components/atoms/SearchBar";
import CustomDatePicker from "components/atoms/DatePicker";
import Pagination from "components/molecules/pagination/Pagination";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CustomTab from "components/atoms/CustomTab";

import SpecialistDoctorTable from "components/molecules/tabels/dashboard/SpecialistDoctorTable";
import { useNavigate } from "react-router-dom";
import DocDashboardGenDocTable from "components/molecules/tabels/dashboard/DocDashboardGenDocTable";
import {
  GET_ALL_DEPARTMENT_INVENTORY,
  GET_APPOINTMENT_HISTORY,
  GET_DOCTOR_STAT,
  GET_GENERALIST_APPOINTMENTS,
  GET_SPECIALIST_APPOINTMENTS,
} from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
import { useQueryClient } from "react-query";
import { useAuthCtx } from "store/contextStore/auth/AuthStore";
import moment from "moment";
const PageSize = 10;

const Row = ({ data }) => {
  return (
    <Stack
      key={data?._id}
      direction="row"
      spacing={2}
      sx={{
        width: "100%",
        margin: "auto",
        mt: 2,
        justifyContent: "flex-start",
      }}
    >
      <PersonOutlinedIcon />
      <Stack direction="column" spacing={0}>
        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
          {`${data?.patient?.firstName} ${data?.patient?.lastName}`}
        </Typography>
        <Typography variant="small">{`${moment(data?.startDateTime).format(
          "MMMM Do YYYY"
        )} at ${moment(data?.startDateTime).format("h:mm:ss a")}`}</Typography>
      </Stack>
      {/* <Button
        variant="contained"
        sx={{
          fontSize: "9px",
          backgroundColor: "background.lightBlue1",
          color: "secondary.main",
          p: 0,
          "&:hover": {
            backgroundColor: "background.lightBlue1",
            opacity: 0.8,
          },
        }}
      >
        Report
      </Button> */}
    </Stack>
  );
};

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

function DoctorsDashboard({ navItems }) {
  const skip = React.useRef(0);
  const [search, setsearch] = React.useState("");
  const queryClient = useQueryClient();
  const { state } = useAuthCtx();
  const [value, setvalue] = React.useState(0);
  const [generalistCurrentPage, setGeneralistCurrentPage] = React.useState(1);
  const [specialistCurrentPage, setSpecialistCurrentPage] = React.useState(1);
  const [checkBoxItems, setcheckBoxItems] = React.useState([]);
  const [date, setdate] = React.useState(null);

  const navigate = useNavigate();
  const handleSpecialistPageChange = (page) => {
    skip.current = (page - 1) * PageSize;

    setSpecialistCurrentPage(page);
  };
  const handleGeneralistPageChange = (page) => {
    skip.current = (page - 1) * PageSize;

    setGeneralistCurrentPage(page);
  };

  //get doctors stats

  //get doctor stats
  const {
    data: doctorStat,
    isLoading: getDoctorStatLoading,
    refetch: refetchDoctorStat,
    isError: isDoctorStatError,
  } = useCustomQuery(
    [GET_DOCTOR_STAT, state?.user?._id],
    {
      url: `/appointments/get-doctor-stat/${state?.user?._id}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //get all generalist appointments
  const {
    data: generalistAppointments,
    isLoading: getGeneralistAppointmentLoading,
    refetch: refetchGeneralistAppointments,
    isError: isGeneralistAppointmentError,
  } = useCustomQuery(
    [
      GET_GENERALIST_APPOINTMENTS,
      {
        page: generalistCurrentPage,
        limit: PageSize,
        status: "vitals done",
      },
    ],
    {
      url: `/appointments/get-generalist-appointments?page=${generalistCurrentPage}&limit=${PageSize}&status=vitals done`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //search all generalist appointment
  const {
    isLoading: searchGeneralistAppointmentLoading,
    isFetching: searchGeneralistAppointmentFetching,
    refetch: refetchGeneralistAppointment,
  } = useCustomQuery(
    [
      [GET_GENERALIST_APPOINTMENTS],
      {
        page: generalistCurrentPage,
        search: search,
        limit: PageSize,
        status: "vitals done",
      },
    ],
    {
      url: `/appointments/get-generalist-appointments?search=${search}&status=vitals done`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [
            GET_GENERALIST_APPOINTMENTS,
            {
              page: generalistCurrentPage,
              limit: PageSize,
              status: "vitals done",
            },
          ],
          (oldQueryData) => {
            return {
              ...response,
            };
          }
        );
      },
      enabled: false,
    }
  );

  //get all specialist appointments
  const {
    data: specialistAppointments,
    isLoading: getSpecialistAppointmentLoading,
    refetch: refetchSpecialistAppointments,
    isError: isSpecialistAppointmentError,
    isRefetching: specialistRefecthing,
  } = useCustomQuery(
    [
      GET_SPECIALIST_APPOINTMENTS,
      {
        page: specialistCurrentPage,
        limit: PageSize,
        startDate: date ? getDate(date) : null,
        status: "vitals done",
      },
    ],
    {
      url: `/appointments/upcoming-specialist-doctor`,
      method: "post",
      data: {
        page: specialistCurrentPage,
        limit: PageSize,
        startDate: date ? getDate(date) : null,
        status: "vitals done",
      },
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //search all specialist appointment
  const {
    isLoading: searchSpecialistAppointmentLoading,
    isFetching: searchSpecialistAppointmentFetching,
    refetch: refetchSpecialistAppointment,
  } = useCustomQuery(
    [
      [GET_SPECIALIST_APPOINTMENTS],
      {
        page: specialistCurrentPage,
        searchTerm: search,
        limit: PageSize,
        status: "vitals done",
      },
    ],
    {
      url: `/appointments/upcoming-specialist-doctor`,
      method: "post",
      data: {
        page: specialistCurrentPage,
        searchTerm: search,
        limit: PageSize,
        status: "vitals done",
      },
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [
            GET_SPECIALIST_APPOINTMENTS,
            {
              page: specialistCurrentPage,
              limit: PageSize,
              startDate: date ? getDate(date) : null,
              status: "vitals done",
            },
          ],
          (oldQueryData) => {
            return {
              ...response,
            };
          }
        );
      },
      enabled: false,
    }
  );

  //get all doctor history
  const {
    data: appointmentHistory,
    isLoading: getAppointmentHistoryLoading,
    refetch: refetchAppointmentHistory,
    isError: isAppointmentHistoryError,
  } = useCustomQuery(
    [
      GET_APPOINTMENT_HISTORY,
      {
        page: 1,
        limit: PageSize,
      },
    ],
    {
      url: `/appointments/history-appointments-of-doctor`,
      method: "post",
      data: {
        doctorId: state?.user?._id,
        page: 1,
        limit: PageSize, // limit: PageSize,
      },
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  let view;
  switch (value) {
    case 0:
      view = getGeneralistAppointmentLoading ? (
        <CustomLoader />
      ) : isGeneralistAppointmentError ? (
        <Paper sx={{ p: 1 }}>
          <Typography>
            Something went wrong, refresh and try again Later
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 2 }}>
          {generalistAppointments?.data?.appointments?.length ? (
            <>
              <DocDashboardGenDocTable
                data={generalistAppointments?.data?.appointments}
                page={generalistCurrentPage}
                checkBoxItems={checkBoxItems}
                setcheckBoxItems={setcheckBoxItems}
                isDoctorDashboard={true}
              />
              <Box sx={{ p: { xs: 0, sm: 2 } }}>
                <Pagination
                  currentPage={generalistCurrentPage}
                  totalCount={generalistAppointments?.data?.count}
                  pageSize={PageSize}
                  onPageChange={handleGeneralistPageChange}
                />
              </Box>
            </>
          ) : (
            <Typography>No item to display</Typography>
          )}
        </Paper>
      );

      break;
    case 1:
      view = getSpecialistAppointmentLoading ? (
        <CustomLoader />
      ) : isSpecialistAppointmentError ? (
        <Paper sx={{ p: 1 }}>
          <Typography>
            Something went wrong, refresh and try again Later
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 2 }}>
          {specialistAppointments?.data?.appointments?.length ? (
            <>
              <SpecialistDoctorTable
                data={specialistAppointments?.data?.appointments}
                page={specialistCurrentPage}
                checkBoxItems={checkBoxItems}
                setcheckBoxItems={setcheckBoxItems}
                isDoctorDashboard={true}
              />
              <Box sx={{ p: { xs: 0, sm: 2 } }}>
                <Pagination
                  currentPage={specialistCurrentPage}
                  totalCount={specialistAppointments?.data?.count}
                  pageSize={PageSize}
                  onPageChange={handleSpecialistPageChange}
                />
              </Box>
            </>
          ) : (
            <Typography>No item to display</Typography>
          )}
        </Paper>
      );

      break;

    default:
      break;
  }
  const handleReset = () => {
    setsearch("");
    setdate(null);
    refetchSpecialistAppointments();
    refetchGeneralistAppointments();
  };
  return (
    <Box>
      <Typography variant="displayLg">Dashboard</Typography>
      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={9}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <DashboardCard
              url=""
              icnBgSx={{
                backgroundColor: "rgba(2, 0, 17, 0.1)",
                borderRadius: "50%",
              }}
              smallTxt="PATIENTS SEEN"
              bigTxt={doctorStat?.data?.totalPatientsSeen}
              icon={<PeopleAltIcon sx={{ color: "black", fontSize: "30px" }} />}
            />
            <DashboardCard
              // url="/home/dashboard/all-appointments"
              icnBgSx={{
                backgroundColor: "rgba(255, 129, 96, 0.1)",
                borderRadius: "50%",
              }}
              smallTxt="TOTAL APPOINTMENTS"
              bigTxt={doctorStat?.data?.totalAppointments}
              icon={<BiotechIcon sx={{ color: "#FF8160", fontSize: "30px" }} />}
            />
          </Stack>
          <Paper sx={{ p: 2, mt: 2 }}>
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
                <Typography variant="displaySm" sx={{}}>
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
                    refetch={
                      value === 0
                        ? refetchGeneralistAppointment
                        : refetchSpecialistAppointment
                    }
                    // handleSearch={() => {}}
                    search={search}
                    setsearch={setsearch}
                    // handleSearch={() => {}}
                    placeholder="Search by Patient ID/Name"
                    isLoading={
                      value === 0
                        ? searchGeneralistAppointmentLoading ||
                          searchGeneralistAppointmentFetching
                        : searchSpecialistAppointmentLoading ||
                          searchSpecialistAppointmentFetching
                    }
                  />

                  {value === 1 && (
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
                  )}
                </Box>
                <Grid
                  item
                  xs={1}
                  sx={{ display: "flex", justifyContent: "end" }}
                >
                  <Button variant="text" onClick={handleReset}>
                    Reset
                  </Button>
                </Grid>
              </Box>
              <CustomTab
                navItems={navItems}
                value={value}
                setValue={setvalue}
              />
              {view}
              {/* <Button
                variant="text"
                color="secondary"
                sx={{ fontSize: "10px", alignSelf: "end", fontWeight: "bold" }}
                onClick={() => navigate("/home/dashboard/all-appointments")}
              >
                {" "}
                See all Appointments <ArrowRightAltIcon sx={{ ml: 1 }} />{" "}
              </Button> */}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
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
                  m: {
                    xs: 2,
                    sm: 1,
                  },
                }}
              >
                <Typography variant="heading" sx={{}}>
                  History
                </Typography>

                {/* <Button
                  variant="outlined"
                  sx={{
                    fontSize: "10px",
                    alignSelf: "end",
                  }}
                >
                  {" "}
                  See all <KeyboardArrowRightIcon sx={{ ml: 1 }} />{" "}
                </Button> */}
              </Box>
              {/* <SearchBar handleSearch={() => {}} width={"100% !important"} /> */}
            </Box>

            {appointmentHistory?.data?.appointments?.length ? (
              appointmentHistory?.data?.appointments?.map((data) => (
                <Row key={data?._id} data={data} />
              ))
            ) : (
              <Typography>No item to display</Typography>
            )}

            {appointmentHistory?.data?.appointments?.length ? (
              <Button
                onClick={() => navigate("/home/doctor/appointment-history")}
                variant="text"
                sx={{
                  fontSize: "10px",
                  alignSelf: "end",
                  mt: 2,
                  fontWeight: "bold",
                }}
              >
                See all History <ArrowRightAltIcon sx={{ ml: 1 }} />
              </Button>
            ) : null}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

DoctorsDashboard.defaultProps = {
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
};
export default DoctorsDashboard;
