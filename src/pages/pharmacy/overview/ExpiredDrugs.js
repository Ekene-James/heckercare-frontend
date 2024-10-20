import { MoreVertOutlined } from "@mui/icons-material";
import { Box, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomLoader from "components/atoms/CustomLoader";
import CustomDatePicker from "components/atoms/DatePicker";
import SearchBar from "components/atoms/SearchBar";
import SimpleTable from "components/atoms/SimpleTable";
import Pagination from "components/molecules/pagination/Pagination";
import PharmacyTable from "components/molecules/tabels/pharmacy/PharmacyTable";
import { useQueryClient } from "react-query";
import BackButton from "components/atoms/BackButton";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_DISPENSED_LIST,
  GET_EXPIRED_DRUGS,
  GET_PENDING_REQUEST,
} from "utils/reactQueryKeys";
import Header from "../components/Header";
import RightDrawer from "../components/RightDrawer";
import StatisticsCard from "../components/StatisticsCard";
import CreateDrugOrder from "./CreateDrugOrder";
import DispensedTable from "components/molecules/tabels/pharmacy/DispensedTable";
import ExpiredDrugsTable from "components/molecules/tabels/pharmacy/ExpiredDrugsTable";
let PageSize = 10;
let total = 50;

function ExpiredDrugs() {
  const [date, setdate] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setsearch] = React.useState("");
  const [checkBoxItems, setcheckBoxItems] = React.useState([]);
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

  //get expired drugs list
  const {
    data: expiredDrugsList,
    isLoading: getExpiredDrugsLoading,
    refetch: refetchRequest,
    isError,
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

  return (
    <Box>
      <Stack direction="row" spacing={1}>
        <BackButton showText={true} />
      </Stack>
      <Paper sx={{ px: 2, mt: 2, mb: 2 }}>
        <Stack
          sx={{ p: 4, pt: 6 }}
          direction={{ xs: "column", sm: "row" }}
          justifyContent={{ xs: "center", sm: "space-between" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
        >
          <Typography variant="displayMd" sx={{}}>
            Expired Drugs
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={{ xs: "center", sm: "space-between" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          ></Stack>
        </Stack>
      </Paper>

      <Stack
        direction={{ xs: "column" }}
        sx={{
          gap: 4,
        }}
      >
        {getExpiredDrugsLoading ? (
          <CustomLoader />
        ) : isError ? (
          <Paper sx={{ p: 1 }}>
            <Typography>
              Something went wrong, refresh and try again Later
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 2 }}>
            {expiredDrugsList?.data?.batches.length ? (
              <>
                <ExpiredDrugsTable
                  refetch={refetchRequest}
                  page={currentPage}
                  data={expiredDrugsList?.data?.batches}
                  checkBoxItems={checkBoxItems}
                  setcheckBoxItems={setcheckBoxItems}
                />
                <Box sx={{ p: { xs: 0, sm: 2 } }}>
                  <Pagination
                    currentPage={currentPage}
                    totalCount={expiredDrugsList?.data?.count}
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
    </Box>
  );
}

export default ExpiredDrugs;
