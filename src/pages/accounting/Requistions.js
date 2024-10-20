import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";

import CustomButton from "components/atoms/CustomButton";

import CustomMenu from "components/atoms/CustomMenu";

import SearchBar from "components/atoms/SearchBar";
import PrintIcon from "@mui/icons-material/Print";
import Pagination from "components/molecules/pagination/Pagination";
import { useQueryClient } from "react-query";
import { exportToExcel } from "utils/exportToExcel";

import { GET_ACCOUNTING_REQUISITIONS } from "utils/reactQueryKeys";

import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";

import RequisitionTable from "components/molecules/tabels/accounting/RequisitionTable";
import DateRangePicker from "components/atoms/dateRangePicker/DateRangePicker";

let pageSize = 10;

const formatExportData = (data) => {
  return data.map((d) => {
    let drugs = {};
    if (d?.drugDetails && Object.keys(d?.drugDetails)?.length) {
      for (let idx = 0; idx < d?.drugDetails?.length; idx++) {
        const element = d?.drugDetails[idx];
        drugs[`drug_${idx + 1}_name`] = element?.productType?.drugName;
        drugs[`drug_${idx + 1}_quantity`] = element?.quantity;
        drugs[`drug_${idx + 1}_unit`] = element?.unit;
        drugs[`drug_${idx + 1}_unitCost`] = element?.unitCost;
      }
    }
    let inventories = {};
    if (d?.inventoryDetails && Object.keys(d?.inventoryDetails)?.length) {
      for (let idx = 0; idx < d?.inventoryDetails?.length; idx++) {
        const element = d?.inventoryDetails[idx];
        inventories[`inventory_${idx + 1}_name`] =
          element?.productType?.itemName;
        inventories[`inventory_${idx + 1}_quantity`] = element?.quantity;
        inventories[`inventory_${idx + 1}_unitCost`] = element?.unitCost;
      }
    }

    const formattedData = {
      ...d,
      ...drugs,
      ...inventories,
      ...d.cost,
      requesterName: d?.requester?.fullName,
      shippingAddress: d?.shippiongDetails?.address,
      shippingPhoneNumber: d?.shippiongDetails?.phoneNumber,
      vendorName: d?.vendorDetails?.vendorName,
      vendorAddress: d?.vendorDetails?.address,
      vendorPhoneNumber: d?.vendorDetails?.phoneNumber,
    };
    delete formattedData.cost;
    delete formattedData.requester;
    delete formattedData.shippiongDetails;
    delete formattedData.vendorDetails;
    delete formattedData.id;
    delete formattedData.drugDetails;
    delete formattedData.inventoryDetails;

    return formattedData;
  });
};
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

