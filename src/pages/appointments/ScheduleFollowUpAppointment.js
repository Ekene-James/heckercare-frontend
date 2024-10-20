import {
  Box,
  Button,
  Stack,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import CustomTab from "components/atoms/CustomTab";
// import Specialist from "components/molecules/appointment/Specialist";
import Generalist from "components/molecules/appointment/Generalist";

import CustomDatePicker from "components/atoms/DatePicker";

import CustomSelect from "components/atoms/Select";

import SearchDropdown from "components/atoms/SearchDropdown";
import CustomModal from "components/atoms/CustomModal";

import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import CustomLoader from "components/atoms/CustomLoader";
// import Scheduler from "../customScheduler/Scheduler";
import { useQueryClient } from "react-query";
import { groupBy } from "utils/groupByFunc";
import {
  GET_DEPARTMENTS,
  GET_SPECIALIST_APPOINTMENTS,
  GET_STAT_FOR_SINGLE_DEPARTMENT,
  SEARCH_PATIENT,
  SEARCH_STAFF,
} from "utils/reactQueryKeys";
import Scheduler from "components/molecules/customScheduler/Scheduler";
import FrequencyModal from "components/molecules/appointment/modalContent/FrequencyModal";

const frequency = [
  {
    name: "Daily",
    value: "DAILY",
  },
  {
    name: "Weekly",
    value: "WEEKLY",
  },
  {
    name: "Monthly",
    value: "MONTHLY",
  },
  {
    name: "Yearly",
    value: "YEARLY",
  },
  {
    name: "Weekdays",
    value: "WEEKDAYS",
  },
  {
    name: "Weekends",
    value: "WEEKENDS",
  },
  {
    name: "Alternate Years",
    value: "ALTERNATE_YEARS",
  },
  {
    name: "Alternate Months",
    value: "ALTERNATE_MONTHS",
  },
  {
    name: "Alternate Weeks",
    value: "ALTERNATE_WEEKS",
  },
  {
    name: "Alternate Days",
    value: "ALTERNATE_DAYS",
  },
];

const getOnlyDate = (date) => {
  const yr = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${yr}-${month}-${day}`;
};
const formatState = (state) => {
  const data = { ...state };
  delete data.department;
  return data;
};

const navItems = [
  {
    label: "Specialist/Consultant",

    id: 0,
  },
  // {
  //   label: "Generalist",

  //   id: 1,
  // },
];
function ScheduleFollowUpAppointment({ closeModal, modalContent }) {
  console.log(modalContent);
  const navigate = useNavigate();
  const [value, setvalue] = React.useState(0);

  let view;
  switch (value) {
    case 0:
      view = <Specialist closeModal={closeModal} modalContent={modalContent} />;
      break;

    default:
      break;
  }
  return (
    <Box>
      <Stack direction={"column"} spacing={3}>
        <Stack direction={"column"} spacing={1}>
          <Typography variant="displayMd">
            Schedule Follow-Up Appointment
          </Typography>
        </Stack>
        <CustomTab navItems={navItems} value={value} setValue={setvalue} />
        {view}
      </Stack>
    </Box>
  );
}

function Specialist({ closeModal, modalContent }) {
  const modalRef = React.useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formsState, setformsState] = React.useState({
    startDate: "",
    startTime: "",
    endTime: "",
    frequency: null,
    // doctor: "",
    // patient: "",
    endFrequency: null,
    // department: "",
  });
  const [date, setdate] = React.useState({});
  const [search, setsearch] = React.useState("");
  const [searchDoctor, setsearchDoctor] = React.useState("");
  const [onSelectPatient, setonSelectPatient] = React.useState(false);
  const [onSelectDoctor, setonSelectDoctor] = React.useState(false);

  const [dateFilter, setdateFilter] = React.useState(new Date());
  const [doctorId, setdoctorId] = React.useState("");

  //get depts
  const { data: allDepartments } = useCustomQuery(
    GET_DEPARTMENTS,
    {
      url: `/department/get-all-departments`,
      method: "get",
      avoidCancelling: true,
    },
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const formartedData = data.data.departments.map((dept) => {
          return { name: dept.name, value: dept._id };
        });
        return formartedData;
      },
    }
  );

  //get staffs for a dept
  const { data: deptStaffs } = useCustomQuery(
    [GET_STAT_FOR_SINGLE_DEPARTMENT, formsState.department],
    {
      url: `/department/dept-details/${formsState.department}`,
      method: "get",
    },
    {
      enabled: !!formsState.department,
      refetchOnWindowFocus: false,
      select: (data) => {
        const formartedData = data.data.staff.map((staf) => {
          return { name: staf.fullName, value: staf._id };
        });
        return formartedData;
      },
    }
  );

  //get specialist appointments using post
  const { data: specialistAppointments, isLoading: appointmentsLoading } =
    useCustomQuery(
      [GET_SPECIALIST_APPOINTMENTS, getOnlyDate(dateFilter)],
      {
        url: `/appointments/get-specialist-appointments`,
        method: "post",
        avoidCancelling: true,
        data: {
          startDate: getOnlyDate(dateFilter),
        },
      },
      {
        refetchOnWindowFocus: false,
        select: (data) => {
          if (data.data.appointments.length) {
            /** day view */
            //doctor is an object and we cant group for obj, so we extract doctors id and group by it
            const extractDocId = data.data.appointments.map((appointment) => {
              return {
                ...appointment,
                doctorId: appointment?.doctor?._id,
              };
            });

            const groupByDoctor = groupBy(extractDocId, "doctorId");
            delete groupByDoctor["undefined"];
            const groupByDoctorKeys = Object.keys(groupByDoctor);
            const formartedData = groupByDoctorKeys.map((key) => {
              return {
                doctorDetails: groupByDoctor[key][0].doctor,
                shifts: groupByDoctor[key],
                day: new Date(groupByDoctor[key][0].startDateTime).getDate(),
              };
            });
            return formartedData;
          }
        },
      }
    );

  //get specialist appointments using post method with a doctor Id

  const { isLoading: appointmentsLoading1 } = useCustomQuery(
    [GET_SPECIALIST_APPOINTMENTS, doctorId],
    {
      url: `/appointments/get-all-appointments-by-doctor/${doctorId}`,
      method: "post",
      avoidCancelling: true,
      data: {
        startDate: getOnlyDate(dateFilter),
      },
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!doctorId,
      onSuccess: (res) =>
        queryClient.setQueryData(
          [GET_SPECIALIST_APPOINTMENTS, getOnlyDate(dateFilter)],
          (oldQueryData) => {
            return {
              ...oldQueryData,
              data: {
                ...oldQueryData.data,
                appointments: res.data,
              },
            };
          }
        ),
    }
  );

  //schedule appointmnent
  const { mutate: createAppointment, isLoading: createAppointmentLoading } =
    useCustomMutation(
      {
        url: `/appointments/create-follow-up-appointment/${modalContent?._id}`,
        method: "post",
        data: formatState({
          ...formsState,
          doctor: modalContent?.doctor?._id,
          patient: modalContent?.patientId?._id,
        }),
      },
      {
        onSuccess: () => {
          setsearch("");
          setformsState({
            startDate: "",
            startTime: "",
            endTime: "",
            frequency: null,
            // doctor: "",
            // patient: "",
            endFrequency: null,
            // department: "",
          });
          setdate({});
          closeModal();
          // queryClient.invalidateQueries({
          //   queryKey: [GET_SPECIALIST_APPOINTMENTS],
          // });
          toast.success("Success");
        },

        onError: (error) => {
          if (Array.isArray(error.message)) {
            return error.message.map((msg) => toast.error(msg));
          }
          return toast.error(error.message);
        },
      }
    );

  //get patients
  const {
    isLoading,

    data: patients,
    refetch: refetchPatients,
  } = useCustomQuery(
    [SEARCH_PATIENT, search],
    {
      url: `/patients/get-all-patients`,
      data: {
        search,
      },
      method: "post",
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!search && !onSelectPatient,
    }
  );

  //get staffs/patients
  const {
    isLoading: docsLoading,
    refetch: refetchStaffs,
    data: staffsData,
  } = useCustomQuery(
    [SEARCH_STAFF, searchDoctor],
    {
      url: `/user/get-all-staff`,
      method: "post",
      data: {
        search: searchDoctor,
      },
      avoidCancelling: false,
    },
    {
      enabled: !!searchDoctor && !onSelectDoctor,
      refetchOnWindowFocus: false,
    }
  );

  const handleChange = (e) => {
    setformsState({
      ...formsState,
      [e.target.name]: e.target.value,
    });
  };
  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };

  const handlePatientsOnselect = (patientDetails) => {
    setonSelectPatient(true);
    setsearch(`${patientDetails.firstName} ${patientDetails.lastName}`);
    setformsState({
      ...formsState,
      patient: patientDetails._id,
    });
  };

  const handleSelectDate = (date, name) => {
    setdate((prev) => {
      return {
        ...prev,
        [name]: date,
      };
    });
    const d = new Date(date);
    const yr = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    setformsState({
      ...formsState,
      [name]: `${yr}-${month}-${day}`,
    });
  };
  const handleSelectTime = (date, name) => {
    setdate((prev) => {
      return {
        ...prev,
        [name]: date,
      };
    });

    const d = new Date(date);

    let hour = d.getHours();
    hour = hour < 10 ? `0${hour}` : hour;
    let min = d.getMinutes();
    min = min < 10 ? `0${min}` : min;

    setformsState({
      ...formsState,
      [name]: `${hour}:${min}`,
    });
  };

  const handleStaffsOnselect = (res) => {
    setonSelectDoctor(true);
    setdoctorId(res._id);
    setsearchDoctor(`${res.firstName} ${res.lastName}`);
  };
  const handleSave = () => {
    if (formsState.startDate === formsState.endFrequency)
      return toast.error("Date and End frequency cant be same");
    createAppointment();
  };
  return (
    <Box>
      <Grid container spacing={1} sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={10}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <SearchDropdown
                placeholder="Search ( with “Patient name” or “Patient ID”)"
                handleOnselect={handlePatientsOnselect}
                title="Patients's Information"
                createBtnTxt="Create New Patient"
                traySx={{ minWidth: "30vw" }}
                boxSx={{ width: "100%" }}
                data={patients?.data?.patients}
                isLoading={isLoading}
                search={`${modalContent?.patientId?.firstName} ${modalContent?.patientId?.lastName}`}
                setsearch={setsearch}
                reFetch={refetchPatients}
                readOnly
                setOnSelect={setonSelectPatient}
                createBtnAction={() => navigate(`/home/patient/registration`)}
              />
            </Grid>
            {/* <Grid item xs={12} sm={4}>
              <CustomSelect
                options={allDepartments}
                label="Department"
                state={formsState.department}
                handleChange={handleChange}
                name="department"
                haveTopLabel={true}
                placeholder="Select (Doctor Department)"
              />
            </Grid> */}
            <Grid item xs={12} sm={4}>
              <CustomSelect
                options={["OVERCHARGED", "WRONG_CHARGE", "OTHER"]}
                label="Appointment with"
                state={`${modalContent?.doctor?.fullName}`}
                handleChange={handleChange}
                name="doctor"
                haveTopLabel={true}
                placeholder="Select (Doctor)"
                readOnly
                // disabled={!formsState.department}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomDatePicker
                type="date"
                views={["year", "month", "day"]}
                title="Date"
                disableFuture={false}
                name="startDate"
                datePickerRootSx={{ height: "auto", width: "100%" }}
                datePickerSx={{ width: "100%" }}
                setdate={handleSelectDate}
                date={date?.startDate || null}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <CustomDatePicker
                type="time"
                title="From"
                placeholder="Select from time"
                name="startTime"
                disableFuture={false}
                setdate={handleSelectTime}
                datePickerRootSx={{ height: "auto" }}
                date={date?.startTime || null}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <CustomDatePicker
                type="time"
                title="To"
                name="endTime"
                placeholder="Select to time"
                disableFuture={false}
                setdate={handleSelectTime}
                datePickerRootSx={{ height: "auto" }}
                date={date?.endTime || null}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomSelect
                options={frequency}
                label="Frequency"
                state={formsState.frequency}
                handleChange={handleChange}
                name="frequency"
                haveTopLabel={true}
                placeholder="Select"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomDatePicker
                type="date"
                views={["year", "month", "day"]}
                title="End Frequency"
                placeholder="Select date"
                disableFuture={false}
                name="endFrequency"
                setdate={handleSelectDate}
                datePickerRootSx={{ height: "auto", width: "100%" }}
                datePickerSx={{ width: "100%" }}
                date={date?.endFrequency || null}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                color="secondary"
                sx={{ width: "168px" }}
                variant="contained"
                onClick={handleSave}
                disabled={createAppointmentLoading}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={12}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <SearchDropdown
              placeholder="Search"
              handleOnselect={handleStaffsOnselect}
              title="Search for Doctor"
              createBtnTxt=""
              createBtnAction={() => {}}
              boxSx={{ width: "25%" }}
              traySx={{ width: "40vw", bottom: "-120px" }}
              data={staffsData?.data?.data}
              isLoading={docsLoading}
              search={searchDoctor}
              setsearch={setsearchDoctor}
              reFetch={refetchStaffs}
              setOnSelect={setonSelectDoctor}
            />

            <CustomDatePicker
              type="date"
              views={["year", "month", "day"]}
              placeholder="Select Date"
              size="small"
              datePickerSx={{ width: "140px" }}
              setdate={(date) => setdateFilter(date)}
              disableFuture={false}
              date={dateFilter}
            />
          </Stack>

          <Scheduler
            view={"Day"}
            dayApiData={specialistAppointments}
            currentDay={dateFilter}
            isLoading={appointmentsLoading1 || appointmentsLoading}
          />
        </Grid> */}
      </Grid>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          height: "fit-content !important",
          // width: "100% !important",
        }}
      >
        <FrequencyModal cancel={toggleModal} />
      </CustomModal>
    </Box>
  );
}
Specialist.defaultProps = {
  dropDownContent: [
    {
      name: "Daily",
      value: "Day",
    },
    {
      name: "Weekly",
      value: "Week",
    },
    {
      name: "Monthly",
      value: "Month",
    },
  ],

  SearchDropdownData: [
    {
      id: "ID-123456",
      name: "Sam Smith",
      age: "23yrs",
      gender: "F",
    },
    {
      id: "ID-123457",
      name: "Jon Smith",
      age: "50yrs",
      gender: "M",
    },
    {
      id: "ID-123456",
      name: "Sam Doe",
      age: "25yrs",
      gender: "F",
    },
    {
      id: "ID-123456",
      name: "Jon Doe",
      age: "28yrs",
      gender: "M",
    },
  ],
};
// export default Specialist;

export default ScheduleFollowUpAppointment;
