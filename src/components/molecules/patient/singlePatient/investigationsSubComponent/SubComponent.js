import { Paper, Stack } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomModal from "components/atoms/CustomModal";

import AccordionInvestigationTable from "components/molecules/tabels/patient/AccordionInvestigationTable";
import React, { useState } from "react";
import UploadResultModal from "./UploadResultModal";
import { exportToExcel } from "utils/exportToExcel";
import { useParams } from "react-router-dom";

const formatExportData = (data) => {
  if (!data || !data?.length) return;

  const formartted = data.map((d) => {
    return {
      ...d,
      testName: d?.test?.testName,
      testType: d?.test?.testType,
      testRate: d?.test?.rate,
      testDuration: d?.test?.duration,
      doctor: d?.doctor?.fullName,
      patient: d?.patient?.firstName + " " + d?.patient?.lastName,
    };
  });
  return formartted;
};

function SubComponent({ data, from }) {
  const modalRef = React.useRef(null);
  const { id } = useParams();

  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };
  const handleExport = () => {
    exportToExcel(formatExportData(data), `investigations_report_for_${id}`);
  };
  return (
    <>
      <Paper variant="outlined">
        <Stack
          direction="column"
          justifyContent="start"
          alignItems="start"
          gap={5}
          padding={4}
        >
          <AccordionInvestigationTable data={data} from={from} />
          <Stack
            width={"100%"}
            justifyContent={"space-between"}
            direction={"row"}
          >
            <CustomButton
              variant="containedBrown"
              text={"Add Investigation"}
              onClick={toggleModal}
            />
            <CustomButton
              variant="text"
              text={"Export All Test"}
              onClick={handleExport}
            />
          </Stack>
        </Stack>
      </Paper>
      <CustomModal
        ref={modalRef}
        backdropSx={{
          marginTop: "0px !important",
        }}
        childrenContSx={{
          p: 0,
          width: {
            xs: "90%",
            sm: "60vw",
          },
        }}
      >
        <UploadResultModal
          closeModal={toggleModal}
          testId={data?.[0]?.test?._id}
        />
      </CustomModal>
    </>
  );
}

export default SubComponent;
