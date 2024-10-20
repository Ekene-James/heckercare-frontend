import { Divider, Grid, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import CustomSwitch from "components/atoms/Switch";
import UploadBoard from "components/atoms/UploadBoard";
import React from "react";

function CreateInventory() {
  const [formState, setformState] = React.useState({
    type: "",
    module: "",
    quantity: "",
    cost: "",
    location: "",
    image: "",
    title: "",
  });

  const handleChange = (e) =>
    setformState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  return (
    <Stack
      direction={"column"}
      sx={{ width: "100%" }}
      spacing={3}
      aria-label="create-inventory-modal-child"
    >
      <Stack direction={"column"} sx={{ width: "100%" }} spacing={1}>
        <Typography variant="displayMd">Create New Inventory</Typography>
      </Stack>
      <Divider />
      <Grid container spacing={1} sx={{ mt: 1, width: "100%" }}>
        <Grid item xs={12} sm={9}>
          <Grid container spacing={1} sx={{ mt: 1, width: "100%" }}>
            <Grid item xs={12}>
              <CustomTextInput
                title="Title"
                value={formState.title}
                name="title"
                handleChange={handleChange}
                boxSx={{ width: "100%" }}
                placeholder="Type the product name here"
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <UploadBoard
                title="Upload an Image"
                title1="(Kindly upload a clear picture in .png or .jpg format)"
                onAddImg={(fileArr) => {
                  console.log(fileArr);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomSelect
                options={["one", "Two"]}
                label="Module(Department)"
                state={formState.module}
                handleChange={handleChange}
                name="module"
                haveTopLabel={true}
                placeholder="Select Inventory Location"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomSelect
                options={["one", "Two"]}
                label="Type"
                state={formState.type}
                handleChange={handleChange}
                name="type"
                haveTopLabel={true}
                placeholder="Select appointment"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextInput
                title="Quantity (in number)"
                value={formState.quantity}
                name="quantity"
                handleChange={handleChange}
                boxSx={{ width: "100%" }}
                placeholder="Type in number here"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomSelect
                options={["one", "Two"]}
                label="Cost"
                state={formState.cost}
                handleChange={handleChange}
                name="cost"
                haveTopLabel={true}
                placeholder="Select cost"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomSelect
                options={["one", "Two"]}
                label="Location"
                state={formState.location}
                handleChange={handleChange}
                name="location"
                haveTopLabel={true}
                placeholder="Select location"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <CustomButton text="Create" color="secondary" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default CreateInventory;
