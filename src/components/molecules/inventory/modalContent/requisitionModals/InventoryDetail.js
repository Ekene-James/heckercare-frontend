import { Box, IconButton, Stack } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";

import CustomSelect from "components/atoms/Select";
import React from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";

function InventoryDetail({ detail, i, handleChangeDetail, handleDelete }) {
  return (
    <Stack
      spacing={1}
      width="100%"
      direction={{
        xs: "column",
        sm: "row",
      }}
      alignItems="center"
      justifyContent={"space-between"}
    >
      <Box sx={{ backgroundColor: "background.lightBlue", p: 2 }}>
        {detail.itemName}
      </Box>
      {/* <Box sx={{ backgroundColor: "background.lightBlue", p: 2 }}>
          {`Unit Cost: #${detail.unitCost}`}
        </Box> */}

      <CustomTextInput
        value={detail.unitCost}
        name="unitCost"
        placeholder={"Enter unit cost"}
        handleChange={handleChangeDetail.bind(null, i)}
        boxSx={{
          width: {
            xs: "100%",
            sm: "30%",
          },
        }}
        type="number"
        inputProps={{ inputProps: { min: 0 } }}
      />
      <CustomTextInput
        value={detail.quantity}
        name="quantity"
        placeholder={"Enter quantity"}
        handleChange={handleChangeDetail.bind(null, i)}
        boxSx={{
          width: {
            xs: "100%",
            sm: "30%",
          },
        }}
        type="number"
        inputProps={{ inputProps: { min: 0 } }}
      />
      {/* <CustomSelect
        options={["TABLET", "VIAL", "PIECE", "CAPSULE"]}
        state={detail.unit}
        handleChange={handleChangeDetail.bind(null, i)}
        name="unit"
        placeholder="Select units"
        boxSx={{
          width: {
            xs: "100%",
            sm: "20%",
          },
          paddingTop: "0px",
        }}
        haveTopLabel
      /> */}
      <IconButton size="small" onClick={handleDelete.bind(null, detail._id)}>
        <DeleteIcon fontSize="small" sx={{ color: red[500] }} />
      </IconButton>
    </Stack>
  );
}
export default InventoryDetail;
