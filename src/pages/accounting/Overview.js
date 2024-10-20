import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import DashboardCard from "components/molecules/dashboardCard/DashboardCard";
import React from "react";
import CustomButton from "components/atoms/CustomButton";
import CustomMenu from "components/atoms/CustomMenu";
import SearchBar from "components/atoms/SearchBar";
import PrintIcon from "@mui/icons-material/Print";
import ApartmentIcon from "@mui/icons-material/Apartment";
import Pagination from "components/molecules/pagination/Pagination";
import { useQueryClient } from "react-query";
import { exportToExcel } from "utils/exportToExcel";
import CsvDownloader from "react-csv-downloader";
import CustomModal from "components/atoms/CustomModal";
import {
  GET_ACCOUNTING_DETAILS,
  GET_ALL_PAID_TRANSACTIONS,
  GET_ALL_PENDING_TRANSACTIONS,
} from "utils/reactQueryKeys";

import OverviewModalContainer from "components/molecules/inventory/modalContent/overview/OverviewModalContainer";
import OverviewTable from "components/molecules/tabels/accounting/AllTransOverviewTable";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
import moment from "moment";
import { ShoppingCartCheckout } from "@mui/icons-material";
import {
  PaperDocIcon,
  PendingIcon,
  WalletIcon,
} from "components/Assets/generated";
import { numberFormatter } from "utils/numberFormatter";
import HMOOverviewTable from "components/molecules/tabels/accounting/HMOOverviewTable";
import OthersOverviewTable from "components/molecules/tabels/accounting/OthersOverviewTable";
import TransactionHistoryTable from "components/molecules/tabels/inventory/TransactionHistoryTable";
import AccountingTransactionHistoryTable from "components/molecules/tabels/accounting/TransactionHistory";

let PageSize = 10;

const columns = [
  {
    id: "uniqueCode",
    displayName: "requestId",
  },
  {
    id: "patientsName",
    displayName: "PatientsName",
  },
  {
    id: "drugName",
    displayName: "serviceOrder",
  },
  {
    id: "status",
    displayName: "status",
  },
  {
    id: "price",
    displayName: "Price",
  },
  {
    id: "department",
    displayName: "department",
  },
  {
    id: "createdAt",
    displayName: "DateTime",
  },
  {
    id: "doctor",
    displayName: "Attendant",
  },
  {
    id: "patient",
  },
];

const transactionTypeOptions = [
  {
    name: "HMO",
    value: "HMO",
  },
  {
    name: "CASH",
    value: "CASH",
  },
  {
    name: "CARD",
    value: "CARD",
  },
];
const statusOptions = [
  {
    name: "Approved",
    value: "APPROVED",
  },
  {
    name: "Pending",
    value: "PENDING",
  },
  {
    name: "Paid",
    value: "PAID",
  },
  {
    name: "Declined",
    value: "DECLINED",
  },
  {
    name: "Processing",
    value: "PROCESSING",
  },
];

const formatExportData = (data) => {
  if (data?.length) {
    return data?.map((d) => {
      const formartedData = {
        totalCost: d?.totalCost,
        PatientsName: `${d?.patient?.firstName} ${d?.patient?.lastName}`,
        PatientID: `${d?.patient?.ID}`,
        PatientPhone: `${d?.patient?.phoneNumber}`,
      };
      return formartedData;
    });
  }
  return [];
};
const formatExportData1 = (data) => {
  if (data?.length) {
    const result = data?.map((d) => {
      const formartedData = {
        ...d,
        PatientsName: `${d?.patient?.firstName} ${d?.patient?.lastName}`,
        PatientID: `${d?.patient?.ID}`,
        PatientPhone: `${d?.patient?.phoneNumber}`,
      };
      delete formartedData.patient;
      delete formartedData.id;
      delete formartedData.itemToPayFor;
      delete formartedData.model;
      return formartedData;
    });

    return result;
  }
  return [];
};

