import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import BackButton from "components/atoms/BackButton";
import CustomButton from "components/atoms/CustomButton";
import TextWithMenu from "components/molecules/lab/TextWithMenu";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React from "react";
import CustomDatePicker from "components/atoms/DatePicker";
import SearchBar from "components/atoms/SearchBar";
import CustomMenu from "components/atoms/CustomMenu";
import TestType from "components/molecules/lab/TestType";
import TestDescription from "components/molecules/lab/TestDescription";
import CustomModal from "components/atoms/CustomModal";
import TestCenterModalView from "components/molecules/lab/modalContents/TestCenterModalView";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_TEST_INFO, GET_TEST_LIST } from "utils/reactQueryKeys";
import DateRangePicker from "components/atoms/dateRangePicker/DateRangePicker";
import { useQueryClient } from "react-query";
import { groupBy } from "utils/groupByFunc";
import CustomLoader from "components/atoms/CustomLoader";

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
const now = new Date();
function TestCenter({ dropDownContent, testDesc }) {
  const queryClient = useQueryClient();
  const modalRef = React.useRef(null);
  const [modalType, setmodalType] = React.useState(0);
  const [modalData, setModalData] = React.useState({});
  const [search, setsearch] = React.useState("");

  const [dates, setdates] = React.useState([]);
  // const [tests, settests] = React.useState([
  //   "Basic Metabolic Panel",
  //   "Blood Glucose Test",
  //   "Pregnancy Test",
  //   "HIV Test",
  //   "Kidney/Liver Test",
  // ]);

  //get all test
  const {
    isLoading: getAllTestLoading,

    data: tests,
    refetch: refetchTests,
  } = useCustomQuery(
    [GET_TEST_LIST],
    {
      url: `/test`,
      method: "get",

      avoidCancelling: true,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //get all test info
  const {
    isLoading: getTestInfoLoading,

    data: testInfo,
  } = useCustomQuery(
    [
      GET_TEST_INFO,
      {
        startDate: formatDate(dates[0]),
        endDate: formatDate(dates[1]),
        limit: 100,
      },
    ],
    {
      url: `/laboratory/test-center`,
      method: "post",
      avoidCancelling: true,
      data: {
        startDate: formatDate(dates[0]),
        endDate: formatDate(dates[1]),
        limit: 100,
      },
    },
    {
      refetchOnWindowFocus: false,
      select: (res) => {
        const data = res.data.investigations;
        const withTestName = [];
        for (let idx = 0; idx < data?.length; idx++) {
          const test = data[idx];
          if (test?.test)
            withTestName.push({
              ...test,
              testName: test?.test?.testName,
            });
        }
        // const withTestNames = data.map((test) => ({
        //   ...test,
        //   testName: test?.test?.testName,
        // }));
        const groupByTestName = groupBy(withTestName, "testName");

        return groupByTestName;
      },
    }
  );

  //search for test info
  const {
    isLoading: searchTestInfoLoading,

    refetch: refetchTestInfo,
  } = useCustomQuery(
    [GET_TEST_INFO, search],
    {
      url: `/laboratory/test-center`,
      method: "post",
      data: { search },
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [
            GET_TEST_INFO,
            {
              startDate: formatDate(dates[0]),
              endDate: formatDate(dates[1]),
              limit: 100,
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

  const openModal = (type, data) => {
    setModalData(data);

    setmodalType(type);
    modalRef?.current?.handleToggle();
  };

  return (
    <Box>
      <Stack direction={"column"} spacing={2}>
        <Stack
          direction={"row"}
          spacing={2}
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Stack
            direction={"row"}
            spacing={2}
            justifyContent="center"
            alignItems={"center"}
          >
            <BackButton showText={false} />
            <Typography variant="displayMd">Test Center</Typography>
          </Stack>
          <CustomButton
            text={"Start New Test"}
            variant="contained"
            color="secondary"
            onClick={openModal.bind(this, 3)}
          />
        </Stack>
        <Paper sx={{ p: 2 }}>
          <Typography>
            Current List of Tests performed at this Hospital
          </Typography>

          <Grid container spacing={1} sx={{ mt: 1, width: "100%" }}>
            {tests?.data?.map((test) => (
              <Grid key={test?._id} item xs={6} sm={4} lg={3}>
                <TextWithMenu text={test?.testName} />
              </Grid>
            ))}
            <Grid item xs={6} sm={5} lg={3}>
              <CustomButton
                text={"Create New Test"}
                variant="outlined"
                startIcon={<AddCircleIcon />}
                sx={{
                  width: "100%",
                  pb: 1.0,
                  pt: 1.0,
                  border: "0.5px solid rgba(0,0,0,0.2)!important",
                  borderRadius: "2px",
                  color: "black",
                }}
                onClick={openModal.bind(this, 0)}
              />
            </Grid>
          </Grid>
        </Paper>
        <Paper
          sx={{ p: 2, overflowX: "hidden", width: "100%", minHeight: "70vh" }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={{ xs: "center", sm: "flex-end" }}
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
              refetch={refetchTestInfo}
              isLoading={searchTestInfoLoading}
              placeholder="Search Patients Name"
            />
          </Stack>

          <Stack
            direction={"row"}
            spacing={1}
            sx={{
              mt: 1,
              width: "100%",
              height: "100vh",
              backgroundColor: "background.custom",
              p: 2,
              justifyContent: "flex-start",
              overflow: "auto",
            }}
          >
            {getTestInfoLoading ? (
              <CustomLoader />
            ) : Object.keys(testInfo || {})?.length ? (
              Object.keys(testInfo)?.map((testKey) => (
                <Stack
                  direction={"column"}
                  sx={{ minWidth: "350px" }}
                  spacing={1}
                  mb={2}
                  key={testKey}
                >
                  <TestType
                    header={testKey}
                    desc={testInfo[testKey][0]["test"]["testType"]}
                    count={testInfo[testKey].length}
                  />
                  {testInfo[testKey].map((item, i) => (
                    <TestDescription
                      key={item._id}
                      item={item}
                      handleOpenModal={openModal}
                    />
                  ))}
                </Stack>
              ))
            ) : (
              "No Data Found"
            )}
          </Stack>
        </Paper>
      </Stack>
      <CustomModal
        ref={modalRef}
        cleanUp={() => setmodalType(null)}
        childrenContSx={{
          p: 3,
          width: {
            xs: "90%",
            sm: "65vw",
          },
        }}
        ariaLabel={"test-center-modal"}
      >
        <TestCenterModalView
          handleClose={() => {
            modalRef?.current?.handleToggle();
            setmodalType(null);
          }}
          modalData={modalData}
          view={modalType}
          refetchTests={refetchTests}
        />
      </CustomModal>
    </Box>
  );
}

TestCenter.defaultProps = {
  dropDownContent: [
    {
      name: "Daily",
      value: "Day",
    },
    {
      name: "This Week",
      value: "Week",
    },
    {
      name: "Monthly",
      value: "Month",
    },
  ],
  testDesc: [
    {
      name: "Jonathan  Adedolapo",
      age: "52",
      gender: "F",
      date: "02.02.2022",
      id: "ID-234675894039",
      btnType: "success",
    },
    {
      name: "Jonathan  Adedolapo",
      age: "52",
      gender: "M",
      date: "02.02.2022",
      id: "ID-234675894039",
      btnType: "lightSuccess",
    },
    {
      name: "Jonathan  Adedolapo",
      age: "52",
      gender: "F",
      date: "02.02.2022",
      id: "ID-234675894039",
      btnType: "other",
    },
  ],
};

export default TestCenter;
