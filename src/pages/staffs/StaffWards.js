import {
  Box,
  Grid,
  Typography,
  Paper,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import React from "react";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import { useNavigate } from "react-router-dom";
import CustomModal from "components/atoms/CustomModal";

import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
import { GET_DEPARTMENTS, GET_WARDS } from "utils/reactQueryKeys";
import Pagination from "components/molecules/pagination/Pagination";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import StaffWard from "components/molecules/staff/StaffWard";

const pageSize = 12;
const OverviewCard = ({
  card: { id, name, headOfWard = "No HOD name", staff = [] },
  i,
}) => {
  const modalRef = React.useRef(null);

  const openModal = () => {
    modalRef?.current?.handleToggle();
  };
  return (
    <>
      <Stack
        direction="column"
        alignItems="start"
        justifyContent="start"
        spacing={2}
        sx={{
          border: "2px solid rgba(245, 245, 245, 1)",
          borderRadius: "3px",
          p: 2,
          width: "100%",
        }}
      >
        <Stack
          direction="row"
          alignItems="start"
          justifyContent="space-between"
          spacing={2}
          sx={{ width: "100%" }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              p: 1,
              pt: 0.3,
              pb: 0.3,
              borderRadius: "4px",
              backgroundColor: "background.gray3",
              color: "background.gray4",
            }}
          >
            {i}
          </Typography>
          <IconButton
            size="small"
            onClick={openModal}
            sx={{
              border: "2px solid rgba(245, 245, 245, 1)",
              borderRadius: "4px",
            }}
          >
            <DriveFileRenameOutlineOutlinedIcon />
          </IconButton>
        </Stack>
        <Typography
          sx={{
            fontWeight: "bold",
          }}
        >
          {name}
        </Typography>

        {/* <Stack
          direction="column"
          alignItems="start"
          justifyContent="start"
          spacing={0.5}
        >
          <Typography sx={{ color: "primary.lightGrey" }}>
            Head of Ward
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>
            {headOfWard?.fullName}
          </Typography>
        </Stack> */}
        <Stack
          direction="column"
          alignItems="start"
          justifyContent="start"
          spacing={0.5}
        >
          <Typography sx={{ color: "primary.lightGrey" }}>
            Number of Assigned Staff
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>{staff.length}</Typography>
        </Stack>
      </Stack>

      <CustomRightDrawer ref={modalRef} title={"Ward"} subTitle={""}>
        <StaffWard
          wardId={id}
          closeModal={() => modalRef?.current?.handleToggle()}
        />
      </CustomRightDrawer>
    </>
  );
};
function StaffWards() {
  const [currentPage, setCurrentPage] = React.useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  //get wards
  const { isLoading, data } = useCustomQuery(
    GET_WARDS,
    {
      url: `/wards/get-all-wards?limit=${pageSize}&page=${currentPage}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Box>
      <Typography variant="displayLg">Staff Wards</Typography>
      {isLoading ? (
        <CustomLoader />
      ) : (
        <Grid container spacing={1} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <Paper sx={{ p: 2 }}>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={2}
              >
                <Typography>Total Number of Wards</Typography>
                <Typography variant="displayLg">
                  {data?.data?.totalWards || 0}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} lg={9}>
            <Paper sx={{ p: 2 }}>
              <Stack
                direction="column"
                alignItems="start"
                justifyContent="start"
                spacing={0.5}
              >
                <Typography variant="displayMd">Ward Overview</Typography>
              </Stack>
              <Grid container spacing={1} sx={{ mt: 2 }}>
                {data?.data?.wards?.map((card, i) => (
                  <Grid key={card._id} item xs={12} sm={4}>
                    <OverviewCard card={card} i={i + 1} />
                  </Grid>
                ))}
                <Box sx={{ p: { xs: 0, sm: 2 } }}>
                  <Pagination
                    currentPage={currentPage}
                    totalCount={data?.data?.totalWards || 5}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                  />
                </Box>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default StaffWards;