function AccountingOverview() {
  // const [checkBoxItems, setcheckBoxItems] = React.useState([]);
  const [search, setsearch] = React.useState("");
  const [transactionType, settransactionType] = React.useState({});
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentPage1, setCurrentPage1] = React.useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handlePageChange1 = (page) => {
    setCurrentPage1(page);
  };

  //handle export
  const handleExport = () => {
    exportToExcel(
      formatExportData(allTransactions?.data?.patientPayments),
      "hms_patients_pending_payments"
    );
  };
  //handle export
  const handleExport1 = () => {
    exportToExcel(
      formatExportData1(paidTransactions?.data?.payments),
      "hms_patients_transaction_history"
    );
  };

  //get pending transactions
  const {
    data: allTransactions,
    isLoading: getAllTransactionsLoading,

    isError,
  } = useCustomQuery(
    [
      GET_ALL_PENDING_TRANSACTIONS,
      {
        page: currentPage,
        limit: PageSize,
      },
    ],
    {
      url: `/payment/accounting-overview`,
      method: "post",
      data: {
        page: currentPage,
        limit: PageSize,
      },
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //search transactions
  const {
    isLoading: searchTransactionsLoading,
    isFetching: searchTransactionFetching,
    refetch: refetchTransactionSearch,
  } = useCustomQuery(
    [
      [GET_ALL_PENDING_TRANSACTIONS],
      {
        search,
      },
    ],
    {
      url: `/payment/accounting-overview`,
      method: "post",
      data: {
        search,
      },
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [
            GET_ALL_PENDING_TRANSACTIONS,
            {
              page: currentPage,
              limit: PageSize,
            },
          ],
          (oldQueryData) => {
            return response;
          }
        );
      },
      enabled: false,
    }
  );

  //get paid transactions
  const {
    data: paidTransactions,
    isLoading: getpaidTransactionsLoading,

    isError: paidTransactionsErr,
  } = useCustomQuery(
    [
      GET_ALL_PAID_TRANSACTIONS,
      {
        page: currentPage1,
        limit: PageSize,
        paymentMethod: transactionType?.value,
      },
    ],
    {
      url: `/payment/payment-history`,
      method: "post",
      data: {
        page: currentPage1,
        limit: PageSize,
        paymentMethod: transactionType?.value,
      },
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //search paid transactions
  // const {
  //   isLoading: searchPaidTransactionsLoading,
  //   isFetching: searchPaidTransactionFetching,
  //   refetch: refetchPaidTransactionSearch,
  // } = useCustomQuery(
  //   [
  //     GET_ALL_PAID_TRANSACTIONS,
  //     {
  //       search1,
  //     },
  //   ],
  //   {
  //     url: `/payment/payment-history`,
  //     method: "post",
  //     data: {
  //       search: search1,
  //     },
  //   },
  //   {
  //     refetchOnWindowFocus: false,
  //     onSuccess: (response) => {
  //       queryClient.setQueryData(
  //         [
  //           GET_ALL_PAID_TRANSACTIONS,
  //           {
  //             page: currentPage1,
  //             limit: PageSize,
  //           },
  //         ],
  //         (oldQueryData) => {
  //           return response;
  //         }
  //       );
  //     },
  //     enabled: false,
  //   }
  // );

  //get all accounting details
  const { data: accountDetails } = useCustomQuery(
    [GET_ACCOUNTING_DETAILS],
    {
      // url: `/payment/payment-data`,
      url: `/accounting/account-details`,
      method: "post",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent={"flex-start"}
        sx={{ width: "100%" }}
        spacing={1}
      >
        <Typography variant="displayLg">Overview</Typography>
      </Stack>

      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            // url="/home/accounting/requisitions"
            icon={
              <PendingIcon style={{ color: "#008435", fontSize: "30px" }} />
            }
            smallTxt="Pending Order"
            bigTxt={numberFormatter(
              accountDetails?.data?.numberOfPendingOrders || 0
            )}
            icnBgSx={{
              backgroundColor: "rgba(0, 132, 53, 0.1)",
            }}
            smallTxtSx={{
              fontWeight: "400",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            // url="/home/accounting/requisitions"
            icon={
              <ShoppingCartCheckout
                sx={{ color: "#FF8160", fontSize: "30px" }}
              />
            }
            icnBgSx={{
              backgroundColor: "rgba(219, 30, 54, 0.1)",
            }}
            smallTxtSx={{
              fontWeight: "400",
            }}
            smallTxt="Successful Order"
            bigTxt={numberFormatter(
              accountDetails?.data?.numberOfSuccessfulPayments || 0
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            url=""
            icon={
              <PaperDocIcon style={{ color: "#1B4AF0", fontSize: "30px" }} />
            }
            icnBgSx={{
              backgroundColor: "rgba(27, 74, 240, 0.1)",
            }}
            smallTxtSx={{
              fontWeight: "400",
            }}
            smallTxt="Total Expense"
            bigTxt={`₦${numberFormatter(
              accountDetails?.data?.totalExpenses || 0,
              9
            )}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardCard
            icon={<WalletIcon style={{ color: "black", fontSize: "30px" }} />}
            url=""
            icnBgSx={{
              backgroundColor: "rgba(2, 0, 17, 0.1)",
            }}
            smallTxtSx={{
              fontWeight: "400",
            }}
            smallTxt="Total income"
            bigTxt={`₦${numberFormatter(
              accountDetails?.data?.totalIncome || 0,
              9
            )}`}
          />
        </Grid>

        <Grid item xs={12}>
          {getAllTransactionsLoading ? (
            <CustomLoader />
          ) : isError ? (
            <Paper sx={{ p: 1, mt: 2 }}>
              <Typography>
                Something went wrong, refresh and try again Later
              </Typography>
            </Paper>
          ) : (
            <Paper sx={{ p: 4, mt: 2 }}>
              <Stack direction="column" spacing={2}>
                <Typography variant="displaySm">
                  Pending Transactions
                </Typography>

                <Stack
                  direction={{ xs: "column", lg: "row" }}
                  spacing={2}
                  sx={{ width: "100%" }}
                  justifyContent="space-between"
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={1}
                  >
                    {/* <CustomMenu
                      caption={transactionType || "Status"}
                      items={statusOptions}
                      // onClickItem={handleClickDropdownItem}
                      popperSx={{
                        width: {
                          xs: "30%",
                          md: "7.4%",
                        },
                      }}
                    /> */}
                  </Stack>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={1}
                  >
                    <SearchBar
                      search={search}
                      setsearch={setsearch}
                      placeholder="Search Patient Name"
                      refetch={refetchTransactionSearch}
                      isLoading={
                        searchTransactionFetching || searchTransactionsLoading
                      }
                    />
                    <CustomButton
                      startIcon={<PrintIcon />}
                      text={"Export"}
                      variant="outlined"
                      disabled={
                        allTransactions?.data?.patientPayments?.length === 0
                      }
                      onClick={handleExport}
                    />
                  </Stack>
                </Stack>
              </Stack>

              {allTransactions?.data?.patientPayments.length ? (
                <>
                  <OverviewTable
                    data={allTransactions?.data?.patientPayments}
                  />
                  <Box sx={{ p: { xs: 0, sm: 2 } }}>
                    <Pagination
                      currentPage={currentPage}
                      totalCount={allTransactions?.data?.count}
                      pageSize={10}
                      onPageChange={handlePageChange}
                      activeColor={"secondary.main"}
                    />
                  </Box>
                </>
              ) : (
                <Typography>No item to display</Typography>
              )}
            </Paper>
          )}
        </Grid>
        {/* Paid transactions */}
        <Grid item xs={12}>
          {getpaidTransactionsLoading ? null : paidTransactionsErr ? (
            <Paper sx={{ p: 1, mt: 2 }}>
              <Typography>
                Something went wrong, could'nt get transaction history refresh
                and try again Later
              </Typography>
            </Paper>
          ) : (
            <Paper sx={{ p: 4, mt: 2 }}>
              <Stack direction="column" spacing={2}>
                <Typography variant="displaySm">Transaction History</Typography>

                <Stack
                  direction={{ xs: "column", lg: "row" }}
                  spacing={2}
                  sx={{ width: "100%" }}
                  justifyContent="flex-end"
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={1}
                  >
                    {/* <SearchBar
                      search={search1}
                      setsearch={setsearch1}
                      placeholder="Search Patient Name"
                      refetch={refetchPaidTransactionSearch}
                      isLoading={
                        searchPaidTransactionsLoading ||
                        searchPaidTransactionFetching
                      }
                    /> */}

                    <CustomMenu
                      caption={transactionType.name || "Payment Method"}
                      items={transactionTypeOptions}
                      onClickItem={(data) => settransactionType(data)}
                      popperSx={{
                        width: {
                          xs: "40%",
                          md: "12.4%",
                        },
                      }}
                    />
                    <CustomButton
                      // startIcon={<PrintIcon />}
                      text={"Reset"}
                      variant="outlined"
                      onClick={() => settransactionType({})}
                    />
                    <CustomButton
                      startIcon={<PrintIcon />}
                      text={"Export"}
                      variant="outlined"
                      disabled={paidTransactions?.data?.payments?.length === 0}
                      onClick={handleExport1}
                    />
                  </Stack>
                </Stack>
              </Stack>

              {paidTransactions?.data?.payments?.length ? (
                <>
                  <AccountingTransactionHistoryTable
                    data={paidTransactions?.data?.payments}
                  />
                  <Box sx={{ p: { xs: 0, sm: 2 } }}>
                    <Pagination
                      currentPage={currentPage1}
                      totalCount={paidTransactions?.data?.count}
                      pageSize={10}
                      onPageChange={handlePageChange1}
                      activeColor={"secondary.main"}
                    />
                  </Box>
                </>
              ) : (
                <Typography>No item to display</Typography>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

AccountingOverview.defaultProps = {
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
};
export default AccountingOverview;
