import React from "react";
import VitalSignsTable from "../tabels/visitDetails/VitalSignsTable";
import DetailsWrapper from "./DetailsWrapper";

function VitalSigns({ data }) {
  return <DetailsWrapper data={data} table={"vitalSigns"} />;
}

export default VitalSigns;
