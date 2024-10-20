import { MoreVertOutlined } from "@mui/icons-material";
import {
  Box,
  Grid,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomLoader from "components/atoms/CustomLoader";
import CustomDatePicker from "components/atoms/DatePicker";
import SearchBar from "components/atoms/SearchBar";
import SimpleTable from "components/atoms/SimpleTable";
import CleanHandsIcon from "@mui/icons-material/CleanHands";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import Pagination from "components/molecules/pagination/Pagination";
import PharmacyTable from "components/molecules/tabels/pharmacy/PharmacyTable";
import { useQueryClient } from "react-query";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_ALL_DISPENSED_REQUEST,
  GET_ALL_REQUEST,
  GET_ALL_REQUEST_LIST,
  GET_DISPENSED_LIST,
  GET_EXPIRED_DRUGS,
  GET_PENDING_REQUEST,
} from "utils/reactQueryKeys";
import Header from "../components/Header";
import RightDrawer from "../components/RightDrawer";
import StatisticsCard from "../components/StatisticsCard";
import CreateDrugOrder from "./CreateDrugOrder";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import AddBatchToProduct from "../stockManagement/modalContent/AddBatchToProduct";
let PageSize = 10;

function PharmacyOverviewHome() {
  const modalRef = React.useRef(null);

  const [date, setdate] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setsearch] = React.useState("");
  const [checkBoxItems, setcheckBoxItems] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);

  const queryClient = useQueryClient();

  const handlePageChange = (page) => {
    // skip.current = (page - 1) * PageSize;
    //   dispatch(getMoreItems(PageSize, {}, skip.current));

    setCurrentPage(page);
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

  //get all request
  const {
    data: allRequest,
    isLoading: getAllRequestLoading,
    refetch: refetchRequest,
    isError,
  } = useCustomQuery(
    [
      GET_ALL_REQUEST,
      {
        page: currentPage,
        limit: PageSize,
        startDate: date ? getDate(date) : null,
      },
    ],
    {
      url: `/prescription/all`,
      method: "post",
      data: {
        page: currentPage,
        search: "",
        limit: PageSize,
        startDate: date ? getDate(date) : null,
      },
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //search all request
  const {
    isLoading: searchAllRequestLoading,
    isFetching: searchAllRequestFetching,
    refetch: refetchSearch,
  } = useCustomQuery(
    [
      [GET_ALL_REQUEST],
      {
        page: currentPage,
        search,
        limit: PageSize,
        // startDate: date ? getDate(date) : null,
      },
    ],
    {
      url: `/prescription/all`,
      method: "post",
      data: {
        page: currentPage,
        search,
        limit: PageSize,
        // startDate: date ? getDate(date) : null,
      },
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        // queryClient.getQueryData()
        queryClient.setQueryData(
          [
            GET_ALL_REQUEST,
            {
              page: currentPage,
              // search,
              limit: PageSize,
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

  //get all pending request
  // const {
  //   data: allPendingRequest,
  //   isLoading: getPendingRequestLoading,
  //   refetch: refetchAllRequest,
  //   isError: isPendingRequestError,
  // } = useCustomQuery(
  //   [GET_PENDING_REQUEST, {}],
  //   {
  //     url: `/prescription/all`,
  //     method: "post",
  //     data: {
  //       // search: "",
  //     },
  //   },
  //   {
  //     refetchOnWindowFocus: false,
  //     keepPreviousData: true,
  //     select: (res) => {
  //       const data = res?.data?.prescriptions.filter((t) => {
  //         return t.status === "PENDING";
  //       });
  //       return data;
  //     },
  //   }
  // );
  //get all DISPENSED request
  const {
    data: allDispensedRequest,
    isLoading: getDispensedRequestLoading,
    refetch: refetchDispensedRequest,
    isError: isDispensedRequestError,
  } = useCustomQuery(
    [GET_DISPENSED_LIST, {}],
    {
      url: `/product/get-dispensed-list`,
      method: "post",
      data: {
        // search: "",
      },
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //get expired drugs list
  const {
    data: expiredDrugsList,
    isLoading: getExpiredDrugsLoading,
    refetch: refetchExpiredDrugsRequest,
    isError: expiredDrugsFetchError,
  } = useCustomQuery(
    [
      GET_EXPIRED_DRUGS,
      {
        page: currentPage,
        limit: PageSize,
        startDate: date ? getDate(date) : null,
      },
    ],
    {
      url: `/product/get-expiry`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  const statisticsMap = [
    {
      title: "Pending Request",
      value: allRequest?.data?.count,
      bgColor: "rgba(219, 30, 54, 0.1)",
      hasDetails: false,
      icon: <EventRepeatIcon />,
    },
    {
      title: "Dispensed Request",
      value: allDispensedRequest?.data?.count,
      bgColor: "rgba(255, 129, 96, 0.1)",
      hasDetails: true,
      url: "/home/pharmacy/dashboard/dispensed-request",
      icon: <CleanHandsIcon />,
    },
    {
      title: "Expired Drug",
      value: expiredDrugsList?.data?.batches?.length,
      bgColor: "rgba(2, 0, 17, 0.1)",
      hasDetails: true,
      url: "/home/pharmacy/dashboard/expired-drugs",
      icon: <VaccinesIcon />,
    },
  ];

  const handleReset = () => {
    setsearch("");
    setdate(null);
    refetchRequest();
  };
  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };

  return (
    <>
      <Stack
        direction={{ xs: "column" }}
        sx={{
          gap: 2,
        }}
      >
        <Header title="Overview" />

        <Statistics data={statisticsMap} />
        <Paper sx={{ p: 2, mt: 0 }}>
          <Stack
            sx={{ px: 4, py: 2 }}
            direction={{ xs: "column", sm: "row" }}
            justifyContent={{ xs: "center", sm: "space-between" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          >
            <Typography variant="displayMd" sx={{}}>
              Pending Request
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent={{ xs: "center", sm: "space-between" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
            >
              <SearchBar
                refetch={refetchSearch}
                search={search}
                setsearch={setsearch}
                placeholder="Search Patient/Request ID"
                isLoading={searchAllRequestFetching || searchAllRequestLoading}
              />
              <CustomDatePicker
                placeholder="filter by date"
                type="date"
                views={["year", "month", "day"]}
                size="small"
                lightBorder={true}
                // disableFuture={false}
                setdate={(date) => {
                  setdate(new Date(date));
                }}
                date={date}
              />

              <Button variant="text" onClick={handleReset}>
                Reset
              </Button>

              <CustomButton
                text={"Create New Request"}
                variant="contained"
                color="secondary"
                onClick={toggleModal}
              />
            </Stack>
          </Stack>
        </Paper>

        {getAllRequestLoading ? (
          <CustomLoader />
        ) : isError ? (
          <Paper sx={{ p: 1 }}>
            <Typography>
              Something went wrong, refresh and try again Later
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 2 }}>
            {allRequest?.data?.prescriptions?.length ? (
              <>
                <PharmacyTable
                  showOrderForm={showModal}
                  setShowOrderForm={setShowModal}
                  refetch={refetchRequest}
                  refetchDispense={refetchDispensedRequest}
                  page={currentPage}
                  data={allRequest?.data?.prescriptions}
                  checkBoxItems={checkBoxItems}
                  setcheckBoxItems={setcheckBoxItems}
                />
                <Box sx={{ p: { xs: 0, sm: 2 } }}>
                  <Pagination
                    currentPage={currentPage}
                    totalCount={allRequest?.data?.count}
                    pageSize={PageSize}
                    onPageChange={handlePageChange}
                  />
                </Box>
              </>
            ) : (
              <Typography>No item to display</Typography>
            )}
          </Paper>
        )}
      </Stack>
      <CustomRightDrawer ref={modalRef}>
        <CreateDrugOrder closeModal={toggleModal} />
      </CustomRightDrawer>
    </>
  );
}

const Statistics = ({ data }) => {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      {!!data.length &&
        data.map((stat) => (
          <StatisticsCard
            key={stat.title}
            title={stat.title}
            url={stat.url}
            value={stat.value || 0}
            hasDetails={stat.hasDetails}
            icnBgSx={{
              backgroundColor: stat.bgColor,
            }}
            icon={stat.icon}
          />
        ))}
    </Stack>
  );
};

export default PharmacyOverviewHome;
