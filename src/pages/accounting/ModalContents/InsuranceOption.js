import { Box } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import React from "react";

const InsuranceOption = ({ details }) => {
  return (
    <Box width={"50%"}>
      <CustomTextInput title="Insurance ID" value="" readOnly />
    </Box>
  );
};

export default InsuranceOption;
