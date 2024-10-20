import { Box, Button, Paper, Stack, Typography } from "@mui/material";

import React, { useState } from "react";

import CustomButton from "components/atoms/CustomButton";
import CustomMenu from "components/atoms/CustomMenu";

import SearchBar from "components/atoms/SearchBar";
import AddIcon from "@mui/icons-material/Add";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import Pagination from "components/molecules/pagination/Pagination";

import BackButton from "components/atoms/BackButton";
import CustomModal from "components/atoms/CustomModal";
import { useQueryClient } from "react-query";

import { useParams } from "react-router-dom";
import CustomDatePicker from "components/atoms/DatePicker";
import DepartmentsInventoryTable from "components/molecules/tabels/inventory/DepartmentsInventoryTable";
import UsageHistory from "components/molecules/inventory/modalContent/stockMgt/UsageHistory";
import RightDrawer from "./components/RightDrawer";
import CreateOrViewStockItem from "./components/CreateOrViewStockItem";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import CreateRequistionModal from "components/molecules/inventory/modalContent/requisitionModals/CreateRequistionModal";
import { GET_LAB_STOCKS, GET_RADIOLOGY_STOCKS } from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";

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
const getDeptType = (dept) => {
  let details = {};
  switch (dept) {
    case "laboratory":
      details = {
        name: "lab",
        queryUrlType: GET_LAB_STOCKS,
      };
      break;
    case "radiology":
      details = {
        name: "radiology",
        queryUrlType: GET_RADIOLOGY_STOCKS,
      };
      break;

    default:
      break;
  }
  return details;
};

