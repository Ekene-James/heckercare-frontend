import {
  Box,
  Divider,
  InputLabel,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomLoader from "components/atoms/CustomLoader";
import DateRangePicker from "components/atoms/dateRangePicker/DateRangePicker";
import SearchDropdown from "components/atoms/SearchDropdown";
import ServiceReportTable from "components/molecules/tabels/dashboard/ServiceReportTable";
import moment from "moment";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { baseURL } from "utils/axios-utils";
import { downloadOnClick } from "utils/exportToExcel";
import { numberFormatter } from "utils/numberFormatter";
import { PATIENTS_SERVICE_REPORT, SEARCH_PATIENT } from "utils/reactQueryKeys";

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}
const formatDate = (date) => {
  if (!date) return null;

  const copy = new Date(date);
  return [
    copy.getFullYear(),
    padTo2Digits(copy.getMonth() + 1),
    padTo2Digits(copy.getDate()),
  ].join("-");
};
const getTotalPayment = (data = []) => {
  return data.map((d) => d.totalCost).reduce((a, b) => a + b, 0);
};
const getPendingPayment = (data = []) => {
  return data.filter((d) => d.status === "PENDING").length;
};
function ServiceReport() {
  const navigate = useNavigate();
  const [search, setsearch] = React.useState("");
  const [patientId, setpatientId] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [date, setdate] = React.useState([]);
  const [onSelectPatient, setonSelectPatient] = React.useState(false);

  //get patients
  const {
    isLoading: patientsLoading,

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
      avoidCancelling: false,
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!search && !onSelectPatient,
    }
  );
  const {
    isLoading: reportLoading,
    mutate: getReport,
    data: report,
    isError,
    isSuccess,
  } = useCustomMutation({
    url: `/payment/service-report?patient=${patientId}&startDate=${formatDate(
      date[0]
    )}&endDate=${formatDate(date[1])}`,

    method: "get",
  });

  const handlePatientOnselect = (res) => {
    setonSelectPatient(true);
    setpatientId(res._id);
    setsearch(`${res.firstName} ${res.lastName}`);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <Stack gap={3}>
      <Typography
        variant="h3"
        sx={{ fontWeight: "800", fontSize: "28px", lineHeight: "42px" }}
      >
        Service Report
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Stack
          gap={2}
          sx={{
            width: {
              xs: "90%",
              sm: "50%",
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "700", fontSize: "18px", lineHeight: "21px" }}
          >
            Service Report
          </Typography>
          <SearchDropdown
            placeholder="Search ( with “Patient name” or “Patient ID”)"
            handleOnselect={handlePatientOnselect}
            title="Admission ID/Patient ID"
            createBtnTxt="Create New Patient"
            traySx={{ minWidth: "30vw" }}
            data={patients?.data?.patients}
            isLoading={patientsLoading}
            search={search}
            setsearch={setsearch}
            reFetch={refetchPatients}
            setOnSelect={setonSelectPatient}
            createBtnAction={() => navigate(`/home/patient/registration`)}
          />
          <Stack sx={{ width: { xs: "100%", sm: "80%" } }}>
            <InputLabel
              sx={{
                mb: 1,
                fontWeight: "600",
                lineHeight: "18px",
                color: "primary.formLabel",
                fontSize: "0.86rem",
              }}
            >
              Date
            </InputLabel>
            <DateRangePicker
              values={date}
              setValues={setdate}
              placeholder="Select date range"
              calendarSx={{
                left: "15",
              }}
            />
          </Stack>
          <Box>
            <CustomButton
              text={"Find Report"}
              color="secondary"
              onClick={() => getReport()}
              disabled={reportLoading || !patientId || !date.length}
            />
          </Box>
        </Stack>
      </Paper>
      {reportLoading ? (
        <CustomLoader />
      ) : isError ? (
        <Paper sx={{ p: 1 }}>
          <Typography>
            Something went wrong, refresh and try again Later
          </Typography>
        </Paper>
      ) : report?.data?.length ? (
        <Paper sx={{ p: 3 }}>
          <Stack gap={3}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "400",
                fontSize: "14px",
                lineHeight: "21px",
                opacity: 0.5,
              }}
            >
              Showing services rendered to
            </Typography>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              gap={2}
            >
              <Stack direction={"row"} alignItems={"center"} gap={2}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "800",
                    fontSize: "28px",
                    lineHeight: "42px",
                  }}
                >
                  {search}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "700",
                    fontSize: "14px",
                    lineHeight: "21px",
                    opacity: 0.8,
                  }}
                >
                  {`from ${moment(date[0]).format("MMM Do YYYY")} to ${moment(
                    date[1]
                  ).format("MMM Do YYYY")}`}
                </Typography>
              </Stack>
              <CustomButton
                text={"Download Report"}
                color="success"
                onClick={() =>
                  downloadOnClick(
                    `${baseURL}/payment/service-report/export`,
                    `service_report_for_${search}_from_${moment(date[0]).format(
                      "MMM Do YYYY"
                    )}_to_${moment(date[1]).format("MMM Do YYYY")}.pdf`,
                    "POST",
                    {
                      patient: patientId,
                      startDate: formatDate(date[0]),
                      endDate: formatDate(date[1]),
                    }
                  )
                }
              />
            </Stack>
            <Stack direction={"row"} alignItems={"center"} gap={2}>
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "21px",
                    opacity: 0.5,
                  }}
                >
                  Pending Payments:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "800",
                    fontSize: "20px",
                    lineHeight: "24px",
                  }}
                >
                  {numberFormatter(getPendingPayment(report?.data))}
                </Typography>
              </Stack>
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "21px",
                    opacity: 0.5,
                  }}
                >
                  Total Payments:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "800",
                    fontSize: "20px",
                    lineHeight: "24px",
                  }}
                >
                  ₦{numberFormatter(getTotalPayment(report?.data))}
                </Typography>
              </Stack>
            </Stack>
            <Divider light sx={{ width: "100%" }} />
            <ServiceReportTable
              data={report?.data}
              handlePageChange={handlePageChange}
              count={10}
              currentPage={currentPage}
            />
          </Stack>
        </Paper>
      ) : !!patientId && date.length && isSuccess ? (
        <Paper sx={{ p: 1 }}>
          <Typography>No data found</Typography>
        </Paper>
      ) : null}
    </Stack>
  );
}

export default ServiceReport;
