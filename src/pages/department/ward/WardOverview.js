import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import DashboardCard from "components/molecules/dashboardCard/DashboardCard";
import React from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BiotechIcon from "@mui/icons-material/Biotech";
import SearchBar from "components/atoms/SearchBar";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

import CustomPieChart from "components/atoms/CustomPieChart";
import WardOverviewDashboardTable from "components/molecules/tabels/ward/WardOverviewDashboardTable";
import CustomModal from "components/atoms/CustomModal";
import WardDetailsModalContent from "components/molecules/department/modalContents/CraeteOrEditWard";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import CustomMenu from "components/atoms/CustomMenu";
import OverviewModalParent from "components/molecules/department/modalContents/OverviewModalParent";
import ErrorComponent from "components/atoms/ErrorComponent";
import CustomButton from "components/atoms/CustomButton";
import { GET_WARDS } from "utils/reactQueryKeys";

const pieData = [
  {
    name: "Occupied Bed",
    fill: "rgba(9, 44, 76, 1)",
    value: 20,
  },
  {
    name: "Unoccupied Bed",
    fill: "rgba(69, 126, 232, 1)",
    value: 100,
  },
];
const formatPiedata = (data) => {
  if (!Object.keys(data).length) return pieData;
  let formated = [];

  let occupiedBeds = 0;

  data.wards.forEach((item) => {
    let usedBeds = 0;
    if (item.usedBeds) usedBeds = item.usedBeds;
    occupiedBeds += usedBeds;
  });

  const unOccupiedBeds = data.totalBeds - occupiedBeds;

  formated.push(
    {
      name: "Occupied Bed",
      fill: "rgba(9, 44, 76, 1)",
      value: occupiedBeds,
    },
    {
      name: "Unoccupied Bed",
      fill: "rgba(69, 126, 232, 1)",
      value: unOccupiedBeds,
    }
  );

  return formated;
};
function WardOverview() {
  const queryClient = useQueryClient();
  const modalRef = React.useRef(null);
  const [modalType, setModaltype] = React.useState(0);
  const [wardDetails, setwardDetails] = React.useState({});
  const [search, setsearch] = React.useState("");

  //get wards
  const {
    isLoading: wardOverviewDataLoading,
    isError,
    data: wardOverviewData,
    refetch: refetchWardOverview,
  } = useCustomQuery(
    GET_WARDS,
    {
      url: `/wards/get-all-wards`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  //search for wards
  const {
    isLoading: searchWardsLoading,
    isFetching,

    refetch: refetchWardSearch,
  } = useCustomQuery(
    [GET_WARDS, search],
    {
      url: `/wards/get-all-wards?search=${search}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: (response) =>
        queryClient.setQueryData(GET_WARDS, (oldQueryData) => {
          return {
            ...response,
          };
        }),
    }
  );

  const handleReset = () => {
    setsearch("");
    refetchWardOverview();
  };

  const openModal = () => {
    modalRef?.current?.handleToggle();
  };

  const handleEditWardDetails = (details) => {
    setwardDetails(details);
    openModal();
    setModaltype(1);
  };

  const onClickItem = (item) => {
    if (item === "New Ward") {
      setModaltype(0);
    } else if (item === "New Clinic") {
      setModaltype(2);
    } else {
      setModaltype(3);
    }
    openModal();
  };
  if (isError) return <ErrorComponent />;

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "start", sm: "center" }}
        sx={{ width: "100%" }}
      >
        <Typography variant="displayLg">Overview</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ fontWeight: "bold" }}
            onClick={() => {
              setModaltype(4);
              openModal();
            }}
          >
            Transfer Patient
          </Button>
          <CustomMenu
            caption="Create"
            onClickItem={onClickItem}
            btnVariant="contained"
            btnColor="success"
            items={["New Ward", "New Clinic", "New Unit"]}
          />
        </Stack>
      </Stack>
      {wardOverviewDataLoading ? (
        <CustomLoader />
      ) : (
        <Grid container spacing={1} sx={{ mt: 2 }}>
          <Grid item xs={12} lg={9}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <DashboardCard
                url=""
                smallTxt="Total NUMBER OF BEDS"
                bigTxt={wardOverviewData.data.totalBeds}
                icnBgSx={{
                  backgroundColor: "rgba(2, 0, 17, 0.1)",
                  borderRadius: "50%",
                }}
                icon={
                  <PeopleAltIcon sx={{ color: "black", fontSize: "30px" }} />
                }
              />
              <DashboardCard
                url=""
                icnBgSx={{
                  backgroundColor: "rgba(255, 129, 96, 0.1)",
                  borderRadius: "50%",
                }}
                smallTxt="TOTAL NUMBER OF WARDS"
                bigTxt={wardOverviewData.data.totalWards}
                icon={
                  <BiotechIcon sx={{ color: "#FF8160", fontSize: "30px" }} />
                }
              />
            </Stack>
            <Paper sx={{ p: 2, mt: 2 }}>
              <Stack direction="column" spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                  }}
                >
                  <Typography variant="heading" sx={{}}>
                    Ward/Bed Listing
                  </Typography>
                  <Stack direction="row" alignItems={"center"} spacing={1}>
                    <SearchBar
                      search={search}
                      setsearch={setsearch}
                      isLoading={searchWardsLoading || isFetching}
                      refetch={refetchWardSearch}
                    />
                    <CustomButton
                      variant="text"
                      text="Reset"
                      onClick={handleReset}
                    />
                  </Stack>
                </Box>
                <WardOverviewDashboardTable
                  handleEditWardDetails={handleEditWardDetails}
                  data={wardOverviewData.data.wards}
                  refetchWardOverview={refetchWardOverview}
                />
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Paper
              sx={{ p: 2, display: "flex", flexDirection: "column", mb: 2 }}
            >
              <CustomPieChart
                data={formatPiedata(wardOverviewData?.data)}
                title="BEDS MANAGEMENT"
                xs={12}
                sm={12}
                showValue={true}
              />
            </Paper>
          </Grid>
        </Grid>
      )}
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          width: {
            xs: "90%",
            sm: "85vw",
            lg: "60vw",
          },
        }}
        ariaLabel="ward-overview-modal"
      >
        <OverviewModalParent
          handleClose={() => modalRef?.current?.handleToggle()}
          wardDetails={wardDetails}
          modalType={modalType}
          refetchWardOverview={refetchWardOverview}
        />
      </CustomModal>
    </Box>
  );
}

export default WardOverview;
