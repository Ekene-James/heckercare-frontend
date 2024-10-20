import { Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";

import moment from "moment";
import React, { useState } from "react";
import { downloadOnClick } from "utils/exportToExcel";

function DownloadPaymentReceipt({ closeModal, downloadUrl, patientDetails }) {
  const [downloading, setdownloading] = useState(false);
  const cb = (isDone) => {
    if (isDone) {
      setdownloading(false);
      closeModal();
    }
  };
  const handleDownload = () => {
    setdownloading(true);
    downloadOnClick(
      `${downloadUrl}`,
      `receipt for ${patientDetails?.firstName} ${
        patientDetails?.lastName
      } on ${moment(new Date()).format("MMMM Do, YYYY")}`,
      "GET",
      null,
      cb
    );
  };
  return (
    <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
      <Typography variant="displaySm"> Download payment receipt?</Typography>

      <Stack
        direction="row"
        justifyContent={"space-between"}
        gap={3}
        sx={{
          mt: 6,
          width: {
            xs: "100%",
            sm: "60%",
          },
        }}
      >
        <CustomButton
          text={"Yes"}
          color="secondary"
          onClick={handleDownload}
          sx={{ width: "48%" }}
          disabled={downloading}
        />
        <CustomButton
          text={"No"}
          variant="containedBrown"
          onClick={closeModal}
          sx={{ width: "48%" }}
        />
      </Stack>
    </Stack>
  );
}

export default DownloadPaymentReceipt;
