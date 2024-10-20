import { Grid, Stack, Typography } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import RadioBtnWithDescription from "components/atoms/RadioBtnWithDescription";
import RadioButtons from "components/atoms/RadioButton";
import React, { useState } from "react";
import { numberFormatter } from "utils/numberFormatter";

const radioBtns = [
  {
    value: "CASH",
    name: "Cash Payment",
  },
  {
    value: "POS",
    name: "Pos Method",
  },
];
const CashPaymentOption = ({ details, value, setvalue }) => {
  return (
    <Stack
      direction="row"
      justifyContent={"space-between"}
      sx={{ width: "100%" }}
      spacing={1}
    >
      <Grid item xs={12} sm={6}>
        <RadioButtons
          value={value}
          setvalue={setvalue}
          btns={radioBtns}
          title={"Select Option"}
          row
        />

        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Amount to Pay"
            value={
              details?.totalCost === 0
                ? "0"
                : `₦${numberFormatter(details?.totalCost)}`
            }
            readOnly
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default CashPaymentOption;
