import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import CustomMenu from "components/atoms/CustomMenu";
import SearchBar from "components/atoms/SearchBar";
import React from "react";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import StaffListCard from "components/atoms/StaffListCard";
import BackButton from "components/atoms/BackButton";
import CustomDatePicker from "components/atoms/DatePicker";
import Pagination from "components/molecules/pagination/Pagination";
import { GET_AVAILABLE_DOCTORS } from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
import { useQueryClient } from "react-query";

function AvailableDoctors({ PageSize }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setsearch] = React.useState("");
  const queryClient = useQueryClient();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //get all free doctors
  const {
    data: availableDoctorsList,
    isLoading: getAvailableDoctorsLoading,
    refetch: refetchAllAvailableDoctors,
    isError: isAvailableDoctorsError,
  } = useCustomQuery(
    [
      GET_AVAILABLE_DOCTORS,
      {
        page: currentPage,
        limit: PageSize,
      },
    ],
    {
      url: `/user/get-free-doctors?page=${currentPage}&limit=${PageSize}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //search pharmacy products
  const {
    isLoading: searchLoading,
    isFetching,

    refetch,
  } = useCustomQuery(
    [GET_AVAILABLE_DOCTORS, search],
    {
      url: `/user/get-free-doctors?search=${search}`,
      method: "get",
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [
            GET_AVAILABLE_DOCTORS,
            {
              page: currentPage,
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
    }
  );

  return (
    <Box>
      <Typography variant="displayLg">Dashboard</Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Stack
          sx={{ width: "100%" }}
          direction={"row"}
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Stack
            direction={"row"}
            justifyContent="center"
            alignItems={"center"}
            spacing={1}
          >
            <BackButton showText={false} />
            <Typography variant="displayMd">Available Doctors</Typography>
          </Stack>

          <Stack
            direction={"row"}
            justifyContent="center"
            alignItems={"center"}
            spacing={1}
          >
            <SearchBar
              handleSearch={() => {}}
              placeholder="Search by Doctors ID/Name"
              search={search}
              setsearch={setsearch}
              isLoading={searchLoading || isFetching}
              refetch={refetch}
            />
            {/* <CustomDatePicker
              type="date"
              views={["year", "month", "day"]}
              size="small"
              lightBorder={true}
              disableFuture={false}
            /> */}
          </Stack>
        </Stack>
        <Paper sx={{ p: 3, mt: 2 }}>
          {getAvailableDoctorsLoading ? (
            <CustomLoader />
          ) : isAvailableDoctorsError ? (
            <Paper sx={{ p: 1, mt: 2 }}>
              <Typography>
                Something went wrong, refresh and try again Later
              </Typography>
            </Paper>
          ) : (
            <>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {availableDoctorsList?.data?.users?.length ? (
                  availableDoctorsList?.data?.users?.map((item) => (
                    <Grid item xs={6} sm={4} lg={3} key={item?._id}>
                      <StaffListCard item={item} />
                    </Grid>
                  ))
                ) : (
                  <Typography variant="heading">No Item to display</Typography>
                )}
              </Grid>
              <Pagination
                currentPage={currentPage}
                totalCount={availableDoctorsList?.data?.count || 5}
                pageSize={PageSize}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </Paper>
      </Paper>
    </Box>
  );
}

AvailableDoctors.defaultProps = {
  PageSize: 12,
};
export default AvailableDoctors;
