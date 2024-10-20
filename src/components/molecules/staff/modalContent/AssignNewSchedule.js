import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import SearchDropdown from "components/atoms/SearchDropdown";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import CustomDatePicker from "components/atoms/DatePicker";
import CustomCheckbox from "components/atoms/CustomCheckbox";
import CustomButton from "components/atoms/CustomButton";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import {
  GET_SHIFT_TYPES,
  GET_UNITS,
  SEARCH_STAFFS_BY_UNIT,
} from "utils/reactQueryKeys";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const Staff = ({ detail, onDelete }) => {
  return (
    <Stack
      p={0.2}
      pl={1}
      spacing={0.5}
      justifyContent="space-between"
      alignItems={"center"}
      width="100%"
      borderRadius={"5px"}
      border="1px solid black"
      direction={"row"}
    >
      <Typography
        sx={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {detail.fullName}
      </Typography>
      <IconButton
        color="primary"
        onClick={onDelete.bind(this, detail.id)}
        size="small"
      >
        <ClearIcon sx={{ fontSize: "12px" }} />
      </IconButton>
    </Stack>
  );
};
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}
const formatDate = (date) => {
  if (!date) return;

  const copy = new Date(date);
  return [
    copy.getFullYear(),
    padTo2Digits(copy.getMonth() + 1),
    padTo2Digits(copy.getDate()),
  ].join("-");
};
function AssignNewSchedule({ handleClose }) {
  const [selectedStaffs, setselectedStaffs] = React.useState([]);

  const [search, setsearch] = React.useState("");
  const [onSelectPatient, setonSelectPatient] = React.useState(false);

  const [formsState, setformsState] = React.useState({
    days: [],
    units: "",
    startDate: "",
    endDate: "",
    shifts: [],
  });

  //search staff by unit
  const {
    isLoading,
    isFetching,
    data: staffsData,
  } = useCustomQuery(
    [SEARCH_STAFFS_BY_UNIT, formsState.units, search],
    {
      url: `/unit/get-all-staff-in-unit/${formsState.units}?search=${search}`,
      // url: `/user/get-all-staff?search=${search}`,
      method: "get",
      avoidCancelling: false,
    },
    {
      enabled: !!formsState.units && !onSelectPatient,
      refetchOnWindowFocus: false,
    }
  );

  //get all units
  const { data: units } = useCustomQuery(
    GET_UNITS,
    {
      url: `/unit/get-all-units`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const formartedData = data.data.map((unit) => {
          return { name: unit.name, value: unit._id };
        });
        return formartedData;
      },
    }
  );
  //get all shifts
  const { data: shiftTypes } = useCustomQuery(
    GET_SHIFT_TYPES,
    {
      url: `/shifts`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //create shift
  const { mutate: assignSchedule, isLoading: assignScheduleLoading } =
    useCustomMutation(
      {
        url: `/schedule`,
        method: "post",
        data: {
          shifts: formsState.shifts,
          staffs: selectedStaffs.map((staff) => staff._id),
          days: formsState.days,
          startDate: formatDate(formsState.startDate),
          endDate: formatDate(formsState.endDate),
          unitId: formsState.units,
        },
      },
      {
        onSuccess: () => {
          toast.success("Success");
          handleClose(true);
        },

        onError: (error) => toast.error(error.message),
      }
    );

  const handleChange = (e) => {
    if (e.target.name === "units") setselectedStaffs([]);
    setformsState({
      ...formsState,
      [e.target.name]: e.target.value,
    });
  };

  const handleStaffOnselect = (staffDetail) => {
    setonSelectPatient(true);
    const arr = [...selectedStaffs, staffDetail];
    const removeDuplicate = [...new Set(arr)];
    setselectedStaffs(removeDuplicate);
  };

  const onDeleteStaff = (id) => {
    const staffs = selectedStaffs.filter((staff) => staff.id !== id);
    setselectedStaffs(staffs);
  };

  const handleCheckBox = (state, day) => {
    if (state) {
      setformsState({
        ...formsState,
        days: [...formsState.days, day],
      });
    } else {
      const days = formsState.days.filter((d) => d !== day);
      setformsState({
        ...formsState,
        days,
      });
    }
  };
  const handleCheckShift = (state, shiftId) => {
    if (state) {
      setformsState({
        ...formsState,
        shifts: [...formsState.shifts, shiftId],
      });
    } else {
      const shifts = formsState.shifts.filter((d) => d !== shiftId);
      setformsState({
        ...formsState,
        shifts,
      });
    }
  };

  const handleSelectDate = (date, name) => {
    setformsState({
      ...formsState,
      [name]: date,
    });
  };

  return (
    <Stack
      direction={"column"}
      spacing={3}
      p={2}
      sx={{
        width: {
          xs: "100%",
          md: "70%",
        },
        mb: "60px !important",
      }}
    >
      <Stack direction={"column"} spacing={1} justifyContent="flex-start">
        <Typography variant="displaySm">Assign New Schedule</Typography>
      </Stack>

      <Grid container spacing={1} sx={{}}>
        <Grid item xs={12}>
          <CustomSelect
            options={units}
            label="Units"
            state={formsState.units}
            handleChange={handleChange}
            name="units"
            haveTopLabel={true}
            placeholder="Select from the list of Units"
          />
        </Grid>
        <Grid item xs={12}>
          <SearchDropdown
            placeholder="Search list of staff names in unit selected, then click to add staff"
            handleOnselect={handleStaffOnselect}
            createBtnAction={() => {}}
            boxSx={{ width: "100%" }}
            data={staffsData?.data}
            isLoading={isLoading || isFetching}
            search={search}
            setsearch={setsearch}
            title="Staff Name"
            readOnly={!formsState.units}
            traySx={{ bottom: "-125px" }}
            noDataTxt="No staff found for this unit"
            setOnSelect={setonSelectPatient}
          />
        </Grid>
        {selectedStaffs.map((detail, i) => (
          <Grid key={i} item xs={6} sm={3} md={2.5} mb={5}>
            {" "}
            <Staff detail={detail} onDelete={onDeleteStaff} />
          </Grid>
        ))}

        <Grid item xs={12} mt={1.5}>
          <Typography variant="heading">Shift Type</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            {shiftTypes?.data?.map((shift) => (
              <Grid item xs={6} sm={4} key={shift._id}>
                <CustomCheckbox
                  desc={shift.name}
                  checkColor="secondary.main"
                  onClick={(state) => handleCheckShift(state, shift._id)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6} mt={1}>
          <CustomDatePicker
            type="date"
            views={["year", "month", "day"]}
            title="From"
            size="small"
            name="startDate"
            setdate={handleSelectDate}
            datePickerRootSx={{ height: "auto" }}
            datePickerSx={{ width: "100%" }}
            placeholder="From (DD/MM/YYYY)"
            disableFuture={false}
            date={formsState?.startDate}
          />
        </Grid>
        <Grid item xs={12} sm={6} mt={1}>
          <CustomDatePicker
            type="date"
            views={["year", "month", "day"]}
            title="To"
            size="small"
            name="endDate"
            setdate={handleSelectDate}
            date={formsState?.endDate}
            datePickerRootSx={{ height: "auto" }}
            datePickerSx={{ width: "100%" }}
            placeholder="To (DD/MM/YYYY)"
            disableFuture={false}
          />
        </Grid>
        <Grid item xs={12} mt={3}>
          <Typography variant="heading">Day</Typography>
        </Grid>
        {days.map((day) => (
          <Grid item xs={6} sm={4} md={3} key={day}>
            <CustomCheckbox
              desc={day}
              checkColor="secondary.main"
              onClick={(state) => handleCheckBox(state, day)}
            />
          </Grid>
        ))}
      </Grid>
      <Stack direction={"row"} spacing={1} alignItems="center">
        <CustomButton
          text={"Assign"}
          color="secondary"
          onClick={assignSchedule}
          disabled={assignScheduleLoading}
        />
        <CustomButton
          text={"Cancel"}
          variant="containedBrown"
          onClick={handleClose}
        />
      </Stack>
    </Stack>
  );
}

export default AssignNewSchedule;
