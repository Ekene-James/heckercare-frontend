import { Grid } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import React from "react";

function PrescriptionDrugDetail({ data }) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <CustomTextInput
          title="Medicine/Drug Name"
          value={data?.product?.drugName}
          disabled="true"
          readOnly
        />
      </Grid>
      <Grid item xs={12}>
        <CustomTextInput
          title="Medicine Type"
          value={data?.product?.drugType?.name}
          disabled="true"
          readOnly
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <CustomTextInput
          title="Unit type"
          value={data?.product?.unit}
          disabled="true"
          readOnly
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextInput
          title="Amount"
          value={data?.amount}
          disabled="true"
          readOnly
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextInput
          title="Intake Frequency"
          value={data?.frequency}
          disabled="true"
          readOnly
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextInput
          title="Duration"
          value={data?.duration}
          disabled="true"
          readOnly
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextInput
          title="Meal"
          value={data?.foodRelation?.replace(/_/g, " ")}
          disabled="true"
          readOnly
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextInput
          title="Administration Method"
          value={data?.routeOfAdmin}
          disabled="true"
          readOnly
        />
      </Grid>
    </Grid>
  );
}

export default PrescriptionDrugDetail;
