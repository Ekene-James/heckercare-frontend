import CustomModal from "components/atoms/CustomModal";
import React from "react";

import DoctorsNoteTable from "../tabels/visitDetails/DoctorsNoteTable";

import DetailsWrapper from "./DetailsWrapper";
import ModalContent from "./ModalContent";
import { grey } from "@mui/material/colors";

function DoctorsNote({ data }) {
  return <DetailsWrapper table={"doctorsNote"} data={data} />;
}

export default DoctorsNote;
//   <DetailsWrapper table={<DoctorsNoteTable handleClick={handleClick} />} />
