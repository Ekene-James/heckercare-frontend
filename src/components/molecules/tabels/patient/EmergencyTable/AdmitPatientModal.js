import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";

const AdmitWardModal = ({
  wards,
  wardId,
  setWardId,
  patient,
  handleAdmit,
  handleAdmitLoading,
  onClose,
}) => {
  return (
    <Box
      sx={{
        width: "500px",
        maxHeight: "100%",
        paddingTop: "30px",
        overflowY: "auto",
        margin: "auto",
      }}
    >
      <Paper
        sx={{
          p: 1,
          width: "100%",
          minHeight: "100%",
          margin: "auto",
          minWidth: {
            xs: "100%",
            sm: "100%",
          },
          borderRadius: "4px",
          position: "relative",
        }}
      >
        <Stack
          direction="column"
          gap={2}
          alignItems="center"
          sx={{
            width: "70%",
            margin: "auto",
            my: "22px",
          }}
        >
          {/* <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></div> */}
          <Typography
            sx={{ textAlign: "center", lineHeight: "1.2" }}
            variant="displayMd"
          >
            Admit Patient to Ward
          </Typography>
          <Typography color="gray" textAlign={"center"}>
            Select the ward to admit patient toast
          </Typography>
          <CustomTextInput
            title="Patient Name"
            value={`${patient?.firstName} ${patient?.lastName}`}
            readOnly={true}
            disabled={`true`}
            boxSx={{ width: "100%" }}
          />
          <CustomSelect
            options={wards}
            label="Wards"
            state={wardId}
            handleChange={(e) => setWardId(e.target.value)}
            // name="doctor"
            haveTopLabel={true}
            placeholder="Select Ward"
            // disabled={!formsState.department}
          />

          <Grid item xs={12} sm={12}>
            <CustomButton
              sx={{ marginRight: "8px" }}
              color="primary"
              variant="outlined"
              text={"Cancel"}
              onClick={onClose}
            />
            <CustomButton
              sx={{ marginLeft: "8px" }}
              color="secondary"
              variant="contained"
              text={"Admit"}
              onClick={handleAdmit}
              disabled={handleAdmitLoading}
            />
          </Grid>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AdmitWardModal;
