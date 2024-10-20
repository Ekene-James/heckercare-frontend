import { Grid } from "@mui/material";

import CustomTextInput from "components/atoms/CustomTextInput";

import CustomSelect from "components/atoms/Select";
import CustomSwitch from "components/atoms/Switch";

import React from "react";

function CreateOrUpdateStockForm({ editData }) {
  return (
    <Grid
      container
      alignItems="flex-start"
      justifyContent="space-between"
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Medicine name"
            value={editData?.drugName}
            disabled="true"
            readOnly
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Drug Type"
            value={editData?.drugType?.name || ""}
            disabled="true"
            readOnly
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomSelect
            options={["TABLET", "VIAL", "PIECE", "CAPSULE"]}
            label="Unit type"
            value={editData?.unit || ""}
            readOnly
            placeholder="Select from the options"
            haveTopLabel={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            readOnly
            title="Generic Name"
            value={editData?.genericName?.activeIngredient || ""}
            disabled="true"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Available Quantity"
            readOnly
            disabled="true"
            value={editData?.availableQuantity}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Brand Name"
            readOnly
            disabled="true"
            value={editData?.brandName}
          />
        </Grid>

        <Grid item xs={12} sx={{}}>
          <CustomTextInput
            title="Description"
            value={editData?.prodcutDescription}
            readOnly
            disabled="true"
            placeholder="Type in number here"
            multiline
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
          <img
            alt="product_img"
            width={"100px"}
            height="110px"
            src={
              editData?.productImage || "/imgs/black-solid-icon-medicine.jpg"
            }
          />
        </Grid>
        <Grid item xs={12} sm={12} sx={{}}>
          <CustomSwitch
            color={"success"}
            checkedTitle="Notify me when restocked into the inventory"
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CreateOrUpdateStockForm;
