import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";

import CustomButton from "components/atoms/CustomButton";

import CustomMenu from "components/atoms/CustomMenu";

import SearchBar from "components/atoms/SearchBar";
import PrintIcon from "@mui/icons-material/Print";
import Pagination from "components/molecules/pagination/Pagination";
import { useQueryClient } from "react-query";
import { exportToExcel } from "utils/exportToExcel";

import { GET_ACCOUNTING_REQUISITION_DISPUTE } from "utils/reactQueryKeys";

import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";

import RequisitionDisputeTable from "components/molecules/tabels/accounting/RequisitionDisputeTable";

let pageSize = 10;

const formatExportData = (data) => {
  return data.map((d) => {
    const formattedData = {
      ...d,
      disputeId: d?.uniqueCode,
      createtorId: d?.createdBy?._id,
      createdBy: d?.createdBy?.fullName,
      requisitionName: d?.requisition?.title,
      requisitionId: d?.requisition?._id,
    };
    delete formattedData.requisition;
    delete formattedData.id;
    delete formattedData.uniqueCode;

    return formattedData;
  });
};

function RequisitionDispute() {
  const [search, setsearch] = React.useState("");
  const queryClient = useQueryClient();
  const [dispute, setdispute] = React.useState({});

  const [currentPage, setCurrentPage] = React.useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const onClickDispute = (item) => {
    setCurrentPage(1);
    setdispute(item);
  };

  //get date

  //get all dispute
  const {
    data: allRequisitionsDispute,
    isLoading: getAllRequisitionsDisputeLoading,

    isError,
  } = useCustomQuery(
    [
      GET_ACCOUNTING_REQUISITION_DISPUTE,
      {
        page: currentPage,
        limit: pageSize,
        status: dispute?.value ? dispute?.value : null,
      },
    ],
    {
      url: `/accounting/get-requisition-disputes`,
      method: "post",
      data: {
        page: currentPage,
        limit: pageSize,
        status: dispute?.value ? dispute?.value : null,
      },
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //search requisitions dispute
  const {
    isLoading: searchDisputeLoading,
    isFetching: searchDisputeFetching,
    refetch: refetchDisputeSearch,
  } = useCustomQuery(
    [GET_ACCOUNTING_REQUISITION_DISPUTE, search],
    {
      url: `/accounting/get-requisition-disputes`,
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
            GET_ACCOUNTING_REQUISITION_DISPUTE,
            {
              page: currentPage,
              limit: pageSize,

              status: dispute?.value ? dispute?.value : null,
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

  //handle export
  const handleExport = () => {
    exportToExcel(
      formatExportData(allRequisitionsDispute?.data?.results),
      "hms_accounts_requisition_dispute"
    );
  };

  return (
    <Box>
      <Stack direction="row" sx={{ width: "100%" }} spacing={1}>
        <Typography variant="displayLg">Requisition Dispute List</Typography>
      </Stack>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Stack spacing={2}>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            alignItems={"center"}
            justifyContent={{
              xs: "center",
              sm: "space-between",
            }}
          >
            <CustomMenu
              caption={dispute?.name || "Status"}
              onClickItem={onClickDispute}
              popperSx={{ width: "10%" }}
              items={[
                { name: "All Disputes", value: "" },
                { name: "Pending", value: "PENDING" },
                { name: "Resolved ", value: "RESOLVED" },
                { name: "Rejected ", value: "REJECTED" },
              ]}
            />
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <SearchBar
                refetch={refetchDisputeSearch}
                placeholder="Search by Dispute ID"
                search={search}
                setsearch={setsearch}
                isLoading={searchDisputeLoading || searchDisputeFetching}
              />
              <CustomButton
                text="Export"
                startIcon={<PrintIcon />}
                onClick={handleExport}
                variant="outlined"
                disabled={!allRequisitionsDispute?.data?.results?.length}
              />
            </Stack>
          </Stack>

          {getAllRequisitionsDisputeLoading ? (
            <CustomLoader />
          ) : isError ? (
            <Paper sx={{ p: 1, mt: 2 }}>
              <Typography>
                Something went wrong, refresh and try again Later
              </Typography>
            </Paper>
          ) : (
            <>
              {allRequisitionsDispute?.data?.results?.length ? (
                <>
                  <RequisitionDisputeTable
                    data={allRequisitionsDispute?.data?.results}
                  />
                  <Box sx={{ p: { xs: 0, sm: 2 } }}>
                    <Pagination
                      currentPage={currentPage}
                      totalCount={allRequisitionsDispute?.data?.count}
                      pageSize={pageSize}
                      onPageChange={handlePageChange}
                      activeColor="secondary.main"
                    />
                  </Box>
                </>
              ) : (
                <Typography>No item to display</Typography>
              )}
            </>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}

export default RequisitionDispute;
