import { Box, Paper, Typography } from "@mui/material";
import BackButton from "components/atoms/BackButton";

import CustomTab from "components/atoms/CustomTab";
import React from "react";
import { useParams } from "react-router-dom";
import VitalSigns from "components/molecules/visitDetailsTab/VitalSigns";
import Allergies from "components/molecules/visitDetailsTab/Allergies";
import DoctorsNote from "components/molecules/visitDetailsTab/DoctorsNote";

import Investigations from "components/molecules/visitDetailsTab/Investigations";
import Radiology from "components/molecules/visitDetailsTab/Radiology";
import Prescriptions from "components/molecules/visitDetailsTab/Prescriptions";
import Recommendation from "components/molecules/visitDetailsTab/Recommendation";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_SINGLE_VISIT } from "utils/reactQueryKeys";
import moment from "moment";
import CustomLoader from "components/atoms/CustomLoader";
import { groupBy } from "utils/groupByFunc";
import AssesmentLog from "components/molecules/patient/singlePatient/treatmentTab/assesmentLog/AssesmentLog";
import Package from "components/molecules/patient/singlePatient/treatmentTab/Package";

const navItems = [
  {
    label: "Vital Signs",

    id: 0,
  },
  {
    label: "Allergies",

    id: 1,
  },
  {
    label: "Packages",

    id: 2,
  },
  {
    label: "Doc's Note",

    id: 3,
  },
  {
    label: "Assessment Log",

    id: 4,
  },
  {
    label: "Investigations",

    id: 5,
  },
  {
    label: "Prescription",

    id: 6,
  },
  {
    label: "Radiology",

    id: 7,
  },
  {
    label: "Recommendation",

    id: 8,
  },
];
const groupDataByDays = (details) => {
  if (!details?.length) return {};
  const removeTimeFromCreatedAt = details.map((detail) => ({
    ...detail,
    createdAt: detail.createdAt.split("T")[0],
  }));
  const groupByCreatedAt = groupBy(removeTimeFromCreatedAt, "createdAt");
  return groupByCreatedAt;
};
function VisitDetails() {
  const [value, setvalue] = React.useState(0);
  const { patientId, visitId } = useParams();

  //get single visit
  const { data: visit, isLoading } = useCustomQuery(
    [GET_SINGLE_VISIT, visitId],
    {
      url: `/visit/${visitId}`,
      method: "get",
      avoidCancelling: true,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  let view;
  switch (value) {
    case 0:
      view = <VitalSigns data={groupDataByDays(visit?.data?.visitDetails)} />;
      break;
    case 1:
      view = <Allergies data={groupDataByDays(visit?.data?.visitDetails)} />;
      break;
    case 2:
      view = <Package patientId={patientId} />;
      break;
    case 3:
      view = <DoctorsNote data={groupDataByDays(visit?.data?.assessmentLog)} />;
      break;
    case 4:
      view = (
        <AssesmentLog
          showCommentField={false}
          assesmentLogs={visit?.data?.assessmentLog}
        />
      );
      break;
    case 5:
      view = (
        <Investigations data={groupDataByDays(visit?.data?.visitDetails)} />
      );
      break;
    case 6:
      view = (
        <Prescriptions data={groupDataByDays(visit?.data?.visitDetails)} />
      );
      break;
    case 7:
      view = <Radiology data={groupDataByDays(visit?.data?.visitDetails)} />;
      break;
    case 8:
      view = <Recommendation data={visit?.data?.recommendation} />;
      break;

    default:
      break;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <BackButton />

      <CustomTab navItems={navItems} value={value} setValue={setvalue} />

      {isLoading ? (
        <CustomLoader />
      ) : (
        <>
          {value !== 4 && Object.keys(visit?.data)?.length && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: {
                  xs: "100%",
                  sm: "90%",
                },
                margin: "auto",
                mt: 2,
                mb: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box sx={{ display: "flex" }}>
                <Typography sx={{ fontWeight: "bold", mr: 1 }}>
                  Visit Id:
                </Typography>
                {visit?.data?.visitID}
              </Box>
              <Box sx={{ display: "flex" }}>
                <Typography sx={{ fontWeight: "bold", mr: 1 }}>
                  Starting Date:
                </Typography>
                {moment(visit?.data?.createdAt).format("MMMM Do YYYY")}
              </Box>
              <Box sx={{ display: "flex" }}>
                <Typography sx={{ fontWeight: "bold", mr: 1 }}>
                  End Date:
                </Typography>
                {visit?.data?.status === "ENDED"
                  ? moment(visit?.data?.endedAt).format("MMMM Do YYYY")
                  : "Still Active"}
              </Box>
            </Box>
          )}
          <Box
            sx={{
              p: {
                xs: 0,
                sm: 3,
              },
            }}
          >
            {view}
          </Box>
        </>
      )}
    </Paper>
  );
}

export default VisitDetails;
