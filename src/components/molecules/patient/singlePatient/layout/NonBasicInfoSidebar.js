import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import { useNavigate, useParams } from "react-router-dom";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
import moment from "moment";
import {
  GET_PATIENT,
  GET_PATIENT_RECENT_VISIT,
  GET_PATIENT_RECENT_VISIT_ITEM,
  GET_PATIENT_VISITS,
  GET_SAMPLE_STANDARDS,
} from "utils/reactQueryKeys";
import { useTabCtx } from "store/contextStore/treatmentTab/TabStore";
import { setcurrentTab } from "store/contextStore/treatmentTab/TabAction";
import BasicvitalsText from "components/atoms/BasicvitalsText";
import VitalsCard from "components/atoms/VitalsCard";
import { useQueryClient } from "react-query";

const ProfileInfo = ({ data }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { dispatch } = useTabCtx();
  const { id } = useParams();
  const patient = queryClient.getQueryData([GET_PATIENT, id]);
  //get recent visits
  const { data: recentVisit } = useCustomQuery(
    [GET_PATIENT_RECENT_VISIT, id],
    {
      url: `/visit/recent/${id}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const handleEditVitals = () => {
    dispatch(setcurrentTab(1));
    navigate(`/home/patient/treatments/${id}`);
  };
  const handleOpenRecentNotes = () => {
    dispatch(setcurrentTab(7));
    navigate(`/home/patient/treatments/${id}`);
  };
  return (
    <Stack
      direction={"column"}
      sx={{
        width: {
          xs: "100%",
          sm: "50%",
          lg: "100%",
        },
      }}
    >
      <Paper
        sx={{
          padding: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: {
            xs: "100%",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            color: "gray",
            mb: 4,
          }}
        >
          <FiberManualRecordIcon fontSize="small" />
          <Typography
            sx={{ fontSize: "11px", ml: 1 }}
            variant="body"
            textTransform={"capitalize"}
          >
            {data?.admissionStatus}
          </Typography>
        </Box>
        <img
          src={
            patient?.data?.patientImage ||
            "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"
          }
          width="70px"
          height={"70px"}
          alt="img"
        />
        <Typography sx={{}} variant="heading" textTransform={"capitalize"}>
          {`${data?.firstName} ${data?.middleName} ${data?.lastName}`}
        </Typography>
        <Typography sx={{ color: "gray" }} variant="caption">
          {data?.ID} |{" "}
          {data?.dateOfBirth
            ? `${
                moment(new Date(data?.dateOfBirth), "MM/DD/YYYY")
                  .fromNow()
                  .split(" ")[0]
              }Y/`
            : ""}
          {data?.gender}
        </Typography>
        <div
          style={{ display: "flex", alignItems: "center", margin: "4px 0px" }}
        >
          <LocalPhoneIcon fontSize={"small"} />{" "}
          <Typography sx={{ ml: 1 }} variant="caption">
            {data?.phoneNumber}
          </Typography>
        </div>
        <Typography sx={{ ml: 1 }} variant="caption">
          {data?.email}
        </Typography>
        <Button
          sx={{
            color: "text.primary",
            fontWeight: "bold",
            fontSize: "11px",
            m: 2,
          }}
          variant="text"
          onClick={() => navigate(`/home/patient/basic-information/${id}`)}
        >
          See Full Profile <ArrowRightAltIcon fontSize={"small"} />
        </Button>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {recentVisit?.data ? (
            <>
              <Typography sx={{ color: "gray" }} variant="caption">
                Last Visit
              </Typography>
              {recentVisit?.data?.status === "ACTIVE" ? (
                "Still Active"
              ) : (
                <Typography sx={{ fontWeight: "bold" }} variant="caption">
                  {moment(new Date(recentVisit?.data?.endedAt)).format(
                    "MMMM d, YYYY"
                  )}
                </Typography>
              )}
            </>
          ) : null}
        </Box>
        <Button
          sx={{ fontSize: "11px", mt: 5 }}
          variant="contained"
          fullWidth
          color="secondary"
          onClick={handleOpenRecentNotes}
        >
          Open Recent Notes
        </Button>
      </Paper>
      <Box
        sx={{
          width: {
            xs: "100%",
          },
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mt: 2,
          mb: 2,
        }}
      >
        <IconButton
          size="small"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleEditVitals}
          color="inherit"
        >
          <BorderColorIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ ml: 2 }} variant="caption">
          Edit Vitals
        </Typography>
      </Box>
    </Stack>
  );
};
function NonBasicInfoSidebar() {
  const { id } = useParams();

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

  //get recent visit item
  const {
    data: visitItem,
    isLoading,
    isSuccess: isVisitSuccess,
  } = useCustomQuery(
    [GET_PATIENT_RECENT_VISIT_ITEM, id],
    {
      url: `/visit/recent/item/${id}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  //get vitals range
  const {
    data: ranges,
    isLoading: isStandardsLoading,
    isError: isStandardsError,
    isSuccess: isRangeSuccess,
  } = useCustomQuery(
    [GET_SAMPLE_STANDARDS],
    {
      url: `/visit/item/vital-signs/settings`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (res) => {
        return res.data;
      },
    }
  );

  return (
    <>
      {getPatientLoading ? (
        <CustomLoader />
      ) : (
        <Stack
          direction={{
            xs: "column",
          }}
          spacing={1}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
              lg: "column",
            }}
            spacing={1}
          >
            <ProfileInfo data={patient?.data} />

            <Paper
              sx={{
                padding: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: {
                  xs: "100%",
                  sm: "50%",
                  lg: "100%",
                },
              }}
            >
              <Typography sx={{ color: "gray" }} variant="h6">
                Basic Vitals
              </Typography>
              <BasicvitalsText desc="Genotype" text={patient?.data?.genotype} />
              <BasicvitalsText
                desc="Blood Group"
                text={patient?.data?.bloodGroup}
              />
              <BasicvitalsText
                desc="Height"
                text={`${visitItem?.data?.visitItem?.vitalSigns?.height || 0}${
                  ranges?.["height"]?.["unit"] || "cm"
                }`}
              />
              <BasicvitalsText
                desc="Weight"
                text={`${visitItem?.data?.visitItem?.vitalSigns?.weight || 0}${
                  ranges?.["weight"]?.["unit"] || "kg"
                }`}
              />
              <BasicvitalsText
                desc="Allergies"
                text={visitItem?.data?.visitItem?.allergies?.map(
                  (allergy) => `${allergy.allergen} (${allergy.level})`
                )}
              />
            </Paper>
          </Stack>
          <Grid container spacing={1} sx={{ marginTop: 2 }}>
            <Grid item xs={6} sm={4} lg={6}>
              <VitalsCard
                desc="Heart Rate"
                number={visitItem?.data?.visitItem?.vitalSigns?.heartRate || 0}
                unit={`bpm`}
                // unit={`${ranges?.["heartRate"]?.["unit"] || "bpm"}`}
                min={+ranges?.["heartRate"]?.["normal"]?.["min"] || 0}
                max={+ranges?.["heartRate"]?.["normal"]?.["max"] || 0}
              />
            </Grid>
            <Grid item xs={6} sm={4} lg={6}>
              <VitalsCard
                desc="Pressure"
                number={`${
                  visitItem?.data?.visitItem?.vitalSigns
                    ?.systolicBloodPressure || 0
                } / ${
                  visitItem?.data?.visitItem?.vitalSigns
                    ?.diastolicBloodPressure || 0
                }`}
                unit={`${
                  ranges?.["diastolicBloodPressure"]?.["unit"] || "mmHg"
                }`}
                min={0}
                max={1}
                bottomColor="black"
              />
            </Grid>
            <Grid item xs={6} sm={4} lg={6}>
              <VitalsCard
                desc="Temperature"
                number={
                  visitItem?.data?.visitItem?.vitalSigns?.temperature || 0
                }
                unit={`${ranges?.["temperature"]?.["unit"] || "oC"}`}
                min={+ranges?.["temperature"]?.["normal"]?.["min"] || 0}
                max={+ranges?.["temperature"]?.["normal"]?.["max"] || 0}
                bottomColor="blue"
              />
            </Grid>
            <Grid item xs={6} sm={4} lg={6}>
              <VitalsCard
                desc="Glucose Level"
                number={visitItem?.data?.visitItem?.vitalSigns?.glucose || 0}
                unit={`${ranges?.["glucose"]?.["unit"] || "mg/dL"}`}
                min={+ranges?.["glucose"]?.["normal"]?.["min"] || 0}
                max={+ranges?.["glucose"]?.["normal"]?.["max"] || 0}
                bottomColor="gray"
              />
            </Grid>
          </Grid>
        </Stack>
      )}
    </>
  );
}

export default NonBasicInfoSidebar;