function AccountsRequisitions() {
  const [checkBoxItems, setcheckBoxItems] = React.useState([]);
  const [search, setsearch] = React.useState("");
  const queryClient = useQueryClient();
  const [department, setDepartment] = React.useState({});

  const [currentPage, setCurrentPage] = React.useState(1);

  const [reqStatus, setreqStatus] = React.useState({});
  const [date, setdate] = React.useState([]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const onClickReqStatus = (item) => {
    setsearch("");
    setCurrentPage(1);
    setreqStatus(item);
  };
  const onClickDept = (item) => {
    setsearch("");
    setCurrentPage(1);
    setDepartment(item);
  };

  //get date

  //handle export
  const handleExport = () => {
    exportToExcel(formatExportData(checkBoxItems), "hms_accounts_requisitions");
  };
  //get all requisitions
  const {
    data: allRequisitions,
    isLoading: getAllRequisitionsLoading,
    refetch,
    isError,
  } = useCustomQuery(
    [
      GET_ACCOUNTING_REQUISITIONS,
      {
        startDate: formatDate(date && date[0]),
        endDate: formatDate(date && date[1]),
        page: currentPage,
        limit: pageSize,
        status: reqStatus.value,
        department: department.value,
      },
    ],
    {
      url: `/accounting/get-requisitions`,
      method: "post",
      data: {
        startDate: formatDate(date && date[0]),
        endDate: formatDate(date && date[1]),
        page: currentPage,
        limit: pageSize,
        status: reqStatus.value,
        department: department.value,
      },
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //search requisitions
  const {
    isLoading: searchRequisitionsLoading,
    isFetching: searchRequisitionsFetching,
    refetch: refetchRequisitionsSearch,
  } = useCustomQuery(
    [GET_ACCOUNTING_REQUISITIONS, search],
    {
      url: `/accounting/get-requisitions`,
      method: "post",
      data: {
        search,
        limit: pageSize,
      },
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [
            GET_ACCOUNTING_REQUISITIONS,
            {
              startDate: formatDate(date && date[0]),
              endDate: formatDate(date && date[1]),
              page: currentPage,
              limit: pageSize,
              status: reqStatus.value,
              department: department.value,
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
    setDepartment({});
    setreqStatus({});
    setCurrentPage(1);
    setdate([]);
    setcheckBoxItems([]);
    if (search) {
      setsearch("");
      refetch();
    }
  };
  return (
    <Box>
      <Stack direction="row" sx={{ width: "100%" }} spacing={1}>
        <Typography variant="displayLg">Requisitions</Typography>
      </Stack>

      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={8}>
                <SearchBar
                  refetch={refetchRequisitionsSearch}
                  placeholder="Search by requisition title or vendor name"
                  width="100% !important"
                  search={search}
                  setsearch={setsearch}
                  isLoading={
                    searchRequisitionsLoading || searchRequisitionsFetching
                  }
                />
              </Grid>
              <Grid item xs={0} sm={2.5} />
              <Grid item xs={6} sm={1.5}>
                <CustomButton
                  text="Export"
                  startIcon={<PrintIcon />}
                  onClick={handleExport}
                  variant="outlined"
                  sx={{ width: "100%" }}
                  disabled={!checkBoxItems.length}
                />
              </Grid>
            </Grid>
            <Stack
              direction="row"
              alignItems={"center"}
              justifyContent={{
                xs: "center",
                sm: "space-between",
              }}
              mt={2}
            >
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                alignItems={"center"}
                spacing={1}
                justifyContent="center"
              >
                <CustomMenu
                  caption={reqStatus?.name || "Status"}
                  onClickItem={onClickReqStatus}
                  popperSx={{ width: "8%" }}
                  items={[
                    { name: "Approved", value: "APPROVED" },
                    { name: "Declined", value: "DECLINED" },
                    { name: "Pending", value: "PENDING" },
                  ]}
                />

                <CustomMenu
                  caption={department?.name || "Department"}
                  onClickItem={onClickDept}
                  popperSx={{ width: "10%" }}
                  items={[
                    { name: "Pharmacy", value: "pharmacy" },
                    { name: "Inventory ", value: "inventory" },
                  ]}
                />
                <DateRangePicker
                  values={date}
                  setValues={setdate}
                  placeholder="Select date range"
                />
              </Stack>
              <CustomButton variant="text" text="Reset" onClick={handleReset} />
            </Stack>
          </Paper>

          {getAllRequisitionsLoading ? (
            <CustomLoader />
          ) : isError ? (
            <Paper sx={{ p: 1, mt: 2 }}>
              <Typography>
                Something went wrong, refresh and try again Later
              </Typography>
            </Paper>
          ) : (
            <Paper sx={{ p: 4, mt: 2 }}>
              {allRequisitions?.data?.results?.length ? (
                <>
                  <RequisitionTable
                    refetch={refetchRequisitionsSearch}
                    page={currentPage}
                    data={allRequisitions?.data?.results}
                    checkBoxItems={checkBoxItems}
                    setcheckBoxItems={setcheckBoxItems}
                  />
                  <Box sx={{ p: { xs: 0, sm: 2 } }}>
                    <Pagination
                      currentPage={currentPage}
                      totalCount={allRequisitions?.data?.count}
                      pageSize={pageSize}
                      onPageChange={handlePageChange}
                      activeColor="secondary.main"
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

export default AccountsRequisitions;
