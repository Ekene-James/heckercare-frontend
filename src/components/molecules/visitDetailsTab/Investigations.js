import { grey } from "@mui/material/colors";
import CustomModal from "components/atoms/CustomModal";
import React from "react";

import InvestigationsTable from "../tabels/visitDetails/InvestigationsTable";

import DetailsWrapper from "./DetailsWrapper";
import ModalContent from "./ModalContent";

function Investigations({ data }) {
  return <DetailsWrapper table={"investigations"} data={data} />;
}

export default Investigations;
