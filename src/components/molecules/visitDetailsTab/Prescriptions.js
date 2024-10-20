import { grey } from "@mui/material/colors";
import CustomModal from "components/atoms/CustomModal";
import React from "react";

import PrescriptionTable from "../tabels/visitDetails/PrescriptionsTable";

import DetailsWrapper from "./DetailsWrapper";

function Prescriptions({ data }) {
  return <DetailsWrapper table={"prescription"} data={data} />;
}

export default Prescriptions;
