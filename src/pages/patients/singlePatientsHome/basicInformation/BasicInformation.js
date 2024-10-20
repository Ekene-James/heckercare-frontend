import {
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

import AccessTimeIcon from "@mui/icons-material/AccessTime";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";

import { useParams } from "react-router-dom";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
import EmailIcon from "@mui/icons-material/Email";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import moment from "moment";
import { GET_PATIENT } from "utils/reactQueryKeys";
import TwoItemsCard from "components/molecules/patient/singlePatient/layout/TwoItemsCard";
import CaptionWithDivider from "components/atoms/CaptionWithDivider";
import InnerTopBar from "components/molecules/patient/singlePatient/layout/InnerTopBar";
import CustomSwitch from "components/atoms/Switch";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
function BasicInformation() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  //get patient
  const { data: patient, isLoading: getPatientLoading } = useCustomQuery(
    [GET_PATIENT, id],
    {
      url: `/patients/get-patient/${id}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  //edit patient
  const { mutate: handleEditPatient, isLoading: editPatientLoading } =
    useCustomMutation(
      {
        url: `/patients/update-patient/${id}`,
        method: "patch",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_PATIENT, id]);
          toast.success("Success");
        },

        onError: (error) => {
          if (Array.isArray(error.message)) {
            return error.message.map((msg) => toast.error(msg));
          }
          return toast.error(error.message);
        },
      }
    );

  const handleCheck = (checkState) => {
    handleEditPatient({ paymentRequired: String(checkState) });
  };
  return (
    <Container sx={{ p: "0px !important" }}>
      <InnerTopBar status={patient?.data?.admissionStatus} />

      {getPatientLoading ? (
        <CustomLoader />
      ) : (
        <>
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
                textTransform: "capitalize",
              }}
            >
              {`${patient?.data?.firstName} ${patient?.data?.middleName} ${patient?.data?.lastName}`}
            </Typography>

            <Grid container spacing={1} sx={{ marginTop: 2 }}>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard flexDirection="row">
                  <AccessTimeIcon sx={{ mr: 1 }} />
                  <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                    {moment(patient?.data?.createdAt).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard flexDirection="row">
                  <PersonOutlineIcon sx={{ mr: 1 }} />
                  <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                    {patient?.data?.occupation}
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
                    {patient?.data?.ID}
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
                    {patient?.data?.phoneNumber}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard flexDirection="row">
                  <EmailIcon sx={{ fontWeight: "bold" }} />

                  <Typography sx={{ ml: 2 }} variant="caption">
                    {patient?.data?.email}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard flexDirection="row">
                  <MedicalServicesIcon sx={{ fontWeight: "bold" }} />

                  <Typography sx={{ ml: 2 }} variant="caption">
                    {patient?.data?.admissionStatus}
                  </Typography>
                </TwoItemsCard>
              </Grid>
            </Grid>

            <Stack direction={"row"} spacing={1} alignItems={"start"} mt={3}>
              <CustomSwitch
                color={"secondary"}
                handleCheck={handleCheck}
                initialState={patient?.data?.paymentRequired}
                disabled={editPatientLoading}
              />
              <Stack direction={"column"} spacing={0.5}>
                <Typography
                  fontWeight={"bold"}
                  sx={{ fontSize: "16px", lineHeight: "22.4px" }}
                >
                  Pre-payment Required
                </Typography>
                <Typography sx={{ fontSize: "14px", lineHeight: "19.6px" }}>
                  Payment must be made before any service can be initiated.
                </Typography>
              </Stack>
            </Stack>
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
                    {patient?.data?.gender}
                  </Typography>
                </TwoItemsCard>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Date of Birth</Typography>
                  <Typography variant="caption">
                    {" "}
                    {moment(patient?.data?.dateOfBirth).format("MMMM Do YYYY")}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Blood Group</Typography>
                  <Typography variant="caption">
                    {patient?.data?.bloodGroup}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Registered Email</Typography>
                  <Typography variant="caption">
                    {patient?.data?.email}
                  </Typography>
                </TwoItemsCard>
              </Grid>
            </Grid>
          </Paper>
          {/* Residential address */}

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
                    {patient?.data?.residentialAddress?.address}
                  </Typography>
                </TwoItemsCard>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">City</Typography>
                  <Typography variant="caption">
                    {patient?.data?.residentialAddress?.city}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">State</Typography>
                  <Typography variant="caption">
                    {patient?.data?.residentialAddress?.state}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Country</Typography>
                  <Typography variant="caption">
                    {patient?.data?.residentialAddress?.country}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Zip Code</Typography>
                  <Typography variant="caption">
                    {patient?.data?.residentialAddress?.zipCode}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Telephone</Typography>
                  <Typography variant="caption">
                    {patient?.data?.residentialAddress?.telephone}
                  </Typography>
                </TwoItemsCard>
              </Grid>
            </Grid>
          </Paper>
          {/* Permanent address */}

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
                    {patient?.data?.permanentAddress?.address}
                  </Typography>
                </TwoItemsCard>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">City</Typography>
                  <Typography variant="caption">
                    {patient?.data?.permanentAddress?.city}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">State</Typography>
                  <Typography variant="caption">
                    {patient?.data?.permanentAddress?.state}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Country</Typography>
                  <Typography variant="caption">
                    {patient?.data?.permanentAddress?.country}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Zip Code</Typography>
                  <Typography variant="caption">
                    {patient?.data?.permanentAddress?.zipCode}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Telephone</Typography>
                  <Typography variant="caption">
                    {patient?.data?.permanentAddress?.telephone}
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
                  <Typography variant="h6">Name</Typography>
                  <Typography variant="caption" textTransform={"capitalize"}>
                    {" "}
                    {`${patient?.data?.nextOfKin?.firstName} ${patient?.data?.nextOfKin?.middleName} ${patient?.data?.nextOfKin?.lastName}`}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Relationship</Typography>
                  <Typography variant="caption">
                    {patient?.data?.nextOfKin?.relationship}
                  </Typography>
                </TwoItemsCard>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Date of Birth</Typography>
                  <Typography variant="caption">
                    {moment(patient?.data?.nextOfKin?.dateOfBirth).format(
                      "MMMM Do YYYY"
                    )}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Registered Email</Typography>
                  <Typography variant="caption">
                    {patient?.data?.nextOfKin?.email}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Address</Typography>
                  <Typography variant="caption">
                    {patient?.data?.nextOfKin?.address}
                  </Typography>
                </TwoItemsCard>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">City</Typography>
                  <Typography variant="caption">
                    {patient?.data?.nextOfKin?.city}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">State</Typography>
                  <Typography variant="caption">
                    {patient?.data?.nextOfKin?.state}
                  </Typography>
                </TwoItemsCard>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Zip Code</Typography>
                  <Typography variant="caption">
                    {patient?.data?.nextOfKin?.zipCode}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Country</Typography>
                  <Typography variant="caption">
                    {patient?.data?.nextOfKin?.country}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Marital Status</Typography>
                  <Typography variant="caption">
                    {patient?.data?.nextOfKin?.maritalStatus}
                  </Typography>
                </TwoItemsCard>
              </Grid>
            </Grid>
          </Paper>
          {/* Payer Details */}

          <Paper
            sx={{ marginTop: 2, marginBottom: 2, padding: 2 }}
            id="payerDetails"
          >
            <CaptionWithDivider caption="Payer Details" />

            <Grid container spacing={1} sx={{ marginTop: 2 }}>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Name</Typography>
                  <Typography variant="caption" textTransform={"capitalize"}>
                    {" "}
                    {`${patient?.data?.payerDetails?.firstName} ${patient?.data?.payerDetails?.middleName} ${patient?.data?.payerDetails?.lastName}`}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Relationship</Typography>
                  <Typography variant="caption">
                    {patient?.data?.payerDetails?.relationship}
                  </Typography>
                </TwoItemsCard>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Date of Birth</Typography>
                  <Typography variant="caption">
                    {moment(patient?.data?.payerDetails?.dateOfBirth).format(
                      "MMMM Do YYYY"
                    )}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Registered Email</Typography>
                  <Typography variant="caption">
                    {patient?.data?.payerDetails?.email}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Address</Typography>
                  <Typography variant="caption">
                    {patient?.data?.payerDetails?.address}
                  </Typography>
                </TwoItemsCard>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">City</Typography>
                  <Typography variant="caption">
                    {patient?.data?.payerDetails?.city}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">State</Typography>
                  <Typography variant="caption">
                    {patient?.data?.payerDetails?.state}
                  </Typography>
                </TwoItemsCard>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Zip Code</Typography>
                  <Typography variant="caption">
                    {patient?.data?.payerDetails?.zipCode}
                  </Typography>
                </TwoItemsCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TwoItemsCard>
                  <Typography variant="h6">Country</Typography>
                  <Typography variant="caption">
                    {patient?.data?.payerDetails?.country}
                  </Typography>
                </TwoItemsCard>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </Container>
  );
}

export default BasicInformation;
