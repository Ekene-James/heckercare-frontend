import { Box, Typography } from "@mui/material";
import React from "react";
import TreatmentsTab from "../../../../components/molecules/patient/singlePatient/treatmentTab/TreatmentsTab";

function Treatments() {
  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          textAlign: "start",
          mt: 2,
          mb: 2,
        }}
      >
        Treatment
      </Typography>
      <TreatmentsTab />
    </Box>
  );
}

export default Treatments;
