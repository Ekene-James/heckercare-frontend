import React from "react";

import Typography from "@mui/material/Typography";

import Stack from "@mui/material/Stack";
import { Box, Button, Paper } from "@mui/material";

import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { useNavigate, useParams } from "react-router-dom";
import { GET_PATIENT_INVESTIGATION } from "utils/reactQueryKeys";
import { useTabCtx } from "store/contextStore/treatmentTab/TabStore";
import { setcurrentTab } from "store/contextStore/treatmentTab/TabAction";

import CustomLoader from "components/atoms/CustomLoader";
import { groupBy } from "utils/groupByFunc";
import InvestigationsAccordionComponent from "components/molecules/patient/singlePatient/investigationsSubComponent/InvestigationsAccordionComponent";
import CustomModal from "components/atoms/CustomModal";
import UploadResultModal from "components/molecules/patient/singlePatient/investigationsSubComponent/UploadResultModal";
import CustomDatePicker from "components/atoms/DatePicker";
import DateRangePicker from "components/atoms/dateRangePicker/DateRangePicker";
import { useSanitizeQueryParams } from "utils/sanitizeQuery";
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
function Investigations() {
  const { id } = useParams();
  const [date, setdate] = React.useState([]);
  const modalRef = React.useRef(null);
  const navigate = useNavigate();
  const { dispatch } = useTabCtx();

  //get all investigations
  const {
    isLoading: investigationsLoading,

    data: investigations,
  } = useCustomQuery(
    [
      GET_PATIENT_INVESTIGATION,
      id,
      {
        testStatus: "COMPLETED",
        startDate: formatDate(date[0]),
        endDate: formatDate(date[1]),
      },
    ],
    {
      url: useSanitizeQueryParams(
        `/investigation/get-patient-investigations/${id}?testStatus=COMPLETED&endDate=${formatDate(
          date[1]
        )}&startDate=${formatDate(date[0])}`
      ),
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: ({ data }) => {
        const getTestName = data.map((d) => ({
          ...d,
          testName: d.test.testName,
        }));

        const formatted = groupBy(getTestName, "testName");

        // console.log(formatted);

        return formatted;
      },
    }
  );

  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };
  const handleAddInvestigation = () => {
    dispatch(setcurrentTab(3));
    navigate(`/home/patient/treatments/${id}`);
  };
  return (
    <>
      <Paper sx={{ width: "100%", p: 2, height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            m: {
              xs: 2,
              sm: 1,
            },
            width: "100%",
          }}
        >
          <Typography variant="h6">Overview</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              sx={{
                fontSize: "12px",
                mr: 1,
                mb: {
                  xs: 2,
                  sm: 0,
                },
              }}
              color="secondary"
              onClick={toggleModal}
            >
              Add New
            </Button>
            <DateRangePicker
              values={date}
              setValues={setdate}
              placeholder="Select date range"
              position="end"
              calendarSx={{
                right: "60px",
              }}
            />
          </Stack>
        </Box>
        <Box sx={{ p: { sm: 4, xl: 1 } }}>
          {investigationsLoading ? (
            <CustomLoader />
          ) : !!investigations && Object.keys(investigations).length ? (
            <InvestigationsAccordionComponent data={investigations} />
          ) : (
            "No Data Found"
          )}
        </Box>
      </Paper>

      <CustomModal
        ref={modalRef}
        backdropSx={{
          marginTop: "0px !important",
        }}
        childrenContSx={{
          p: 0,
          width: {
            xs: "90%",
            sm: "60vw",
          },
        }}
      >
        <UploadResultModal closeModal={toggleModal} />
      </CustomModal>
    </>
  );
}

export default Investigations;
