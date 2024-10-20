import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CustomTextInput from "components/atoms/CustomTextInput";
import ProfileDetails from "./ProfileDetails";
import ChangeEmail from "./ChangeEmail";
import { useNavigate } from "react-router-dom";
import { useAuthCtx } from "store/contextStore/auth/AuthStore";
import { logout } from "store/contextStore/auth/AuthActions";
import HospitalDetails from "./HospitalDetails";
import CustomModal from "components/atoms/CustomModal";
import HospitalDetailsModal from "./HospitalDetailsModal";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_HOSPITAL_DETAILS } from "utils/reactQueryKeys";
import CustomLoader from "components/atoms/CustomLoader";
function Profile() {
  const navigate = useNavigate();
  const modalRef = React.useRef(null);
  const authCtx = useAuthCtx();
  const handleLogout = () => {
    authCtx.dispatch(logout(navigate));
  };
  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };

  //get hospital details
  const { data: hospitalDetails, isLoading } = useCustomQuery(
    [GET_HOSPITAL_DETAILS],
    {
      url: `/admin/hospital-profile`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  return (
    <>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="displayMd">My Profile</Typography>
          <Button
            startIcon={<LogoutIcon sx={{ color: "rgba(219, 30, 54, 1)" }} />}
            variant="outlined"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
        <Grid container spacing={1}>
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                mt: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ProfileDetails />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                mt: 2,
                display: "flex",
                flexDirection: "column",
                minHeight: {
                  xs: "auto",
                  md: "139.5vh",
                },
              }}
            >
              {isLoading ? (
                <CustomLoader />
              ) : (
                <HospitalDetails
                  toggleModal={toggleModal}
                  hospitalDetails={
                    hospitalDetails?.data?.length
                      ? hospitalDetails?.data[hospitalDetails?.data?.length - 1]
                      : {}
                  }
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <CustomModal
        ref={modalRef}
        childrenContSx={{
          width: {
            xs: "90%",
            sm: "60%",
          },
          p: {
            xs: 3,
            sm: 5,
          },
        }}
      >
        <HospitalDetailsModal
          closeModal={toggleModal}
          hospitalDetails={
            hospitalDetails?.data?.length
              ? hospitalDetails?.data[hospitalDetails?.data?.length - 1]
              : {}
          }
        />
      </CustomModal>
    </>
  );
}

export default Profile;
