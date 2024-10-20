import { Box, Paper, Stack, Typography } from "@mui/material";
import CustomTab from "components/atoms/CustomTab";
import CustomDatePicker from "components/atoms/DatePicker";
import SearchBar from "components/atoms/SearchBar";
import React from "react";
import Pagination from "components/molecules/pagination/Pagination";
import { useNavigate } from "react-router-dom";
import GeneralDoctorTable from "components/molecules/tabels/dashboard/GeneralDoctorTable";
import SpecialistDoctorTable from "components/molecules/tabels/dashboard/SpecialistDoctorTable";
import BackButton from "components/atoms/BackButton";
import CustomButton from "components/atoms/CustomButton";

function AllAppointments({ total, navItems, PageSize }) {
  const navigate = useNavigate();
  const skip = React.useRef(0);
  const [value, setvalue] = React.useState(0);

  const [currentPage, setCurrentPage] = React.useState(1);
  const handlePageChange = (page) => {
    skip.current = (page - 1) * PageSize;
    //   dispatch(getMoreItems(PageSize, {}, skip.current));

    setCurrentPage(page);
  };

  let view;
  switch (value) {
    case 0:
      view = <GeneralDoctorTable />;

      break;
    case 1:
      view = <SpecialistDoctorTable />;

      break;

    default:
      break;
  }
  return (
    <Box>
      <Stack
        direction={"row"}
        sx={{ width: "100%" }}
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Typography variant="displayLg">Dashboard</Typography>
        <CustomButton text={"Schedule Appointment"} color="success" />
      </Stack>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack direction="column" spacing={2}>
          <Stack direction="row" alignItems={"center"} spacing={1}>
            <BackButton showText={false} />
            <Typography variant="heading" sx={{}}>
              Total Appointment
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={"center"}
            justifyContent="space-between"
            sx={{ width: "100%" }}
            spacing={1}
          >
            <CustomTab navItems={navItems} value={value} setValue={setvalue} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                width: {
                  xs: "auto",
                  sm: "80%",
                },
                m: {
                  xs: 2,
                  sm: 1,
                },
              }}
            >
              <SearchBar
                handleSearch={() => {}}
                placeholder="Search by Patient ID/Name"
              />
              <Box sx={{ ml: 2 }}>
                <CustomDatePicker
                  type="date"
                  views={["year", "month", "day"]}
                  size="small"
                  lightBorder={true}
                  disableFuture={false}
                />
              </Box>
            </Box>
          </Stack>
          {view}
          <Box sx={{ p: { xs: 0, sm: 0 } }}>
            <Pagination
              currentPage={currentPage}
              totalCount={total || 5}
              pageSize={PageSize}
              onPageChange={handlePageChange}
            />
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

AllAppointments.defaultProps = {
  navItems: [
    {
      label: "General",
      id: 0,
      count: 10,
    },
    {
      label: "Specialist",
      id: 1,
      count: 15,
    },
  ],
  PageSize: 5,
  total: 50,
};
export default AllAppointments;
