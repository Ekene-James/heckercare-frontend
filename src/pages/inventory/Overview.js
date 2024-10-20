import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import DashboardCard from "components/molecules/dashboardCard/DashboardCard";
import React from "react";

import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CustomButton from "components/atoms/CustomButton";

import WidgetsIcon from "@mui/icons-material/Widgets";

import SearchBar from "components/atoms/SearchBar";
import PrintIcon from "@mui/icons-material/Print";

import Pagination from "components/molecules/pagination/Pagination";

import { v4 as uuidv4 } from "uuid";
import CustomModal from "components/atoms/CustomModal";

import OverviewModalContainer from "components/molecules/inventory/modalContent/overview/OverviewModalContainer";
import {
  GET_ALL_DEPARTMENT_INVENTORY,
  GET_INVENTORY_OVERVIEW_DATA,
  GET_REQUEST_HISTORY,
  RADIOLOGY_STOCK_HISTORY,
} from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import InventoryOverviewExpiringTable from "components/molecules/tabels/inventory/InventoryOverviewExpiringTable";
import InventoryOverviewLowStockTable from "components/molecules/tabels/inventory/InventoryOverviewLowStockTable";
import { useQueryClient } from "react-query";
import CustomLoader from "components/atoms/CustomLoader";
import InventoryOverviewRequestHistoryTable from "components/molecules/tabels/inventory/InventoryOverviewRequestHistoryTable";
import { exportToExcel } from "utils/exportToExcel";

const formatExportData = (data) => {
  return data.map((d) => {
    let items = {};
    if (d?.items?.length) {
      for (let idx = 0; idx < d?.items?.length; idx++) {
        const element = d?.items[idx];
        items[`item_${idx + 1}_name`] = element?.item?.itemName;
        items[`item_${idx + 1}_quantity`] = element?.quantity;
        items[`item_${idx + 1}_batchId`] = element?.batchId;
      }
    }
    const formattedData = {
      ...d,
      ...items,
      requesterFirstname: d?.createdBy?.firstName,
      requesterLastName: d?.createdBy?.lastName,

      createdBy: d?.createdBy?.fullName,
    };
    delete formattedData.items;
    delete formattedData.id;
    return formattedData;
  });
};

