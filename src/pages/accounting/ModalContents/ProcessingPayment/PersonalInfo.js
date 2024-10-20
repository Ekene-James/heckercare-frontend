import { Grid, Stack, Typography } from "@mui/material";
import React from "react";

const Detail = ({ detail }) => {
  return (
    <Stack spacing={2}>
      <Typography sx={{ fontWeight: "bold" }}>{detail.title}</Typography>
      <Typography variant="caption">{detail.subtitle}</Typography>
    </Stack>
  );
};
function PersonalInfo() {
  return (
    <Stack spacing={2} p={3} pl={0}>
      <Typography variant="displaySm">Personal Information</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Detail detail={{ title: "First Name", subtitle: "Stephen" }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Detail detail={{ title: "Last Name", subtitle: "Ade" }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Detail
            detail={{ title: "Phone Number", subtitle: "+234 56658784" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Detail detail={{ title: "Gender", subtitle: "Shemale" }} />
        </Grid>
        <Grid item xs={12}>
          <Detail detail={{ title: "HMO ID", subtitle: "HCD 12344" }} />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default PersonalInfo;
