import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import CustomDatePicker from "components/atoms/DatePicker";

import UpcomingAppointmentTable from "components/molecules/tabels/patient/upcomingAppointmentTable/UpcomingAppointmentTable";
import AppointmentHistoryTable from "components/molecules/tabels/patient/appointmentHistory/AppointmentHistoryTable";
import {
  GET_PATIENT_APPOINTMENT_HISTORY,
  GET_UPCOMING_APPOINTMENTS_BY_PATIENT,
} from "utils/reactQueryKeys";
import { useParams } from "react-router-dom";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
import Pagination from "components/molecules/pagination/Pagination";
import moment from "moment";
const PageSize = 10;
function DoctorsAppointments() {
  const { id } = useParams();
  const [date, setdate] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [historyCurrentPage, sethistoryCurrentPage] = React.useState(1);

  //get upcoming appointments
  const {
    isLoading: upcomingAppointmentLoading,

    data: upcomingAppointments,
  } = useCustomQuery(
    [
      GET_UPCOMING_APPOINTMENTS_BY_PATIENT,
      id,
      {
        page: currentPage,
        limit: PageSize,
      },
    ],
    {
      url: `/appointments/pending-patient-appointments/${id}`,
      method: "post",
      data: {
        page: currentPage,
        limit: PageSize,
      },
      avoidCancelling: true,
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  //get appointment history
  const {
    isLoading: historyLoading,

    data: historyData,
  } = useCustomQuery(
    [
      GET_PATIENT_APPOINTMENT_HISTORY,
      id,
      {
        page: historyCurrentPage,
        limit: PageSize,
        startDate: date ? moment(date).format("YYYY-MM-DD") : null,
      },
    ],
    {
      url: `/appointments/history-patient-appointments/${id}`,
      method: "post",
      avoidCancelling: true,
      data: {
        page: historyCurrentPage,
        limit: PageSize,
        startDate: date ? moment(date).format("YYYY-MM-DD") : null,
      },
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleHistoryPageChange = (page) => {
    sethistoryCurrentPage(page);
  };

  const handleSetDate = (d) => {
    setdate(new Date(d));
  };

  return (
    <Box>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            flexDirection: "row",
          }}
        >
          <Typography variant="h6" sx={{}}>
            Upcoming Appointment
          </Typography>
        </Box>
        {upcomingAppointmentLoading ? (
          <CustomLoader />
        ) : upcomingAppointments?.data?.appointments?.length ? (
          <>
            <UpcomingAppointmentTable
              data={upcomingAppointments?.data?.appointments}
              currentPage={currentPage}
            />
            <Box sx={{ width: "90%" }}>
              <Pagination
                currentPage={currentPage}
                totalCount={upcomingAppointments?.data?.count || 10}
                pageSize={PageSize}
                onPageChange={handlePageChange}
              />
            </Box>
          </>
        ) : (
          "No data found"
        )}
      </Paper>
      <Paper sx={{ p: 2, mt: 2 }}>
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
          <Typography variant="h6">Appointment History</Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <CustomDatePicker
              type="date"
              views={["year", "month", "day"]}
              size="small"
              datePickerSx={{ ml: 1 }}
              disableFuture={false}
              date={date}
              setdate={handleSetDate}
            />
          </Box>
        </Box>
        {historyLoading ? (
          <CustomLoader />
        ) : historyData?.data?.appointments?.length ? (
          <>
            <AppointmentHistoryTable data={historyData.data.appointments} />
            <Box sx={{ width: "90%" }}>
              <Pagination
                currentPage={historyCurrentPage}
                totalCount={historyData?.data?.count || 10}
                pageSize={PageSize}
                onPageChange={handleHistoryPageChange}
              />
            </Box>
          </>
        ) : (
          "No data found"
        )}
      </Paper>
    </Box>
  );
}
//
export default React.memo(DoctorsAppointments);