function DepartmentsInventory({ total, PageSize, stockMgtData }) {
  const { department } = useParams();

  const skip = React.useRef(0);
  const modalRef = React.useRef(null);
  const requisitionModalRef = React.useRef(null);
  const [search, setsearch] = React.useState("");
  const [date, setdate] = React.useState(null);
  const [requestEndpoint, setRequestEndpoint] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [dept, setdept] = React.useState("");
  const [stockDetails, setstockDetails] = React.useState({});
  const [openStockRequest, setOpenStockRequest] = useState(false);
  const queryClient = useQueryClient();

  React.useLayoutEffect(() => {
    const dept = stockMgtData.find((depts) => depts.slug === department);
    setdept(dept?.title);
  }, [department]);

  const handlePageChange = (page) => {
    skip.current = (page - 1) * PageSize;
    //   dispatch(getMoreItems(PageSize, {}, skip.current));
    setCurrentPage(page);
  };

  const toggleModal = (details) => {
    setstockDetails(details);
    modalRef?.current?.handleToggle();
  };
  const toggleRequisitionModal = () => {
    requisitionModalRef?.current?.handleToggle();
  };

  const openDrawerHandler = () => {
    setOpenStockRequest(true);
  };

  const closeDrawerHandler = () => {
    setOpenStockRequest(false);
    // setEditStockItem(null);
  };

  // React.useEffect(() => {
  //   switch (department) {
  //     case "Laboratory":
  //       setRequestEndpoint(() => `/lab-stock`);
  //       break;
  //     default:
  //       setRequestEndpoint(() => null);
  //       break;
  //   }
  // }, [department]);

  // function getEndpoint() {
  //   let endPoint;
  //   switch (department) {
  //     case "Laboratory":
  //       endPoint = `/lab-stock`;
  //       break;
  //     default:
  //       endPoint = null;
  //       break;
  //   }
  //   return endPoint;
  // }

  //get all department stock items
  const {
    data: labStock,
    isLoading: getLabStockLoading,
    refetch: refetchRequest,
    isError,
  } = useCustomQuery(
    [
      getDeptType(department).queryUrlType,
      {
        // search,
        page: currentPage,
        limit: PageSize,
        startDate: date ? getDate(date) : null,
        // startDate: date ? getDate(date) : null,
      },
    ],
    {
      url: `/${getDeptType(department).name}-stock?startDate=${getDate(
        date
      )}&page=${currentPage}&limit=${PageSize}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //search department stock items
  const {
    isLoading: searchLabStockItemsLoading,
    isFetching: searchLabStockItemsFetching,
    refetch: refetchSearch,
  } = useCustomQuery(
    [
      getDeptType(department).queryUrlType,
      {
        page: currentPage,
        limit: PageSize,
        search,
        // startDate: date ? getDate(date) : null,

        // date: getDate(date),
      },
    ],
    {
      url: `/${getDeptType(department).name}-stock?search=${search}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        // queryClient.getQueryData()
        queryClient.setQueryData(
          [
            getDeptType(department).queryUrlType,
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

  const handleReset = () => {
    setdate(null);
    setsearch("");
    refetchRequest();
  };

  return (
    <>
      <Box>
        <Typography variant="displayLg">Stock Management</Typography>

        <Paper sx={{ p: 2 }}>
          <Stack
            direction="column"
            spacing={2}
            justifyContent="flex-start"
            alignItems={"flex-start"}
          >
            <BackButton />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
              justifyContent="space-between"
              alignItems={"center"}
            >
              <Typography variant="displaySm">{`${dept} Stock`}</Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="flex-end"
                alignItems="center"
                spacing={1}
              >
                <SearchBar
                  refetch={refetchSearch}
                  search={search}
                  setsearch={setsearch}
                  placeholder="Search item name"
                  isLoading={
                    searchLabStockItemsLoading || searchLabStockItemsFetching
                  }
                />
                <CustomDatePicker
                  placeholder="Filter by date"
                  type="date"
                  views={["year", "month", "day"]}
                  size="small"
                  datePickerSx={{ width: "100%" }}
                  lightBorder={true}
                  setdate={(date) => {
                    setdate(new Date(date));
                  }}
                  date={date}
                />
                <Button variant="text" onClick={handleReset}>
                  Reset
                </Button>

                {/* <CustomButton
                  text="Create New Item"
                  variant="containedBrown"
                  startIcon={<AddIcon />}
                /> */}
                {/* <CustomButton
                  text="Create Requisition"
                  variant="contained"
                  color="secondary"
                  onClick={toggleRequisitionModal}
                /> */}
                {/* /lab-stock */}
              </Stack>
            </Stack>
          </Stack>

          {getLabStockLoading ? (
            <CustomLoader />
          ) : isError ? (
            <Paper sx={{ p: 1 }}>
              <Typography>
                Something went wrong, refresh and try again Later
              </Typography>
            </Paper>
          ) : (
            <Paper sx={{ p: 2 }}>
              {labStock?.data?.[
                department === "laboratory" ? "labStock" : "radiologyStock"
              ]?.length ? (
                <>
                  <DepartmentsInventoryTable
                    data={
                      labStock?.data?.[
                        department === "laboratory"
                          ? "labStock"
                          : "radiologyStock"
                      ]
                    }
                    page={currentPage}
                    toggleModal={toggleModal}
                  />
                  <Box sx={{ p: { xs: 0, sm: 2 } }}>
                    <Pagination
                      currentPage={currentPage}
                      totalCount={labStock?.data?.count}
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
        </Paper>
      </Box>

      <CustomRightDrawer
        ref={requisitionModalRef}
        title={"Create Requisition"}
        subTitle={"Input information for requisition"}
      >
        <CreateRequistionModal
          closeModal={() => requisitionModalRef?.current?.handleToggle()}
        />
      </CustomRightDrawer>
    </>
  );
}

DepartmentsInventory.defaultProps = {
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
  stockMgtData: [
    {
      id: 1,
      title: "Laboratory",
      slug: "laboratory",
    },
    {
      id: 2,
      title: "Radiology",
      slug: "radiology",
    },
    {
      id: 3,
      title: "Pharmacy",
      slug: "pharmacy",
    },
    {
      id: 4,
      title: "Human Resource (HR)",
      slug: "human-resource",
    },
    {
      id: 5,
      title: "Billing",
      slug: "billing",
    },
    {
      id: 6,
      title: "Nurse Station",
      slug: "nurse-station",
    },
  ],

  PageSize: 5,
  total: 50,
};

export default DepartmentsInventory;
