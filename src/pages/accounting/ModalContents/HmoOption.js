import { Grid } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import React from "react";

const HmoOption = () => {
  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <CustomTextInput title="HMO ID" value="" readOnly />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput title="HMO Handler" value="" readOnly />
        </Grid>
      </Grid>
    </div>
  );
};

export default HmoOption;