function OverviewDashboard({ total, PageSize }) {
  const skip = React.useRef(0);
  const modalRef = React.useRef(null);
  const [search, setsearch] = React.useState("");
  const [checkBoxItems, setcheckBoxItems] = React.useState([]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [modalView, setmodalView] = React.useState(0);
  const [requestDetails, setrequestDetails] = React.useState({});
  const queryClient = useQueryClient();

  const handlePageChange = (page) => {
    // skip.current = (page - 1) * PageSize;
    //   dispatch(getMoreItems(PageSize, {}, skip.current));

    setCurrentPage(page);
  };

  //handle export
  const handleExport = (item) => {
    exportToExcel(
      formatExportData(checkBoxItems),
      "hms_inventory_request_history"
    );
  };

  const toggleModal = (view, details) => {
    setmodalView(view);
    if (view === 1) setrequestDetails(details);
    modalRef?.current?.handleToggle();
  };

  //get inventory overview data
  const {
    data: inventoryOverviewData,
    isLoading: getInventoryOverviewDataLoading,
    refetch: refetchInventoryOverviewData,
    isError: isInventoryOverviewDataError,
  } = useCustomQuery(
    [
      GET_INVENTORY_OVERVIEW_DATA,
      {
        page: currentPage,
        limit: PageSize,
      },
    ],
    {
      url: `/inventory/get-inventory`,
      method: "post",
      data: {
        search: "",
        limit: PageSize,
      },
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //get all lab request history
  const {
    data: requestHistory,
    isLoading: getRequestHistoryLoading,
    refetch: refetchRequestHistory,
    isError: isRequestHistoryError,
  } = useCustomQuery(
    [
      GET_REQUEST_HISTORY,
      {
        limit: 10,
        page: currentPage,
      },
    ],
    {
      url: `/lab-stock/order-history`,
      method: "post",
      data: {
        limit: 10,
        page: currentPage,
      },
    },
    {
      select: (res) => {
        const withUid = {
          ...res,
          data: {
            ...res.data,
            orders: res.data.orders.map((d) => {
              return {
                ...d,
                items: d.items.map((item) => ({
                  ...item,
                  uid: uuidv4(),
                })),
              };
            }),
          },
        };

        return withUid;
      },
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  const {
    data: radHistory,
    isLoading: radHistoryLoading,
    isError: radHistoryErr,
  } = useCustomQuery(
    [
      RADIOLOGY_STOCK_HISTORY,
      {
        limit: 10,
        page: currentPage,
      },
    ],
    {
      url: `/radiology-stock/order-history`,
      method: "post",
      data: {
        limit: 10,
        page: currentPage,
      },
    },
    {
      select: (res) => {
        const withUid = {
          ...res,
          data: {
            ...res.data,
            orders: res.data.orders.map((d) => {
              return {
                ...d,
                items: d.items.map((item) => ({
                  ...item,
                  uid: uuidv4(),
                })),
              };
            }),
          },
        };

        return withUid;
      },
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  // //search all inventory items
  // const {
  //   isLoading: searchRequestHistoryLoading,
  //   isFetching: searchRequestHistoryFetching,
  //   refetch: refetchSearch,
  // } = useCustomQuery(
  //   [
  //     GET_REQUEST_HISTORY,
  //     {
  //       page: currentPage,
  //       search,
  //     },
  //   ],
  //   {
  //     url: `/lab-stock/order-history`,
  //     method: "post",
  //     data: {
  //       page: currentPage,
  //       search,
  //     },
  //   },
  //   {
  //     refetchOnWindowFocus: false,
  //     onSuccess: (response) => {
  //       // queryClient.getQueryData()
  //       queryClient.setQueryData(
  //         [
  //           GET_REQUEST_HISTORY,
  //           {
  //             limit: 10,
  //             page: currentPage,
  //           },
  //         ],
  //         (oldQueryData) => {
  //           return {
  //             ...response,
  //           };
  //         }
  //       );
  //     },
  //     enabled: false,
  //   }
  // );

  let reqHistoryTableData = {
    data: [],
    count: 0,
  };
  if (
    !radHistoryLoading &&
    !getRequestHistoryLoading &&
    !radHistoryErr &&
    !isRequestHistoryError
  ) {
    reqHistoryTableData = {
      count: +requestHistory?.data?.count + +radHistory?.data?.count,
      data: [...requestHistory?.data?.orders, ...radHistory?.data?.orders],
    };
  }

  return (
    <Box>
      <Typography variant="displayLg">Inventory</Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} lg={4}>
          <DashboardCard
            // url="/home/inventory-cost"
            smallTxt="COST OF INVENTORY"
            bigTxt={
              inventoryOverviewData?.data?.totalCostOfRequesitions[0]?.totalCost
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") || 0
            }
            icnBgSx={{
              backgroundColor: "rgba(43, 145, 191, 0.1)",
              borderRadius: "50%",
            }}
            icon={
              <MonetizationOnIcon sx={{ color: "#2B91BF", fontSize: "30px" }} />
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <DashboardCard
            url="/home/inventory-items"
            icnBgSx={{
              backgroundColor: "rgba(0, 132, 53, 0.1)",
              borderRadius: "50%",
            }}
            smallTxt="number of items"
            bigTxt={`${inventoryOverviewData?.data?.itemCount || 0}`}
            icon={
              <WidgetsIcon
                sx={{ color: "rgba(0, 132, 53, 1)", fontSize: "30px" }}
              />
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <DashboardCard
            url=""
            icnBgSx={{
              backgroundColor: "rgba(0, 132, 53, 0.1)",
              borderRadius: "50%",
            }}
            smallTxt="Requisitions"
            bigTxt={inventoryOverviewData?.data?.totalRequesitions || 0}
            icon={
              <WidgetsIcon
                sx={{ color: "rgba(0, 132, 53, 1)", fontSize: "30px" }}
              />
            }
          />
        </Grid>

        {/* Request History Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="column" spacing={2}>
              <Stack
                direction={{ xs: "column", lg: "row" }}
                spacing={2}
                sx={{ width: "100%" }}
                justifyContent="space-between"
              >
                <Stack
                  direction="column"
                  justifyContent="start"
                  alignItems="start"
                  spacing={1}
                >
                  <Typography variant="displaySm">Request History</Typography>
                  <Typography>List of all inventory request</Typography>
                </Stack>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="start"
                  alignItems="start"
                  spacing={1}
                >
                  {/* <SearchBar
                    refetch={refetchSearch}
                    search={search}
                    setsearch={setsearch}
                    placeholder="Search by requester"
                    isLoading={
                      searchRequestHistoryLoading ||
                      searchRequestHistoryFetching
                    }
                  /> */}
                  <CustomButton
                    text="Export"
                    startIcon={<PrintIcon />}
                    onClick={handleExport}
                    variant="outlined"
                    disabled={!checkBoxItems.length}
                  />
                </Stack>
              </Stack>
              {getRequestHistoryLoading || radHistoryLoading ? (
                <CustomLoader />
              ) : isRequestHistoryError || radHistoryErr ? (
                <Paper sx={{ p: 1 }}>
                  <Typography>
                    Something went wrong, refresh and try again Later
                  </Typography>
                </Paper>
              ) : (
                <Paper sx={{ p: 2 }}>
                  {requestHistory?.data?.orders?.length ? (
                    <>
                      <InventoryOverviewRequestHistoryTable
                        // refetch={refetchSearch}
                        data={reqHistoryTableData.data}
                        page={currentPage}
                        toggleModal={toggleModal}
                        checkBoxItems={checkBoxItems}
                        setcheckBoxItems={setcheckBoxItems}
                      />
                      <Box sx={{ p: { xs: 0, sm: 2 } }}>
                        <Pagination
                          currentPage={currentPage}
                          totalCount={reqHistoryTableData.count}
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
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <DashboardCard
            smallTxt="Vendors"
            bigTxt={inventoryOverviewData?.data?.totalVendors || 0}
            icnBgSx={{
              backgroundColor: "rgba(43, 145, 191, 0.1)",
              borderRadius: "0%",
            }}
            // icon={
            //   <MonetizationOnIcon sx={{ color: "#2B91BF", fontSize: "30px" }} />
            // }
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <DashboardCard
            icnBgSx={{
              backgroundColor: "rgba(0, 132, 53, 0.1)",
              borderRadius: "0%",
            }}
            smallTxt="Stock Requests"
            bigTxt={`${reqHistoryTableData.count || 0}`}
            // bigTxt={`${
            //   inventoryOverviewData?.data?.totalRequesitionsCount || 0
            // }`}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <DashboardCard
            icnBgSx={{
              backgroundColor: "rgba(0, 132, 53, 0.1)",
              borderRadius: "0%",
            }}
            smallTxt="Expiring products"
            bigTxt={inventoryOverviewData?.data?.expiringItems?.count || 0}
            // icon={
            //   <WidgetsIcon
            //     sx={{ color: "rgba(0, 132, 53, 1)", fontSize: "30px" }}
            //   />
            // }
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={6}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="column" spacing={2}>
              <Stack
                direction={{ xs: "column", lg: "row" }}
                spacing={2}
                sx={{ width: "100%" }}
                justifyContent="space-between"
              >
                <Stack
                  direction="column"
                  justifyContent="start"
                  alignItems="start"
                  spacing={1}
                >
                  <Typography variant="displaySm">Expiring Products</Typography>
                  <Typography>Top 3 items by Expiration date</Typography>
                </Stack>
              </Stack>
              <InventoryOverviewExpiringTable
                data={inventoryOverviewData?.data?.expiringItems?.batches}
                toggleModal={toggleModal}
              />
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} lg={6}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="column" spacing={2}>
              <Stack
                direction={{ xs: "column", lg: "row" }}
                spacing={2}
                sx={{ width: "100%" }}
                justifyContent="space-between"
              >
                <Stack
                  direction="column"
                  justifyContent="start"
                  alignItems="start"
                  spacing={1}
                >
                  <Typography variant="displaySm">Low in Stock</Typography>
                  <Typography>Top 3 items by low stock</Typography>
                </Stack>
              </Stack>
              <InventoryOverviewLowStockTable
                data={inventoryOverviewData?.data?.lowInStockItems?.batches}
                toggleModal={toggleModal}
              />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          width: {
            xs: "95%",
            sm: "80%",
          },
        }}
        ariaLabel="inventory-overview-modal"
      >
        <OverviewModalContainer
          modalView={modalView}
          requestDetails={requestDetails}
        />
        ;
      </CustomModal>
    </Box>
  );
}

OverviewDashboard.defaultProps = {
  pieData1: [
    {
      name: "Total Admitted Patient",
      fill: "#2F80ED",
      value: 1000,
    },
    {
      name: "Discharged  Patient",
      fill: "#EEA339",
      value: 200,
    },
  ],
  pieData: [
    {
      name: "Number of Occupied Beds",
      fill: "#092C4C",
      value: 1000,
    },
    {
      name: "Number of Unoccupied Beds",
      fill: "#457EE8",
      value: 200,
    },
  ],

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
  lineData: [
    {
      name: "Monday",
      "Number of Patients": 3500,
    },
    {
      name: "Tuesday",
      "Number of Patients": 3000,
    },
    {
      name: "Wednesday",
      "Number of Patients": 2000,
    },
    {
      name: "Thursday",
      "Number of Patients": 2780,
    },
    {
      name: "Friday",
      "Number of Patients": 1890,
    },
    {
      name: "Saturday",
      "Number of Patients": 2390,
    },
    {
      name: "Sunday",
      "Number of Patients": 3490,
    },
  ],
  PageSize: 3,
  total: 50,
};

export default OverviewDashboard;
