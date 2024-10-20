import { Box, Button, Grid, InputLabel, Typography } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import NurseAssesmentTable from "components/molecules/tabels/patient/NurseAssesmentTable";
import React from "react";

const options = [
  "Blood Sugar Test (fasting)",
  "Blood Sugar Test (non-fasting)",
];
function NurseAssesment() {
  const [formsState, setformsState] = React.useState({
    activity: "",
    notePad: "",
    remark: "",
  });

  const handleChange = (e) => {
    setformsState({
      ...formsState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box>
      <Box
        sx={{
          width: {
            xs: "100%",
            sm: "50%",
          },
          mt: 2,
        }}
      >
        <CustomSelect
          options={options}
          label="Activity"
          state={formsState.activity}
          handleChange={handleChange}
          name="activity"
          haveTopLabel={true}
        />

        <CustomTextInput
          title="Notepad"
          value={formsState.notePad}
          name="notePad"
          handleChange={handleChange}
          placeholder="Start typing here"
          multiline={true}
          helperText={`${formsState.notePad.length} / 2000`}
        />
        <CustomTextInput
          title="Remark"
          value={formsState.remark}
          name="remark"
          handleChange={handleChange}
          placeholder="Enter"
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Button variant="outlined">Update Info</Button>
      </Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          textAlign: "start",
          mt: 3,
          mb: 2,
        }}
      >
        History
      </Typography>
      <NurseAssesmentTable />
    </Box>
  );
}

export default NurseAssesment;
