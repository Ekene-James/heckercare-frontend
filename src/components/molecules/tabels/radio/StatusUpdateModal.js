import { Divider, Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import CustomButton from "components/atoms/CustomButton";
import CustomSelect from "components/atoms/Select";
import React from "react";

const StatusUpdateModal = () => {
  const items = ["FULFILLED", "REJECTED"];
  const [formState, setformState] = React.useState({
    status: "",
  });

  const handleChange = (e) => {
    setformState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Stack direction={"column"} sx={{ width: "100%" }} spacing={3}>
      <Stack direction={"column"} sx={{ width: "100%" }} spacing={1}>
        <Typography variant="displayMd">Status Update</Typography>
      </Stack>
      <Divider />
      <Stack>
        <Stack>
          <CustomSelect
            options={items}
            label="Status"
            state={formState.status}
            handleChange={handleChange}
            name="status"
            haveTopLabel={true}
            placeholder="Select status"
          />
        </Stack>
        <Grid item xs={6} sm={3}>
          <CustomButton text="Update" color="secondary" onClick={""} />
          <CustomButton text="Cancel" color="secondary" onClick={""} />
        </Grid>
      </Stack>
    </Stack>
  );
};

export default StatusUpdateModal;
