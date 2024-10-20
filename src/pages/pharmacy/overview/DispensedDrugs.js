import { MoreVertOutlined } from "@mui/icons-material";
import {
  Box,
  Grid,
  IconButton,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomLoader from "components/atoms/CustomLoader";

import SearchBar from "components/atoms/SearchBar";
import Pagination from "components/molecules/pagination/Pagination";

import { useQueryClient } from "react-query";
import BackButton from "components/atoms/BackButton";

import PrintIcon from "@mui/icons-material/Print";

import React from "react";

import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_DISPENSED_LIST } from "utils/reactQueryKeys";

import DispensedTable from "components/molecules/tabels/pharmacy/DispensedTable";

import { exportToExcel } from "utils/exportToExcel";

let PageSize = 10;

const formatExportData = (data) => {
  return data.map((d) => {
    const prescriptions = {};
    d.items.forEach((prescription, i) => {
      prescriptions[`prescription_${i + 1}_name`] =
        prescription?.product?.drugName;
      prescriptions[`prescription_${i + 1}_routeOfAdmin`] =
        prescription?.routeOfAdmin;
      prescriptions[`prescription_${i + 1}_quantity`] = prescription?.quantity;
      prescriptions[`prescription_${i + 1}_duration`] = prescription?.duration;
      prescriptions[`prescription_${i + 1}_foodRelation`] =
        prescription?.foodRelation;
      prescriptions[`prescription_${i + 1}_frequency`] =
        prescription?.frequency;
      prescriptions[`prescription_${i + 1}_numberOfTimes`] =
        prescription?.numberOfTimes;
      prescriptions[`prescription_${i + 1}_notes`] = prescription?.notes;
    });
    const formattedData = {
      ...d,
      firstName: d?.patient?.firstName,
      lastName: d?.patient?.lastName,
      ...prescriptions,
    };
    delete formattedData?._id;
    delete formattedData?.items;
    delete formattedData?.patient;
    delete formattedData?.isIndividual;
    delete formattedData?.doctor;
    delete formattedData?.pharmacist;

    return formattedData;
  });
};

function DispensedDrugs() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setsearch] = React.useState("");
  const [checkBoxItems, setcheckBoxItems] = React.useState([]);
  const queryClient = useQueryClient();

  const handlePageChange = (page) => {
    // skip.current = (page - 1) * PageSize;
    //   dispatch(getMoreItems(PageSize, {}, skip.current));

    setCurrentPage(page);
  };

  // //get date
  // const getDate = (date) => {
  //   if (date) {
  //     const newDate = new Date(date);
  //     const yr = newDate.getFullYear();
  //     const month = newDate.getMonth() + 1;
  //     const day = newDate.getDate();
  //     return `${yr}-${month}-${day}`;
  //   }
  //   return "";
  // };

  //get dispensed list
  const {
    data: dispensedList,
    isLoading: getDispensedListLoading,
    refetch: refetchRequest,
    isError,
  } = useCustomQuery(
    [
      GET_DISPENSED_LIST,
      {
        page: currentPage,
        limit: PageSize,
      },
    ],
    {
      url: `/product/get-dispensed-list`,
      method: "post",
      data: {
        page: currentPage,
        search: "",
        limit: PageSize,
      },
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //search dispensed list
  const {
    isLoading: searchDispensedDrugsLoading,
    isFetching: searchDispensedDrugsFetching,
    refetch: refetchSearch,
  } = useCustomQuery(
    [
      [GET_DISPENSED_LIST],
      {
        page: currentPage,
        search,
        limit: PageSize,
      },
    ],
    {
      url: `/product/get-dispensed-list`,
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
            GET_DISPENSED_LIST,
            {
              page: currentPage,
              // search,
              limit: PageSize,
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
      formatExportData(checkBoxItems),
      "hms_dispensed_prescriptions"
    );
  };
  const handleReset = () => {
    setsearch("");
    refetchRequest();
  };
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
            Dispensed History
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={{ xs: "center", sm: "space-between" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          >
            <CustomButton
              text={"Export"}
              startIcon={<PrintIcon />}
              onClick={handleExport}
              variant="outlined"
              disabled={!checkBoxItems.length}
            />
            <SearchBar
              refetch={refetchSearch}
              search={search}
              setsearch={setsearch}
              placeholder="Search Patient/Request ID"
              isLoading={
                searchDispensedDrugsLoading || searchDispensedDrugsFetching
              }
            />

            <Grid item xs={1} sx={{ display: "flex", justifyContent: "end" }}>
              <Button variant="text" onClick={handleReset}>
                Reset
              </Button>
            </Grid>
          </Stack>
        </Stack>
      </Paper>

      <Stack
        direction={{ xs: "column" }}
        sx={{
          gap: 4,
        }}
      >
        {getDispensedListLoading ? (
          <CustomLoader />
        ) : isError ? (
          <Paper sx={{ p: 1 }}>
            <Typography>
              Something went wrong, refresh and try again Later
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 2 }}>
            {dispensedList?.data?.prescriptions.length ? (
              <>
                <DispensedTable
                  refetch={refetchRequest}
                  page={currentPage}
                  data={dispensedList?.data?.prescriptions}
                  checkBoxItems={checkBoxItems}
                  setcheckBoxItems={setcheckBoxItems}
                />
                <Box sx={{ p: { xs: 0, sm: 2 } }}>
                  <Pagination
                    currentPage={currentPage}
                    totalCount={dispensedList?.data?.count}
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

export default DispensedDrugs;
