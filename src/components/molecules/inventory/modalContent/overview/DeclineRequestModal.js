import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import StaffList from "components/molecules/department/StaffList";
import SearchDropdown from "components/atoms/SearchDropdown";
import CustomDatePicker from "components/atoms/DatePicker";
import CustomButton from "components/atoms/CustomButton";
const SearchDropdownData = [
  {
    id: "ID-123456",
    name: "Sam Smith",
  },
  {
    id: "ID-123457",
    name: "Jon Smith",
  },
  {
    id: "ID-123456",
    name: "Sam Doe",
  },
  {
    id: "ID-123456",
    name: "Jon Doe",
  },
];
const DeclineRequestModal = ({ requestDetails }) => {
  const [date, setdate] = React.useState(new Date());
  const [formState, setformState] = React.useState({
    date: "",
    quantity: "",
    reason: "",
    reason1: "",
  });

  React.useMemo(() => setformState(requestDetails), [requestDetails]);

  const handleChange = (e) => {
    setformState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Grid container spacing={2} sx={{}} aria-label="assign-staff-modal">
      <Grid item xs={2}>
        <Box
          sx={{
            height: "100px",
            width: "100px",
            borderRadius: "50%",
            p: 3,
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0px 4px 35px rgba(0, 0, 0, 0.15)",
          }}
        >
          <img
            alt="folder_icon"
            src="/imgs/cancel.png"
            height="50px"
            width="50px"
          />
        </Box>
      </Grid>
      <Grid item xs={11} sm={9}>
        <Stack
          direction="column"
          alignItems="start"
          justifyContent="start"
          spacing={1}
          sx={{ width: "100%" }}
        >
          <Typography variant="displayMd">Decline Request </Typography>
        </Stack>

        <Stack
          direction="column"
          alignItems="start"
          justifyContent="start"
          spacing={1}
          sx={{ width: "100%", mb: 2 }}
        >
          <CustomDatePicker
            type="date"
            views={["year", "month", "day"]}
            title="Date"
            date={date}
            setdate={setdate}
            datePickerRootSx={{ height: "auto" }}
            datePickerSx={{ width: "100%", height: "auto" }}
            boxSx={{ width: "100%" }}
            // readOnly={true}
          />

          <CustomTextInput
            title="Quantity "
            value={formState?.quantity}
            name="quantity"
            readOnly={true}
            boxSx={{ width: "40%" }}
          />
          <CustomTextInput
            title="Reason For Declining "
            value={formState?.reason}
            name="reason"
            placeholder={"Type reason here"}
            boxSx={{ width: "100%" }}
            handleChange={handleChange}
          />
          <CustomTextInput
            title="State other reason(s) "
            value={formState?.reason1}
            name="reason1"
            placeholder={"Type here"}
            boxSx={{ width: "100%" }}
            handleChange={handleChange}
          />
        </Stack>
        <CustomButton
          variant="lightSuccess"
          text="Submit"
          sx={{
            color: "secondary.main",
            ":hover": {
              color: "secondary.main",
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default DeclineRequestModal;
