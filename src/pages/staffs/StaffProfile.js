import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import CaptionWithDivider from "components/atoms/CaptionWithDivider";
import BasicInfoSidebar from "components/molecules/patient/singlePatient/layout/BasicInfoSidebar";

import React from "react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
import moment from "moment";
import { GET_STAFF } from "utils/reactQueryKeys";
import TwoItemsCard from "components/molecules/patient/singlePatient/layout/TwoItemsCard";
import InnerTopBar from "components/molecules/patient/singlePatient/layout/InnerTopBar";

function StaffProfile() {
  let { id } = useParams();
  const navigate = useNavigate();
  //get single staff
  const { isLoading, data, refetch } = useCustomQuery(
    [GET_STAFF, id],
    {
      url: `/user/get-single-staff/${id}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  return (
    <>
      {isLoading ? (
        <CustomLoader />
      ) : data?.data ? (
        <Grid container spacing={1} sx={{ marginTop: 2 }}>
          <Grid item xs={12} lg={3}>
            <BasicInfoSidebar />
          </Grid>
          <Grid item xs={12} lg={9}>
            <Container sx={{ p: "0px !important" }}>
              <InnerTopBar
                showDischargeBtn={false}
                status={data?.data?.accountStatus}
                editBtn={
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ fontSize: "10px" }}
                    onClick={() => navigate(`/home/staff/edit/${id}`)}
                  >
                    Edit Profile
                  </Button>
                }
              />
              {/* Summary */}
              <Paper
                sx={{ marginTop: 2, marginBottom: 2, padding: 2 }}
                id="summary"
              >
                <CaptionWithDivider caption="Summary" />
                <Typography
                  variant="displaySm"
                  gutterBottom
                  sx={{
                    textAlign: "start",
                    marginTop: 3,
                  }}
                >
                  {data.data.fullName}
                </Typography>

                <Grid container spacing={1} sx={{ marginTop: 2 }}>
                  <Grid item xs={12} sm={5}>
                    <TwoItemsCard flexDirection="row">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          m: 0,
                          mr: 1,
                        }}
                      >
                        <AccessTimeIcon sx={{ mr: 1 }} />
                        <small>Joined</small>
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                        {moment(data.data.createdAt).format("MMMM Do YYYY")}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TwoItemsCard flexDirection="row">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          m: 0,
                          mr: 1,
                        }}
                      >
                        <PersonOutlineIcon sx={{ mr: 1 }} />
                        <small>Role</small>
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                        {data?.data?.role?.name || "Neuro Surgeon"}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard flexDirection="row">
                      <PhoneIcon sx={{ fontWeight: "bold" }} />

                      <Typography
                        sx={{ fontWeight: "bold", ml: 2 }}
                        variant="caption"
                      >
                        {data.data.phoneNumber}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard flexDirection="row">
                      <ViewStreamIcon sx={{ fontWeight: "bold" }} />

                      <Typography
                        sx={{ fontWeight: "bold", ml: 2 }}
                        variant="caption"
                      >
                        {data.data.staffId}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                </Grid>
              </Paper>
              {/* Personal details */}
              <Paper
                sx={{ marginTop: 2, marginBottom: 2, padding: 2 }}
                id="personalDetails"
              >
                <CaptionWithDivider caption="Personnal Details" />

                <Grid container spacing={1} sx={{ marginTop: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Gender</Typography>
                      <Typography variant="caption">
                        {data.data.gender}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Date of Birth</Typography>
                      <Typography variant="caption">
                        {moment(data?.data?.dateOfBirth).format("MMMM Do YYYY")}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Registered Email</Typography>
                      <Typography variant="caption">
                        {data?.data?.email}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Permanent Address</Typography>
                      <Typography variant="caption">
                        {data?.data?.permanentAddress?.address}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Residential Address</Typography>
                      <Typography variant="caption">
                        {data?.data?.residentialAddress?.address}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                </Grid>
              </Paper>
              {/* Residential Address */}

              <Paper
                sx={{ marginTop: 2, marginBottom: 2, padding: 2 }}
                id="residentialAddress"
              >
                <CaptionWithDivider caption="Residential Address" />

                <Grid container spacing={1} sx={{ marginTop: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Address</Typography>
                      <Typography variant="caption">
                        {data?.data?.residentialAddress?.address}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  {data?.data?.residentialAddress?.telephone ? (
                    <Grid item xs={12} sm={4}>
                      <TwoItemsCard>
                        <Typography variant="h6">Telephone</Typography>
                        <Typography variant="caption">
                          {data?.data?.residentialAddress?.telephone}
                        </Typography>
                      </TwoItemsCard>
                    </Grid>
                  ) : null}
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">City</Typography>
                      <Typography variant="caption">
                        {data?.data?.residentialAddress?.city}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">State</Typography>
                      <Typography variant="caption">
                        {data?.data?.residentialAddress?.state}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Country</Typography>
                      <Typography variant="caption">
                        {data?.data?.residentialAddress?.country}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Zip Code</Typography>
                      <Typography variant="caption">
                        {data?.data?.residentialAddress?.zipCode}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                </Grid>
              </Paper>
              {/* Permanent Address */}

              <Paper
                sx={{ marginTop: 2, marginBottom: 2, padding: 2 }}
                id="permanentAddress"
              >
                <CaptionWithDivider caption="Permanent Address" />

                <Grid container spacing={1} sx={{ marginTop: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Address</Typography>
                      <Typography variant="caption">
                        {data?.data?.permanentAddress?.address}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  {data?.data?.permanentAddress?.telephone ? (
                    <Grid item xs={12} sm={4}>
                      <TwoItemsCard>
                        <Typography variant="h6">Telephone</Typography>
                        <Typography variant="caption">
                          {data?.data?.permanentAddress?.telephone}
                        </Typography>
                      </TwoItemsCard>
                    </Grid>
                  ) : null}
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">City</Typography>
                      <Typography variant="caption">
                        {data?.data?.permanentAddress?.city}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">State</Typography>
                      <Typography variant="caption">
                        {data?.data?.permanentAddress?.state}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Country</Typography>
                      <Typography variant="caption">
                        {data?.data?.permanentAddress?.country}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Zip Code</Typography>
                      <Typography variant="caption">
                        {data?.data?.permanentAddress?.zipCode}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                </Grid>
              </Paper>

              {/* Next of Kin */}

              <Paper
                sx={{ marginTop: 2, marginBottom: 2, padding: 2 }}
                id="nextOfKin"
              >
                <CaptionWithDivider caption="Next Of Kin" />

                <Grid container spacing={1} sx={{ marginTop: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Full Name</Typography>
                      <Typography variant="caption">{`${data?.data?.nextOfKin?.firstName} ${data?.data?.nextOfKin?.middleName} ${data?.data?.nextOfKin?.lastName} `}</Typography>
                    </TwoItemsCard>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Registered Email</Typography>
                      <Typography variant="caption">
                        {data?.data?.nextOfKin?.email}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Phone Number</Typography>
                      <Typography variant="caption">
                        {data?.data?.nextOfKin?.phoneNumber}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Relationship</Typography>
                      <Typography variant="caption">
                        {data?.data?.nextOfKin?.relationship}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Address</Typography>
                      <Typography variant="caption">
                        {data?.data?.nextOfKin?.address}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">City</Typography>
                      <Typography variant="caption">
                        {data?.data?.nextOfKin?.city}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">State</Typography>
                      <Typography variant="caption">
                        {data?.data?.nextOfKin?.state}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Country</Typography>
                      <Typography variant="caption">
                        {data?.data?.nextOfKin?.country}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TwoItemsCard>
                      <Typography variant="h6">Zip Code</Typography>
                      <Typography variant="caption">
                        {data?.data?.nextOfKin?.zipCode}
                      </Typography>
                    </TwoItemsCard>
                  </Grid>
                </Grid>
              </Paper>
            </Container>
          </Grid>
        </Grid>
      ) : (
        "Something went wrong, cant find staff"
      )}
    </>
  );
}

export default StaffProfile;
