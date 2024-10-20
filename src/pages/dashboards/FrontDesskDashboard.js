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
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Pagination from "components/molecules/pagination/Pagination";
import moment from "moment";
import CustomPieChart from "components/atoms/CustomPieChart";
import CustomDatePicker from "components/atoms/DatePicker";
import CustomTab from "components/atoms/CustomTab";
import GeneralDoctorTable from "components/molecules/tabels/dashboard/GeneralDoctorTable";
import SpecialistDoctorTable from "components/molecules/tabels/dashboard/SpecialistDoctorTable";
import { useQueryClient } from "react-query";

import { useNavigate, useOutletContext } from "react-router-dom";
import CustomButton from "components/atoms/CustomButton";
import {
  GET_ALL_APPOINTMENTS,
  GET_AVAILABLE_DOCTORS,
  GET_FOLLOWUP_APPOINTMENTS,
  GET_GENERALIST_APPOINTMENTS,
  GET_PENDING_DISCHARGE,
  GET_SPECIALIST_APPOINTMENTS,
  GET_WARDS,
} from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import FollowUpAppointmentTable from "components/molecules/tabels/dashboard/FollowUpAppointmentTable";
import CustomModal from "components/atoms/CustomModal";
import InviteMobilePatient from "./modalContents/InviteMobilePatient";
const PageSize = 10;

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
  if (!data || !Object?.keys(data || {}).length) return pieData;
  let formated = [];

  let occupiedBeds = 0;

  data.wards.forEach((item) => {
    let usedBeds = 0;
    if (item.usedBeds) usedBeds = item.usedBeds;
    occupiedBeds += usedBeds;
  });

  const unOccupiedBeds = data.totalBeds - occupiedBeds;

  formated.push(
    {
      name: "Occupied Bed",
      fill: "rgba(9, 44, 76, 1)",
      value: occupiedBeds,
    },
    {
      name: "Unoccupied Bed",
      fill: "rgba(69, 126, 232, 1)",
      value: unOccupiedBeds,
    }
  );

  return formated;
};

const Row = ({ data, refetch }) => {
  const queryClient = useQueryClient();

  // console.log(data?._id);
  //discharge patient
  const { mutate: dischargePatient, isLoading: dischargePatientLoading } =
    useCustomMutation(
      {
        url: `/patients/discharge-patient/${data._id}`,
        method: "patch",
      },
      {
        onSuccess: () => {
          // queryClient.invalidateQueries([
          //   GET_PENDING_DISCHARGE,
          //   {
          //     // page: currentPage,
          //     limit: 10,
          //   },
          // ]);
          refetch();
          toast.success("Success");
        },

        onError: (error) => {
          if (error.message.length) {
            error.message.map((msg) => toast.error(msg));
          } else {
            toast.error(error.message);
          }
        },
      }
    );

  const handleConfirmDischarge = () => {
    dischargePatient();
  };

  return (
    <Stack
      key={data?._id}
      direction="row"
      spacing={2}
      sx={{
        width: "100%",
        margin: "auto",
        mt: 2,
        p: 0,
        justifyContent: "space-between",
      }}
    >
      <PersonOutlinedIcon />
      <Stack direction="column" spacing={0}>
        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
          {`${data?.firstName} ${data?.lastName}`}
        </Typography>
        <Typography variant="small" sx={{ color: "#979797" }}>
          {`${moment(data?.dischargeDate).format("MMMM Do YYYY")} at ${moment(
            data?.dischargeDate
          ).format("h:mm:ss a")}`}
        </Typography>
      </Stack>
      {/* <Chip
        label="Discharge"
        color="secondary"
        disabled={dischargePatientLoading}
        onClick={handleConfirmDischarge}
        variant="outlined"
        sx={{ fontSize: "0.75rem" }}
      /> */}
    </Stack>
  );
};

