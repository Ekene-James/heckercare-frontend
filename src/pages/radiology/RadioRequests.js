import { Box, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import BackButton from "components/atoms/BackButton";

import CustomLoader from "components/atoms/CustomLoader";

import CustomModal from "components/atoms/CustomModal";

import StartTestModal from "components/molecules/radio/modalContents/StartTestModal";
import Pagination from "components/molecules/pagination/Pagination";
import AllLabRequestTable from "components/molecules/tabels/radio/AllLabRequestTable";

import React from "react";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_LAB_UPCOMING_INVESTIGATIONS } from "utils/reactQueryKeys";
import { CountDisplay } from "./RadioOverview";
import DateRangePicker from "components/atoms/dateRangePicker/DateRangePicker";

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
const pageSize = 10;

function LabRequests(props) {
  const { PageSize } = props;

  const modalRef = React.useRef(null);
  // const [dateRange, setdateRange] = React.useState(daysOfThWeek());
  const [dates, setdates] = React.useState([]);

  const [currentPage, setCurrentPage] = React.useState(1);

  //get lab upcoming investigations
  const { data: upcomingReqData, isLoading: upcomingReqLoading } =
    useCustomQuery(
      [
        GET_LAB_UPCOMING_INVESTIGATIONS,
        {
          startDate: formatDate(dates[0]),
          endDate: formatDate(dates[1]),
          page: currentPage,
          limit: 10,
          departmentType: "RADIOLOGY",
        },
      ],
      {
        url: `/laboratory/upcoming-investigations`,
        method: "post",
        avoidCancelling: true,
        data: {
          limit: pageSize,
          startDate: formatDate(dates[0]),
          endDate: formatDate(dates[1]),
          page: currentPage,
          departmentType: "RADIOLOGY",
        },
      },
      {
        refetchOnWindowFocus: false,
        // enabled: !!dateRange?.length,
      }
    );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };
  const handleStartTest = () => {
    modalRef?.current?.handleToggle();
  };

  return (
    <Box>
      <Stack direction={"row"} spacing={1} alignItems={"center"}>
        <BackButton showText={false} />
        <Typography variant="displayLg">Upcoming Request</Typography>
      </Stack>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack direction={"column"} spacing={1} sx={{ width: "100%" }}>
          <Stack
            direction={"row"}
            spacing={1}
            alignItems={"center"}
            justifyContent={"space-between"}
            sx={{ width: "100%" }}
          >
            <Stack
              direction={"row"}
              spacing={1}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <CountDisplay
                item={{
                  desc: "All Request",
                  number: upcomingReqData?.data?.count,
                }}
              />
            </Stack>
            <DateRangePicker
              values={dates}
              setValues={setdates}
              placeholder="Select date range"
              calendarSx={{
                left: -250,
              }}
            />
          </Stack>
          {upcomingReqLoading ? (
            <CustomLoader />
          ) : upcomingReqData?.data?.filteredInvestigations?.length ? (
            <>
              <AllLabRequestTable
                toggleModal={handleStartTest}
                data={upcomingReqData?.data?.filteredInvestigations}
              />
              <Box sx={{ mt: 2, width: "100%" }}>
                <Pagination
                  currentPage={currentPage}
                  totalCount={upcomingReqData?.data?.count || 5}
                  pageSize={PageSize}
                  onPageChange={handlePageChange}
                />
              </Box>
            </>
          ) : (
            "No data to display"
          )}
        </Stack>
      </Paper>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          width: {
            xs: "90%",
            sm: "50%",
          },
        }}
      >
        <StartTestModal handleClose={toggleModal} />
      </CustomModal>
    </Box>
  );
}

LabRequests.defaultProps = {
  dropDownContent: [
    {
      name: "Today",
      value: "Day",
    },
    {
      name: "This Week",
      value: "Week",
    },
    {
      name: "This Month",
      value: "Month",
    },
  ],
  PageSize: 10,
};
export default React.memo(LabRequests);
