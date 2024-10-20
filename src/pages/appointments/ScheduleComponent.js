import React from "react";

import RefreshIcon from "@mui/icons-material/Refresh";

import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";

import CustomMenu from "components/atoms/CustomMenu";

import CustomModal from "components/atoms/CustomModal";
import ScheduleAppointment from "./ScheduleAppointment";

import { useCustomQuery } from "store/hooks/react-query/query/useQuery";

import Scheduler from "components/molecules/customScheduler/Scheduler";
import CustomDatePicker from "components/atoms/DatePicker";
import { daysOfThWeek } from "components/molecules/customScheduler/util";
import CsvDownloader from "react-csv-downloader";

import { groupBy } from "utils/groupByFunc";
import { exportToExcel } from "utils/exportToExcel";
import { GET_SPECIALIST_APPOINTMENTS } from "utils/reactQueryKeys";

const dropDownContent = [
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
];
const formatExportData = (data) => {
  if (data?.length) {
    return data.map((d) => {
      const formartedData = {
        ...d,
        doctorName: `${d?.doctor?.fullName}`,
        doctorId: `${d?.doctor?._id}`,
        patientName: `${d?.patient?.firstName} ${d?.patient?.lastName}`,
        patientId: `${d?.patient?._id}`,
      };
      delete formartedData.doctor;
      delete formartedData.patient;
      return formartedData;
    });
  }
  return [];
};
const columns = [
  {
    id: "_id",
    displayName: "id",
  },
  {
    id: "appointmentStatus",
    displayName: "appointmentStatus",
  },
  {
    id: "createdAt",
    displayName: "createdAt",
  },
  {
    id: "doctorName",
    displayName: "doctorName",
  },
  {
    id: "doctorId",
    displayName: "doctorId",
  },
  {
    id: "patientName",
    displayName: "patientName",
  },
  {
    id: "patientId",
    displayName: "patientId",
  },
  {
    id: "startDateTime",
    displayName: "startDate",
  },
  {
    id: "endDateTime",
    displayName: "endDate",
  },
  {
    id: "startTime",
    displayName: "startTime",
  },
  {
    id: "endTime",
    displayName: "endTime",
  },
  {
    id: "frequency",
    displayName: "frequency",
  },
  {
    id: "isSeenCompleted",
    displayName: "isSeenCompleted",
  },
];
const getOnlyDate = (date) => {
  const yr = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${yr}-${month}-${day}`;
};
function ScheduleComponent() {
  const modalRef = React.useRef(null);
  const [scheduleDate, setscheduleDate] = React.useState(new Date());
  const [dateRange, setdateRange] = React.useState(daysOfThWeek(new Date()));

  const [views, setviews] = React.useState({ name: "Weekly", value: "Week" });

  //get specialist appointments using post (week and monthly view)
  const { data: specialistAppointments } = useCustomQuery(
    [
      GET_SPECIALIST_APPOINTMENTS,
      getOnlyDate(dateRange[0]),
      getOnlyDate(dateRange[dateRange.length - 1]),
    ],
    {
      url: `/appointments/get-specialist-appointments`,
      method: "post",
      avoidCancelling: true,
      data: {
        startDate: getOnlyDate(dateRange[0]),
        endDate: getOnlyDate(dateRange[dateRange.length - 1]),
      },
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //get specialist appointments using post (daily view)
  const { data: dayViewSpecialistAppointments, isLoading } = useCustomQuery(
    [GET_SPECIALIST_APPOINTMENTS, getOnlyDate(scheduleDate)],
    {
      url: `/appointments/get-specialist-appointments`,
      method: "post",
      avoidCancelling: true,
      data: {
        startDate: getOnlyDate(scheduleDate),
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
      enabled: views.value === "Day",
    }
  );

  const handleClickDropdownItem = (item) => {
    setviews(item);
  };
  const handleSelectDate = (date) => {
    const dateRange = daysOfThWeek(date);
    setscheduleDate(date);
    setdateRange(dateRange);
  };
  const handleReset = () => {
    setscheduleDate(new Date());
  };
  const handleExport = (item) => {
    if (item.name === "Excel") {
      const data = formatExportData(specialistAppointments?.data?.appointments);
      exportToExcel(data, "appointment_data_excel");
    }
  };

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "auto" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ p: 1, pt: 2 }}
        >
          <CustomMenu
            caption={views.name}
            items={dropDownContent}
            onClickItem={handleClickDropdownItem}
            popperSx={{ width: { xs: "25vw", sm: "8vw" } }}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              startIcon={<RefreshIcon />}
              variant="outlined"
              onClick={handleReset}
            >
              Reset
            </Button>
            <CustomDatePicker
              type="date"
              views={["year", "month", "day"]}
              size="small"
              datePickerSx={{ width: "140px" }}
              setdate={handleSelectDate}
              date={scheduleDate}
              disableFuture={false}
              name="schedule_date"
            />

            <CustomMenu
              caption="Export"
              icon={<FileDownloadOutlinedIcon />}
              onClickItem={handleExport}
              popperSx={{ width: { xs: "26vw", sm: "9vw" } }}
              disabled={
                specialistAppointments?.data?.appointments?.length === 0
              }
              items={[
                {
                  name: (
                    <CsvDownloader
                      filename={`appointmet_data`}
                      extension=".csv"
                      columns={columns}
                      datas={formatExportData(
                        specialistAppointments?.data?.appointments
                      )}
                      style={{ width: "100%" }}
                    >
                      <Typography>CSV</Typography>
                    </CsvDownloader>
                  ),
                },
                {
                  name: "Excel",
                },
              ]}
            />

            <Button
              variant="contained"
              color="secondary"
              sx={{ width: "199px" }}
              onClick={() => modalRef?.current?.handleToggle()}
            >
              Schedule appointment{" "}
            </Button>
          </Stack>
        </Stack>
        <Paper sx={{ minWidth: 650, width: "100%", overflow: "auto" }}>
          <Scheduler
            view={views.value}
            apiData={specialistAppointments?.data?.appointments || []}
            dayApiData={dayViewSpecialistAppointments || []}
            currentDay={scheduleDate}
            cellType="appointment"
            isLoading={isLoading}
          />
        </Paper>
      </Paper>

      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          height: "100% !important",
          minHeight: "85vh",
          minWidth: "75vw",
        }}
      >
        <ScheduleAppointment />
      </CustomModal>
    </>
  );
}

export default ScheduleComponent;
