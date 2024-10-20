import { Box, Grid, Paper, Stack, Typography } from "@mui/material";

import React from "react";

import UsageHistoryModalTable from "components/molecules/tabels/inventory/UsageHistoryModalTable";
import { GET_LAB_STOCKS, GET_USAGE_HISTORY } from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
const PageSize = 10;

function UsageHistory({ stockDetails }) {
  const [currentPage, setCurrentPage] = React.useState(1);

  const [itemId, setItemId] = React.useState("");

  //get all transaction history items
  const {
    data: usageHistory,
    isLoading: getUsageHistoryLoading,
    refetch: refetchRequest,
    isError,
  } = useCustomQuery(
    [
      GET_USAGE_HISTORY,
      {
        stockDetails: stockDetails?._id,
        page: currentPage,
        limit: PageSize,
      },
    ],
    {
      url: `/lab-stock/usage-history/${stockDetails._id}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return (
    <Box>
      <Typography variant="displayMd">Usage History</Typography>
      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={9}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography sx={{ fontWeight: "bold" }}>Item:</Typography>
                <Typography sx={{ opacity: 0.5 }}>
                  {stockDetails?.itemName}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography sx={{ fontWeight: "bold" }}>
                  Current Quantity:{" "}
                </Typography>
                <Typography sx={{ opacity: 0.5 }}>
                  {stockDetails?.totalQuantity}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography sx={{ fontWeight: "bold" }}>Unit Type: </Typography>
                <Typography sx={{ opacity: 0.5 }}>
                  {stockDetails?.unitOfItem}
                </Typography>{" "}
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {getUsageHistoryLoading ? (
        <CustomLoader />
      ) : isError ? (
        <Paper sx={{ p: 1 }}>
          <Typography>
            Something went wrong, refresh and try again Later
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 2 }}>
          {usageHistory?.data?.usageHistory?.length ? (
            <>
              <UsageHistoryModalTable
                data={usageHistory?.data}
                page={currentPage}
                // toggleModal={toggleModal}
              />
            </>
          ) : (
            <Typography>No item to display</Typography>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default UsageHistory;
