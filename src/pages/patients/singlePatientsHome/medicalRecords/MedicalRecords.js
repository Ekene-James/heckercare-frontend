import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomLineChart from "components/atoms/CustomLineChart";
import CustomLoader from "components/atoms/CustomLoader";
import CustomModal from "components/atoms/CustomModal";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import CustomDatePicker from "components/atoms/DatePicker";
import SearchBar from "components/atoms/SearchBar";
import VisitHistoryTable from "components/molecules/tabels/patient/VisitHistoryTable";

import React from "react";
import { useParams } from "react-router-dom";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_PATIENT_VISITS } from "utils/reactQueryKeys";
import GenerateResultModal from "./GenerateResultModal";

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}
const formatDate = (date) => {
  if (!date) return;

  const copy = new Date(date);
  return [padTo2Digits(copy.getMonth() + 1), copy.getFullYear()].join("-");
};
function MedicalRecords() {
  const { id } = useParams();
  const modalRef = React.useRef(null);
  const [date, setdate] = React.useState(null);
  //get all patients visits
  const { data: visits, isLoading } = useCustomQuery(
    [GET_PATIENT_VISITS, id, { date: formatDate(date) }],
    {
      url: `/visit/visits/${id}`,
      method: "post",
      data: { date: formatDate(date) },
      avoidCancelling: true,
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, minHeight: "100vh" }}>
            <Stack
              direction={"row"}
              alignItems="center"
              justifyContent={"space-between"}
              width={"100%"}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Visit History
              </Typography>
              <CustomButton
                text={"Generate Report"}
                color="secondary"
                onClick={toggleModal}
                startIcon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.99999 6.66493L5 6.67188"
                      stroke="white"
                      strokeLinecap="round"
                    />
                    <path
                      d="M2 3.33301C2 2.22844 2.89543 1.33301 4 1.33301H9.2759C9.74377 1.33301 10.1968 1.49704 10.5563 1.79657L12 2.99967L13.2804 4.06665C13.7364 4.44664 14 5.00953 14 5.60309V12.6663C14 13.7709 13.1046 14.6663 12 14.6663H4C2.89543 14.6663 2 13.7709 2 12.6663V3.33301Z"
                      stroke="white"
                    />
                    <path d="M11 12H5" stroke="white" strokeLinecap="round" />
                    <path
                      d="M11 9.33301H5"
                      stroke="white"
                      strokeLinecap="round"
                    />
                  </svg>
                }
              />
            </Stack>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                width: "100%",
                mt: 2,
              }}
            >
              <CustomDatePicker
                type="date"
                views={["month"]}
                date={date}
                setdate={setdate}
                placeholder="Select Month/Year"
                disableFuture={false}
              />
            </Box>
            {isLoading ? (
              <CustomLoader />
            ) : visits?.data?.length ? (
              <VisitHistoryTable data={visits?.data} />
            ) : (
              "No Data Found"
            )}
          </Paper>
        </Grid>

        {/* <Grid item xs={12} sx={{ mt: 2 }}>
        <Paper sx={{ p: 2, pt: 4 }}>
          <Stack
            sx={{ mb: 3, width: "100%" }}
            direction="row"
            justifyContent={"space-between"}
            alignItems="center"
          >
            <Typography variant="displayMd">Analytics</Typography>
            <CustomDatePicker
              type="date"
              placeholder="Select Month/Year"
              views={["year", "month", "day"]}
              lightBorder
            />
          </Stack>
          <CustomLineChart
            xVal="month"
            data={lineData}
            lines={[
              {
                strokeColor: "#FB896B",
                yVal: "Current Year",
                showDot: false,
              },
              {
                strokeColor: "#020011",
                yVal: "Target Year",
                showDot: false,
              },
            ]}
          />
          <Typography sx={{ mt: 2, mb: 1 }} variant="heading">
            Compare with
          </Typography>
          <CustomDatePicker type="year" />
        </Paper>
      </Grid> */}
      </Grid>
      <CustomRightDrawer
        ref={modalRef}
        drawerSx={{
          width: {
            xs: "90vw",
            sm: "70vw",
            md: "60vw",
          },
        }}
        title="Generate Report"
        subTitle=""
      >
        <GenerateResultModal toggleModal={toggleModal} />
      </CustomRightDrawer>
    </>
  );
}

export default MedicalRecords;
