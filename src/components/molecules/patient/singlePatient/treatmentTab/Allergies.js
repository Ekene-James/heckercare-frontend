import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import { useFormik } from "formik";
import moment from "moment";

import React from "react";

const data = [
  {
    text: "Penicilin",
    severity: "High",
  },
  {
    text: "Chloroquin",
    severity: "Low",
  },
  {
    text: "Penicilin",
    severity: "Low",
  },
  {
    text: "Chloroquin",
    severity: "High",
  },
];

const categories = [
  {
    name: "Drug Allergies",
    value: "DRUG",
  },
  {
    name: "Food Allergies",
    value: "FOOD",
  },
  {
    name: "Insect Allergies",
    value: "INSECT",
  },
  {
    name: "Latex Allergies",
    value: "LATEXT",
  },
  {
    name: "Mold Allergies",
    value: "MOLD",
  },
  {
    name: "Pet Allergies",
    value: "PET",
  },
  {
    name: "Pollen Allergies",
    value: "POLLEN",
  },
];
const initialValues = {
  category: "",
  allergen: "",
  level: "",
  reaction: "",
};
function Allergies({
  handleNext,
  visitItem,
  values,
  isLoading,
  mutate,
  setValues,
  isActiveVisit,
}) {
  const {
    handleChange: onChange,
    values: state,
    setValues: setState,
    resetForm,
  } = useFormik({
    initialValues,
  });
  const setSeverity = (severity) => {
    setState({
      ...state,
      level: severity,
    });
  };
  const handleAddAllergy = () => {
    setValues({
      ...values,
      allergies: [...values.allergies, state],
    });
    resetForm();
  };

  return (
    <Box>
      <Box sx={{ p: 1, border: "1px dashed #979797", borderRadius: "4px" }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            textAlign: "start",
          }}
        >
          Allergy
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
            width: {
              xs: "100%",
              md: "80%",
              lg: "50%",
            },
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "start",
              width: "100%",
              flexDirection: "column",
            }}
          >
            {values?.allergies?.map((item) => (
              <Box
                key={item.allergen}
                sx={{
                  backgroundColor: "background.custom",
                  p: 1,
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                  mb: 1,
                }}
              >
                <Typography
                  variant="body"
                  sx={{
                    fontSize: "11px",
                  }}
                >
                  {item.category}
                </Typography>
                <Typography
                  variant="body"
                  sx={{
                    fontSize: "11px",
                  }}
                >
                  {item.allergen}
                </Typography>
                <Typography
                  variant="body"
                  sx={{
                    fontSize: "11px",
                    color:
                      item.level === "HIGH"
                        ? "red"
                        : item.level === "MID"
                        ? "blue"
                        : "green",
                    textTransform: "capitalize !important",
                  }}
                >
                  {item.level}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography
            variant="body"
            gutterBottom
            sx={{
              fontSize: "9px",
              fontStyle: "italic",
            }}
          >
            Last updated: {moment(visitItem?.createdAt).format("MMM Do, YYYY")}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          width: {
            xs: "100%",
            md: "80%",
            lg: "50%",
          },
          mt: 2,
        }}
      >
        <CustomSelect
          options={categories}
          label="Category"
          state={state.category}
          handleChange={onChange}
          name="category"
          haveTopLabel={true}
        />
        <CustomTextInput
          title="Allergen"
          value={state.allergen}
          name="allergen"
          handleChange={onChange}
          placeholder="Enter Allergy here"
        />
        <CustomTextInput
          title="Notes / Comments"
          value={state.reaction}
          name="reaction"
          handleChange={onChange}
          placeholder="Start typing here"
          multiline={true}
          helperText={`${state.reaction.length} / 200`}
        />
        <Typography
          variant="body"
          gutterBottom
          sx={{
            mb: 1,
          }}
        >
          Level
        </Typography>
        <Paper
          sx={{
            p: 1,
            pl: 2,
            pr: 2,
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid rgba(0,0,0,0.2)",
            borderRadius: "5px",
            width: { xs: "100%", sm: "70%" },
          }}
        >
          <Button
            variant={state.level === "HIGH" ? "contained" : "outlined"}
            color="error"
            sx={{ m: 1 }}
            onClick={setSeverity.bind(this, "HIGH")}
          >
            High
          </Button>
          <Button
            variant={state.level === "MID" ? "contained" : "outlined"}
            color="success"
            sx={{ m: 1, pl: 3, pr: 3 }}
            onClick={setSeverity.bind(this, "MID")}
          >
            Medium
          </Button>
          <Button
            variant={state.level === "LOW" ? "contained" : "outlined"}
            color="info"
            sx={{ m: 1 }}
            onClick={setSeverity.bind(this, "LOW")}
          >
            Low
          </Button>
        </Paper>
        <CustomButton
          text={"Add Allergy"}
          onClick={handleAddAllergy}
          variant="contained"
          color="secondary"
          sx={{ minWidth: "20%", mt: 2 }}
        />
      </Box>
      <Stack direction={"row"} justifyContent="space-between" mt={3}>
        <CustomButton
          text={"Next"}
          onClick={handleNext}
          variant="containedBrown"
          sx={{ minWidth: "30%" }}
        />
        <CustomButton
          text={"Done"}
          sx={{ minWidth: "30%" }}
          disabled={isLoading || !isActiveVisit}
          onClick={mutate}
        />
      </Stack>
    </Box>
  );
}

export default Allergies;
