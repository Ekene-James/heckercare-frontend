import { Box } from "@mui/material";
import React from "react";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import CustomAccordion from "components/atoms/CustomAccordion";
import moment from "moment";
import VitalSignsTable from "../tabels/visitDetails/VitalSignsTable";
import AllergiesTable from "../tabels/visitDetails/AllergiesTable";
import DoctorsNoteTable from "../tabels/visitDetails/DoctorsNoteTable";
import InvestigationsTable from "../tabels/visitDetails/InvestigationsTable";
import PrescriptionTable from "../tabels/visitDetails/PrescriptionsTable";
import RadiologyTable from "../tabels/visitDetails/RadiologyTable";

const TableObj = {
  vitalSigns: VitalSignsTable,
  allergies: AllergiesTable,
  doctorsNote: DoctorsNoteTable,
  investigations: InvestigationsTable,
  prescription: PrescriptionTable,
  radiology: RadiologyTable,
  // recommendation: RecommendationTable,
};
function DetailsWrapper({ table, data }) {
  /**
  data would look like 
  {
    2023-01-16: (5) [{…}, {…}, {…}, {…}, {…}]
  2023-01-17: (14) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]

  }

 */
  return (
    <Box sx={{ border: "1px solid rgba(0,0,0,0.3)" }}>
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid rgba(0,0,0,0.3)",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Recent Updates
        <SwapVertOutlinedIcon />
      </Box>
      <Box
        sx={{
          p: {
            xs: 0,
            sm: 2,
          },
        }}
      >
        {Object.keys(data)?.length
          ? Object.keys(data)?.map((day) => (
              <CustomAccordion
                key={day}
                item={{
                  title: moment(day).format("MMMM Do YYYY"),
                  detailsComponent: React.createElement(TableObj[table], {
                    data: data[day],
                  }),
                  changeOnExpanded: true,
                  bgColor: "background.light",
                }}
              />
            ))
          : null}
      </Box>
    </Box>
  );
}

export default DetailsWrapper;
