import { Box, Paper, Stack, Typography } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import React from "react";

import CustomButton from "components/atoms/CustomButton";
import CustomSelect from "components/atoms/Select";

const RecordUsageModal = ({ requestDetails }) => {
  const [formState, setformState] = React.useState({
    item: "",
    quantity: "",
    reason: "",
    department: "",
  });

  const handleChange = (e) => {
    setformState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box sx={{}} aria-label="record-usage-modal-child">
      <Stack
        direction="column"
        alignItems="start"
        justifyContent="start"
        spacing={1}
        sx={{ width: "100%" }}
      >
        <Typography variant="displayMd">Record Usage </Typography>
      </Stack>
      <Paper>
        <Stack
          direction="column"
          alignItems="start"
          justifyContent="start"
          spacing={1}
          sx={{ width: "100%", mb: 2 }}
        >
          <CustomSelect
            options={["option 1", "option 2"]}
            label="Department"
            state={formState.department}
            handleChange={handleChange}
            name="department"
            haveTopLabel={true}
            placeholder="Select Department"
          />

          <CustomTextInput
            title="Item "
            value={formState?.item}
            name="item"
            placeholder={"Type item here"}
            handleChange={handleChange}
            boxSx={{ width: "100%" }}
          />
          <CustomTextInput
            title="Quantity "
            value={formState?.quantity}
            name="quantity"
            placeholder={"Type quantity here"}
            handleChange={handleChange}
            boxSx={{ width: "40%" }}
          />
          <CustomTextInput
            title="Reason(s) "
            value={formState?.reason}
            name="reason"
            placeholder={"Type reason here"}
            boxSx={{ width: "100%" }}
            handleChange={handleChange}
          />
        </Stack>
        <CustomButton variant="contained" color="secondary" text="Record" />
      </Paper>
    </Box>
  );
};

export default RecordUsageModal;
