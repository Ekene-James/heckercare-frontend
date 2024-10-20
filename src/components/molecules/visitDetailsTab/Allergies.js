import React from "react";

import DetailsWrapper from "./DetailsWrapper";

function Allergies({ data }) {
  return <DetailsWrapper data={data} table={"allergies"} />;
}

export default Allergies;
