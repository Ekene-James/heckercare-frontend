import { Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomMenu from "components/atoms/CustomMenu";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomDatePicker from "components/atoms/DatePicker";
import React from "react";
const dropDownContent = [
  {
    name: "Day",
    value: "Day",
  },
  {
    name: "Week",
    value: "Week",
  },
  {
    name: "Month",
    value: "Month",
  },
];
function FrequencyModal({ cancel }) {
  const [formState, setformState] = React.useState({
    every: "",
    views: { name: "Day", value: "Day" },
  });
  const handleChange = (e) =>
    setformState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  const handleClickDropdownItem = (item) => {
    setformState({
      ...formState,
      views: item,
    });
  };
  return (
    <Stack
      direction={"column"}
      spacing={2}
      justifyContent="flex-start"
      alignItems={"flex-start"}
      width="100%"
    >
      <Typography variant="heading">Set recurrence</Typography>
      <Stack
        direction={"row"}
        spacing={1}
        justifyContent="center"
        alignItems={"center"}
        pl={3}
      >
        <Typography>Start</Typography>
        <CustomDatePicker
          title=""
          type="date"
          datePickerRootSx={{}}
          datePickerSx={{ width: "70%" }}
          views={["year", "month", "day"]}
        />
      </Stack>
      <Stack
        direction={"row"}
        spacing={1}
        justifyContent="flex-start"
        alignItems={"center"}
      >
        <Typography>Repeat every</Typography>
        <CustomTextInput
          title=""
          value={formState.every}
          name="every"
          handleChange={handleChange}
          boxSx={{ width: "15%" }}
          sx={{
            "& .MuiInputBase-input.MuiOutlinedInput-input": {
              p: 0.85,
            },
          }}
          placeholder="Frequency"
          size="small"
        />
        <CustomMenu
          caption={formState.views.name}
          items={dropDownContent}
          onClickItem={handleClickDropdownItem}
          buttonSx={{ width: "85%" }}
        />
      </Stack>
      <Stack
        direction={"row"}
        spacing={1}
        justifyContent="flex-start"
        alignItems={"center"}
        pl={3}
      >
        <Typography>End</Typography>

        <CustomDatePicker
          title=""
          type="date"
          datePickerRootSx={{}}
          datePickerSx={{ width: "70%" }}
          views={["year", "month", "day"]}
        />
      </Stack>
      <Stack
        direction={"row"}
        spacing={1}
        justifyContent="flex-end"
        alignItems={"center"}
        width="100%"
      >
        <CustomButton variant="outlined" text={"cancel"} onClick={cancel} />
        <CustomButton color="secondary" text={"save"} />
      </Stack>
    </Stack>
  );
}

export default FrequencyModal;
