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

import CreateClinic from "components/molecules/department/modalContents/CreateClinic";
import { GET_CLINICS } from "utils/reactQueryKeys";

const OverviewCard = ({
  card: { id, name, headOfClinic = "No HOD name", staff = [], department },
  i,
}) => {
  const navigate = useNavigate();

  return (
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
          onClick={() => navigate(`/home/department/clinic/${id}`)}
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

      <Stack
        direction="column"
        alignItems="start"
        justifyContent="start"
        spacing={0.5}
      >
        <Typography sx={{ color: "primary.lightGrey" }}>Department</Typography>
        <Typography sx={{ fontWeight: "bold" }}>{department?.name}</Typography>
      </Stack>
      <Stack
        direction="column"
        alignItems="start"
        justifyContent="start"
        spacing={0.5}
      >
        <Typography sx={{ color: "primary.lightGrey" }}>
          Head of Clinic
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          {headOfClinic?.fullName}
        </Typography>
      </Stack>
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
  );
};
function ClinicOverview() {
  const modalRef = React.useRef(null);
  const { isLoading, data, refetch } = useCustomQuery(
    GET_CLINICS,
    {
      url: `/clinic`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const closeModal = (willRefetch) => {
    if (willRefetch) refetch();

    modalRef?.current?.handleToggle();
  };
  return (
    <Box>
      <Typography variant="displayLg">Clinics</Typography>
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
                <Typography>Total Number of Units</Typography>
                <Typography variant="displayLg">
                  {data?.data?.length}
                </Typography>
                <Button
                  color="secondary"
                  size="big"
                  sx={{
                    backgroundColor: "#ECF0FF",
                    fontWeight: "bold",
                    pl: 2,
                    pr: 2,
                  }}
                  onClick={() => modalRef?.current?.handleToggle()}
                >
                  Create New
                </Button>
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
                <Typography variant="displayMd">Clinic Overview</Typography>
              </Stack>
              <Grid container spacing={1} sx={{ mt: 2 }}>
                {data?.data?.map((card, i) => (
                  <Grid key={card.id} item xs={12} sm={4}>
                    <OverviewCard card={card} i={i + 1} />
                  </Grid>
                ))}
              </Grid>
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
            lg: "50vw",
          },
        }}
        ariaLabel="create-unit-modal"
      >
        <CreateClinic handleClose={closeModal} />
      </CustomModal>
    </Box>
  );
}

export default ClinicOverview;
