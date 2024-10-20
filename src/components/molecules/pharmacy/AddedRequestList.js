import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import CustomButton from "components/atoms/CustomButton";
import React from "react";
import { v4 as uuidv4 } from "uuid";

const AddedRequestList = ({ defaultValue = [], formState, setFormState }) => {
  const [rows, setrows] = React.useState();

  // const newRow = {
  //   id: uuidv4(),
  //   name: formState.drugName,
  // };

  const handleAddDrug = () => {};

  return (
    <Stack
      direction="column"
      spacing={2}
      alignItems={"flex-start"}
      justifyContent="center"
      sx={{
        width: {
          xs: "100%",
        },
        p: 2,
      }}
    ></Stack>
  );
};

export default AddedRequestList;
