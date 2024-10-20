import { Grid, Stack, Typography } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import React, { useState } from "react";
const initialState = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  gender: "",
  hmo_id: "",
};
function PersonalInfo({ patientInfo }) {
  return (
    <Stack spacing={2} p={3} pl={0}>
      <Typography variant="displaySm">Personal Information</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="First Name"
            value={patientInfo?.firstName}
            placeholder={"First Name"}
            readOnly
            disabled="true"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Last Name"
            value={patientInfo?.lastName}
            placeholder={"Last Name"}
            readOnly
            disabled="true"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Phone Number"
            value={patientInfo?.phoneNumber}
            placeholder={"Phone Number"}
            readOnly
            disabled="true"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Gender"
            value={patientInfo?.gender}
            placeholder={"Gender"}
            readOnly
            disabled="true"
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextInput
            title="HMO ID(if applicable)"
            value={patientInfo?.hmo_id}
            placeholder={"HMO ID(if applicable)"}
            readOnly
            disabled="true"
          />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default PersonalInfo;
