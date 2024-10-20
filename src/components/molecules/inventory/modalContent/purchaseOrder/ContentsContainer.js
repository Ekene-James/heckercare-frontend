import { Grid } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import React from "react";

function ContentsContainer({ data, sx, state, handleChange }) {
  const form = (formData) => {
    if (formData.formType === "select") {
      return (
        <CustomSelect
          options={formData.options}
          label={formData.title}
          state={state[formData.name]}
          handleChange={handleChange}
          name={formData.name}
          haveTopLabel={true}
          placeholder={formData.placeholder}
        />
      );
    } else {
      return (
        <CustomTextInput
          title={formData.title}
          value={state[formData.name]}
          name={formData.name}
          handleChange={handleChange}
          boxSx={{ width: "100%" }}
          placeholder={formData.placeholder}
        />
      );
    }
  };
  return (
    <Grid container spacing={1} sx={{ p: 3, ...sx }}>
      {data.map((data, i) => (
        <Grid key={i} item xs={12} sm={data.sm}>
          {form(data)}
        </Grid>
      ))}
    </Grid>
  );
}

export default ContentsContainer;
