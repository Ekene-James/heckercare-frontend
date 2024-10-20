import { Box, Stack, Typography } from "@mui/material";
import CustomLoader from "components/atoms/CustomLoader";
import AllergiesTable from "components/molecules/tabels/visitDetails/AllergiesTable";
import VitalSignsTable from "components/molecules/tabels/visitDetails/VitalSignsTable";
import InvestigationsTable from "components/molecules/tabels/visitDetails/InvestigationsTable";
import React from "react";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";

import { GET_SINGLE_VISIT } from "utils/reactQueryKeys";
import Package from "./VisitPackage";
import DoctorsNoteTable from "components/molecules/tabels/visitDetails/DoctorsNoteTable";
import CustomModal from "components/atoms/CustomModal";
import AssesmentLog from "../treatmentTab/assesmentLog/AssesmentLog";
import RadiologyTable from "components/molecules/tabels/visitDetails/RadiologyTable";
import PrescriptionTable from "components/molecules/tabels/visitDetails/PrescriptionsTable";
import Recommendation from "components/molecules/visitDetailsTab/Recommendation";

const VitalSigns = ({ details }) => {
  return (
    <Stack gap={2}>
      <Box
        sx={{
          bgcolor: "primary.gray",
          p: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "800",
            fontSize: "20px",
          }}
        >
          Vital Signs
        </Typography>
      </Box>
      <VitalSignsTable data={details?.data?.visitDetails} fromSummary />
    </Stack>
  );
};
const Allergies = ({ details }) => {
  return (
    <Stack gap={2}>
      <Box
        sx={{
          bgcolor: "primary.gray",
          p: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "800",
            fontSize: "20px",
          }}
        >
          Allergies
        </Typography>
      </Box>
      <AllergiesTable data={details?.data?.visitDetails} fromSummary />
    </Stack>
  );
};
const DocsNote = ({ details }) => {
  return (
    <Stack gap={2}>
      <Box
        sx={{
          bgcolor: "primary.gray",
          p: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "800",
            fontSize: "20px",
          }}
        >
          Doctor's Note
        </Typography>
      </Box>
      <DoctorsNoteTable data={details?.data?.assessmentLog} fromSummary />
    </Stack>
  );
};
const AssessmentLog = ({ details }) => {
  const modalRef = React.useRef(null);
  const toggleModal = (id) => {
    modalRef?.current?.handleToggle();
  };
  return (
    <>
      <Stack gap={2}>
        <Box
          sx={{
            bgcolor: "primary.gray",
            p: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "800",
              fontSize: "20px",
            }}
          >
            Assessment Log
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "700",
            fontSize: "16px",
            color: "#6956E5",
            cursor: "pointer",
          }}
          onClick={toggleModal}
        >
          View Log Details
        </Typography>
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          pt: 5,
          height: "fit-content !important",
          width: {
            xs: "80vw",
            sm: "60vw",
          },
        }}
      >
        <AssesmentLog
          showCommentField={false}
          assesmentLogs={details?.data?.assessmentLog}
        />
      </CustomModal>
    </>
  );
};
const Investigations = ({ details }) => {
  return (
    <Stack gap={2}>
      <Box
        sx={{
          bgcolor: "primary.gray",
          p: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "800",
            fontSize: "20px",
          }}
        >
          Investigations
        </Typography>
      </Box>
      <InvestigationsTable data={details?.data?.visitDetails} fromSummary />
    </Stack>
  );
};
const Radiology = ({ details }) => {
  return (
    <Stack gap={2}>
      <Box
        sx={{
          bgcolor: "primary.gray",
          p: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "800",
            fontSize: "20px",
          }}
        >
          Radiology
        </Typography>
      </Box>
      <RadiologyTable data={details?.data?.visitDetails} fromSummary />
    </Stack>
  );
};
const VisitRecommendation = ({ details }) => {
  return (
    <Stack gap={2}>
      <Box
        sx={{
          bgcolor: "primary.gray",
          p: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "800",
            fontSize: "20px",
          }}
        >
          Recommendation
        </Typography>
      </Box>
      <Recommendation data={details?.data?.recommendation} fromSummary />
    </Stack>
  );
};
const Prescription = ({ details }) => {
  return (
    <Stack gap={2}>
      <Box
        sx={{
          bgcolor: "primary.gray",
          p: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "800",
            fontSize: "20px",
          }}
        >
          Prescription
        </Typography>
      </Box>
      <PrescriptionTable data={details?.data?.visitDetails} fromSummary />
    </Stack>
  );
};

function VisitSummaryModal({ visitId }) {
  //get single visit
  const {
    data: visit,
    isLoading,
    isError,
  } = useCustomQuery(
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

  return (
    <>
      {isLoading ? (
        <CustomLoader />
      ) : isError ? (
        <Typography sx={{ fontWeight: "bold", mr: 1 }}>
          Something went wrong please refresh
        </Typography>
      ) : (
        <Stack gap={4}>
          <VitalSigns details={visit} />
          <Allergies details={visit} />
          <Package />
          <DocsNote details={visit} />
          <AssessmentLog details={visit} />
          <Investigations details={visit} />
          <Radiology details={visit} />
          <Prescription details={visit} />
          <VisitRecommendation details={visit} />
        </Stack>
      )}
    </>
  );
}

export default VisitSummaryModal;