function FrontDesskDashboard({ navItems }) {
  const navigate = useNavigate();
  const skip = React.useRef(0);
  const queryClient = useQueryClient();
  const [search, setsearch] = React.useState("");
  const [date, setdate] = React.useState(null);

  const [value, setvalue] = React.useState(0);
  const [generalistCurrentPage, setGeneralistCurrentPage] = React.useState(1);
  const [specialistCurrentPage, setSpecialistCurrentPage] = React.useState(1);
  const [followUpCurrentPage, setFollowUpCurrentPage] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [checkBoxItems, setcheckBoxItems] = React.useState([]);
  const modalRef = React.useRef(null);

  const handleFollowUpPageChange = (page) => {
    skip.current = (page - 1) * PageSize;

    setFollowUpCurrentPage(page);
  };
  const handleSpecialistPageChange = (page) => {
    skip.current = (page - 1) * PageSize;

    setSpecialistCurrentPage(page);
  };
  const handleGeneralistPageChange = (page) => {
    skip.current = (page - 1) * PageSize;

    setGeneralistCurrentPage(page);
  };

  const handleReset = () => {
    setsearch("");
    setdate(null);
    refetchSpecialistAppointmentList();
    refetchGeneralistAppointments();
    refetchFollowUpAppointmentList();
  };
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
  //get pending discharge list
  const {
    data: pendingDischargeList,
    isLoading: getPendingDischargeListLoading,
    refetch: refetchPendingDischargeList,
    isError: isPendingDischargeError,
  } = useCustomQuery(
    [
      GET_PENDING_DISCHARGE,
      {
        page: currentPage,
        // limit: PageSize,
        // startDate: date ? getDate(date) : null,
        // status: status === "Status" ? null : status,
      },
    ],
    {
      url: `/patients/pending-discharge-list`,
      method: "post",
      data: {
        page: currentPage,
        // search: "",
        // limit: PageSize,
        // startDate: date ? getDate(date) : null,
        // status: status === "Status" ? null : status,
      },
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //get wards
  const {
    isLoading: wardOverviewDataLoading,
    isError,
    data: wardOverviewData,
    refetch: refetchWardOverview,
  } = useCustomQuery(
    GET_WARDS,
    {
      url: `/wards/get-all-wards`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //get all appointments
  const {
    data: allAppointments,
    isLoading: getAllAppointmentLoading,
    refetch: refetchAllAppointments,
    isError: isAllAppointmentError,
  } = useCustomQuery(
    [
      GET_ALL_APPOINTMENTS,
      {
        // page: generalistCurrentPage,
        // limit: PageSize,
      },
    ],
    {
      url: `/appointments/get-all-appointments`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  //get all free doctors
  const {
    data: availableDoctors,
    isLoading: getAvailableDoctorsLoading,
    refetch: refetchAllAvailableDoctors,
    isError: isAvailableDoctorsError,
  } = useCustomQuery(
    [GET_AVAILABLE_DOCTORS],
    {
      url: `/user/get-free-doctors`,
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
        status: "pending",
      },
    ],
    {
      url: `/appointments/get-generalist-appointments?page=${generalistCurrentPage}&limit=${PageSize}&status=pending`,
      method: "get",
      data: {
        search: "",
        limit: PageSize,
      },
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
      },
    ],
    {
      url: `/appointments/get-generalist-appointments?search=${search}&status=pending`,
      method: "get",
      data: {
        page: generalistCurrentPage,
        search,
        limit: PageSize,
        // status: status === "ALL DISPUTES" ? null : status,
      },
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
              status: "pending",
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
    refetch: refetchSpecialistAppointmentList,
    isError: isSpecialistAppointmentError,
  } = useCustomQuery(
    [
      GET_SPECIALIST_APPOINTMENTS,
      {
        page: specialistCurrentPage,
        limit: PageSize,
        startDate: date ? getDate(date) : null,
      },
    ],
    {
      url: `/appointments/get-specialist-appointments`,
      method: "post",
      data: {
        // search: "",
        page: specialistCurrentPage,
        limit: PageSize,
        startDate: date ? getDate(date) : null,
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
        search: search,
        limit: PageSize,
      },
    ],
    {
      url: `/appointments/get-specialist-appointments`,
      method: "post",
      data: {
        page: specialistCurrentPage,
        search,
        limit: PageSize,
        // status: status === "ALL DISPUTES" ? null : status,
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
              // search: search,
              startDate: date ? getDate(date) : null,
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

  // console.log(patientId);

  //get all followup appointments
  const {
    data: followUpAppointments,
    isLoading: getFollowUpAppointmentLoading,
    refetch: refetchFollowUpAppointmentList,
    isError: isFollowUpAppointmentError,
  } = useCustomQuery(
    [
      GET_FOLLOWUP_APPOINTMENTS,
      {
        page: followUpCurrentPage,
        limit: PageSize,
        startDate: date ? getDate(date) : null,
      },
    ],
    {
      url: `/follow-up/all`,
      method: "post",
      data: {
        // search: "",
        page: followUpCurrentPage,
        limit: PageSize,
        startDate: date ? getDate(date) : null,
      },
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //search all followup appointment
  const {
    isLoading: searchFollowUpAppointmentLoading,
    isFetching: searchFollowUpAppointmentFetching,
    refetch: refetchFollowUpAppointment,
  } = useCustomQuery(
    [
      [GET_FOLLOWUP_APPOINTMENTS],
      {
        page: followUpCurrentPage,
        search: search,
        limit: PageSize,
      },
    ],
    {
      url: `/follow-up/all`,
      method: "post",
      data: {
        page: followUpCurrentPage,
        search,
        limit: PageSize,
        // status: status === "ALL DISPUTES" ? null : status,
      },
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [
            GET_FOLLOWUP_APPOINTMENTS,
            {
              page: followUpCurrentPage,
              limit: PageSize,
              // search: search,
              startDate: date ? getDate(date) : null,
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

  const closeModal = (willRefetch) => {
    // if (willRefetch) refetch();

    modalRef?.current?.handleToggle();
  };
  //reset navItem values
  navItems[0].count = generalistAppointments?.data?.count;
  navItems[1].count = specialistAppointments?.data?.count;
  navItems[2].count = followUpAppointments?.data?.count;
  // GeneralDoctorTable
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
              <GeneralDoctorTable
                refetch={refetchGeneralistAppointments}
                data={generalistAppointments?.data?.appointments}
                page={generalistCurrentPage}
                checkBoxItems={checkBoxItems}
                setcheckBoxItems={setcheckBoxItems}
                isDoctorDashboard={true}
              />
              <Box sx={{ p: { xs: 0, sm: 2 } }}>
                <Box sx={{ width: "90%" }}>
                  <Pagination
                    currentPage={generalistCurrentPage}
                    totalCount={generalistAppointments?.data?.count}
                    pageSize={PageSize}
                    onPageChange={handleGeneralistPageChange}
                  />
                </Box>
              </Box>
            </>
          ) : (
            <Typography>No item to display</Typography>
          )}
        </Paper>
      );

      break;
    // SpecialistDoctorTable
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
                refetch={refetchSpecialistAppointmentList}
                page={specialistCurrentPage}
                // currentPage={specialistCurrentPage}
                checkBoxItems={checkBoxItems}
                setcheckBoxItems={setcheckBoxItems}
                isDoctorDashboard={false}
              />
              <Box
                sx={{
                  p: { xs: 0, sm: 2 },
                }}
              >
                <Box sx={{ width: "90%" }}>
                  <Pagination
                    currentPage={specialistCurrentPage}
                    totalCount={specialistAppointments?.data?.count}
                    pageSize={PageSize}
                    onPageChange={handleSpecialistPageChange}
                  />
                </Box>
              </Box>
            </>
          ) : (
            <Typography>No item to display</Typography>
          )}
        </Paper>
      );

      break;
    // SpecialistDoctorTable
    case 2:
      view = getFollowUpAppointmentLoading ? (
        <CustomLoader />
      ) : isFollowUpAppointmentError ? (
        <Paper sx={{ p: 1 }}>
          <Typography>
            Something went wrong, refresh and try again Later
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 2 }}>
          {followUpAppointments?.data?.followUps?.length ? (
            <>
              <FollowUpAppointmentTable
                data={followUpAppointments?.data?.followUps}
                refetch={refetchFollowUpAppointmentList}
                page={followUpCurrentPage}
                // currentPage={specialistCurrentPage}
                checkBoxItems={checkBoxItems}
                setcheckBoxItems={setcheckBoxItems}
                isDoctorDashboard={false}
              />
              <Box sx={{ p: { xs: 0, sm: 2 } }}>
                <Box sx={{ width: "90%" }}>
                  <Pagination
                    currentPage={followUpCurrentPage}
                    totalCount={followUpAppointments?.data?.count}
                    pageSize={PageSize}
                    onPageChange={handleFollowUpPageChange}
                  />
                </Box>
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

  return (
    <Box>
      <Stack
        direction={"row"}
        sx={{ width: "100%" }}
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Typography variant="displayLg">Dashboard</Typography>
        <Box sx={{ display: "flex", gap: "10px" }}>
          <CustomButton
            text={"Invite Patient"}
            variant="outlined"
            color="primary"
            sx={{ color: "primary.main" }}
            onClick={() => modalRef?.current?.handleToggle()}
          />
          <CustomButton
            text={"Generte Service Report"}
            variant="containedBrown"
            color="secondary"
            onClick={() =>
              navigate("/home/front-desk/dashboard/generate-service-report")
            }
          />
          <CustomButton
            text={"Schedule Appointment"}
            color="success"
            onClick={() => navigate("/home/appointment/schedule-appointment")}
          />
        </Box>
      </Stack>
      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={9}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <DashboardCard
              // url="/home/dashboard/all-appointments"
              smallTxt="TOTAL APPOINTMENTS"
              bigTxt={allAppointments?.data?.count || ""}
              icnBgSx={{
                backgroundColor: "rgba(2, 0, 17, 0.1)",
                borderRadius: "50%",
              }}
              icon={<PeopleAltIcon sx={{ color: "black", fontSize: "30px" }} />}
            />
            <DashboardCard
              url="/home/dashboard/available-doctors"
              icnBgSx={{
                backgroundColor: "rgba(255, 129, 96, 0.1)",
                borderRadius: "50%",
              }}
              smallTxt="AVAILABLE DOCTORS"
              bigTxt={availableDoctors?.data?.count || 0}
              icon={<BiotechIcon sx={{ color: "#FF8160", fontSize: "30px" }} />}
            />
          </Stack>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Stack direction="column" spacing={2}>
              <Typography variant="heading" sx={{}}>
                Upcoming Appointment
              </Typography>

              <Stack
                direction={{ xs: "column", lg: "row" }}
                alignItems="center"
                justifyContent={"space-between"}
                sx={{ width: "100%" }}
                spacing={1}
              >
                <CustomTab
                  navItems={navItems}
                  value={value}
                  setValue={setvalue}
                />
              </Stack>
              <Stack
                direction={{ xs: "column", lg: "row" }}
                alignItems="center"
                justifyContent={"space-between"}
                sx={{ width: "100%" }}
                spacing={1}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <SearchBar
                    refetch={
                      value === 0
                        ? refetchGeneralistAppointment
                        : value === 1
                        ? refetchSpecialistAppointment
                        : refetchFollowUpAppointment
                    }
                    search={search}
                    setsearch={setsearch}
                    // handleSearch={() => {}}
                    placeholder="Search by Patient ID/Name"
                    isLoading={
                      value === 0
                        ? searchGeneralistAppointmentLoading ||
                          searchGeneralistAppointmentFetching
                        : value === 1
                        ? searchSpecialistAppointmentLoading ||
                          searchSpecialistAppointmentFetching
                        : searchFollowUpAppointmentLoading ||
                          searchFollowUpAppointmentFetching
                    }
                  />
                  {(value === 1 || value === 2) && (
                    <Box sx={{ ml: 2 }}>
                      <CustomDatePicker
                        type="date"
                        placeholder="Filter by date"
                        views={["year", "month", "day"]}
                        size="small"
                        lightBorder={true}
                        disableFuture={false}
                        setdate={(date) => {
                          setdate(new Date(date));
                        }}
                        date={date}
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
              </Stack>
              {view}
              {/* <Button
                variant="text"
                color="secondary"
                onClick={() => navigate("/home/dashboard/all-appointments")}
                sx={{ fontSize: "10px", alignSelf: "end", fontWeight: "bold" }}
              >
                {" "}
                See all Appointments <ArrowRightAltIcon sx={{ ml: 1 }} />{" "}
              </Button> */}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column", mb: 2 }}>
            <CustomPieChart
              data={formatPiedata(wardOverviewData?.data)}
              title="BEDS MANAGEMENT"
              xs={12}
              sm={12}
              showValue={true}
            />
            <Button
              onClick={() => navigate("/home/ward-overview")}
              variant="text"
              sx={{
                fontSize: "10px",
                alignSelf: "end",
                mt: 2,
              }}
              endIcon={<ArrowRightAltIcon />}
            >
              {" "}
              Show details
            </Button>
          </Paper>
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
              <Stack
                direction={"row"}
                spacing={0.4}
                alignItems="center"
                sx={{ width: "100%", mb: 1 }}
              >
                <Typography variant="heading" sx={{}}>
                  Pending Discharges
                </Typography>

                {/* <Button
                  variant="outlined"
                  sx={{
                    fontSize: "10px",
                    minWidth: "40%",
                  }}
                  endIcon={<KeyboardArrowRightIcon />}
                >
                  See all
                </Button> */}
              </Stack>

              {/* <SearchBar handleSearch={() => {}} width={"100% !important"} /> */}
            </Box>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                width: "100%",

                mt: 2,
                justifyContent: "space-between",
              }}
            >
              <Typography variant="caption" sx={{ color: "#979797" }}>
                Patients
              </Typography>
              <Typography variant="caption" sx={{ color: "#979797" }}>
                Action
              </Typography>
            </Stack>

            {pendingDischargeList?.data?.patients?.map((data, i) => (
              <Row
                key={data?._id}
                data={data}
                refetch={refetchPendingDischargeList}
              />
            ))}

            <Button
              variant="text"
              onClick={() => navigate("/home/patient-discharge-summary")}
              color="secondary"
              sx={{
                fontSize: "10px",
                alignSelf: "end",
                mt: 2,
                fontWeight: "bold",
              }}
            >
              {" "}
              See all History <ArrowRightAltIcon sx={{ ml: 1 }} />{" "}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          width: {
            xs: "90%",
            lg: "50vw",
          },
        }}
        ariaLabel="create-unit-modal"
      >
        <InviteMobilePatient handleClose={closeModal} />
      </CustomModal>
    </Box>
  );
}

FrontDesskDashboard.defaultProps = {
  navItems: [
    {
      label: "General",
      id: 0,
      count: 10,
    },
    {
      label: "Specialist",
      id: 1,
      count: 20,
    },
    {
      label: "Follow-up",
      id: 2,
      count: 20,
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
};

export default FrontDesskDashboard;
