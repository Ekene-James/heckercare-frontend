import { Box, Button, Paper, Stack, Typography } from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

import CustomMenu from "components/atoms/CustomMenu";

import CustomModal from "components/atoms/CustomModal";

import React from "react";
import CustomButton from "components/atoms/CustomButton";

import ModalContainer from "components/molecules/staff/modalContent";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";

import { groupBy } from "utils/groupByFunc";

import CustomDatePicker from "components/atoms/DatePicker";
import Scheduler from "components/molecules/customScheduler/Scheduler";
import { daysOfThWeek } from "components/molecules/customScheduler/util";
import {
  GET_SCHEDULES,
  GET_SHIFT_TYPES,
  GET_UNITS,
} from "utils/reactQueryKeys";
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

function StaffShift() {
  const modalRef = React.useRef(null);

  const [modalView, setmodalView] = React.useState(null);
  const [scheduleDate, setscheduleDate] = React.useState(new Date());
  const [dateRange, setdateRange] = React.useState(daysOfThWeek(new Date()));

  const [unit, setunit] = React.useState({
    name: "Unit",
    value: "unit",
  });
  const [shiftType, setshiftType] = React.useState({
    name: "Shift Type",
    value: "shift_type",
  });

  //get all schedule in a unit with query bodies (post)

  const { data: schedules } = useCustomQuery(
    [
      GET_SCHEDULES,
      unit.value,
      {
        startDate: formatDate(dateRange[0]),
        endDate: formatDate(dateRange[dateRange.length - 1]),
        shift: shiftType.value === "shift_type" ? null : shiftType.value,
      },
    ],
    {
      url: `/schedule/get-schedule-by-date-range/${unit.value}`,
      method: "post",
      data: {
        startDate: formatDate(dateRange[0]),
        endDate: formatDate(dateRange[dateRange.length - 1]),
        shift: shiftType.value === "shift_type" ? null : shiftType.value,
      },
    },
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const groupByDate = groupBy(data.data, "date");
        const groupByDateArr = Object.values(groupByDate);

        const destructureShiftObj = groupByDateArr.map((data) =>
          data.map((day) => {
            return {
              startTime: day.shift.startTime,
              endTime: day.shift.endTime,
              shiftName: day.shift.name,
              fullDate: day.date,
              staffDetails: day.staff,
            };
          })
        );
        const groupByShiftName = destructureShiftObj.map((data) =>
          groupBy(data, "shiftName")
        );

        const result = groupByShiftName.map((r) => {
          let values = Object.values(r);
          return (values = values.map((value) => {
            const shiftDetails = value[0];

            let startTime, endTime, endMin, endHour;

            startTime = shiftDetails?.startTime?.split(":");
            if (startTime)
              startTime = Number(`${startTime[0]}.${startTime[1]}`);

            const end = shiftDetails?.endTime?.split(":");
            endHour = +end[0];
            endMin = +end[1];
            //make 30 mins = 0.5, i.e. 1 mins =0.17 approx
            endMin = Math.floor(0.17 * endMin);
            endTime = `${endHour}.${endMin}`;

            endTime = Number(endTime);

            const day = +shiftDetails.fullDate.split("-")[2].split("T")[0];

            return {
              startTime,
              endTime,
              shiftName: shiftDetails.shiftName,
              fullDate: shiftDetails.fullDate,
              day,

              staffDetails: value,
            };
          }));
        });
        return result.reduce((a, b) => a.concat(b), []);
      },
      enabled: unit.value !== "unit",
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
      select: (data) => {
        const formartedData = data.data.map((shift) => {
          return { name: shift.name, value: shift._id };
        });
        return formartedData;
      },
    }
  );

  //get all units
  const { data: allUnits } = useCustomQuery(
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

  const handleClickDropdownItem = (item) => {
    setunit(item);
  };
  const handleModalOpen = (view) => {
    setmodalView(view);
    modalRef?.current?.handleToggle();
  };
  const handleShiftType = (item) => {
    setshiftType(item);
  };
  const handleReset = () => {
    setscheduleDate(new Date());
    setshiftType({
      name: "Shift Type",
      value: "shift_type",
    });
    setunit({
      name: "Unit",
      value: "unit",
    });
  };

  const handleSelectDate = (date) => {
    const dateRange = daysOfThWeek(date);
    setscheduleDate(date);
    setdateRange(dateRange);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="displayMd">Staffs Shift</Typography>
      </Box>
      <Paper>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ p: 1, pt: 2 }}
        >
          <CustomMenu
            caption={unit.name}
            items={allUnits}
            onClickItem={handleClickDropdownItem}
          />
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Button variant="outlined" onClick={handleReset}>
              <RefreshIcon />
            </Button>
            <CustomDatePicker
              type="date"
              views={["year", "month", "day"]}
              size="small"
              datePickerSx={{ width: "140px" }}
              date={scheduleDate}
              setdate={handleSelectDate}
              disableFuture={false}
              name="schedule_date"
            />

            <CustomMenu
              caption={shiftType.name}
              items={shiftTypes}
              endIcon={<FilterAltOutlinedIcon />}
              onClickItem={handleShiftType}
            />

            <CustomButton
              text="Adjust Shifts"
              variant="lightSecondary"
              onClick={handleModalOpen.bind(this, 0)}
            />
            <Button
              variant="contained"
              color="secondary"
              sx={{ minWidth: "150px" }}
              onClick={handleModalOpen.bind(this, 1)}
            >
              Assign New Schedule
            </Button>
          </Stack>
        </Stack>
        {
          <Scheduler
            view={"Week"}
            apiData={schedules || []}
            currentDay={scheduleDate}
          />
        }
      </Paper>
      <CustomModal
        ref={modalRef}
        // cleanUp={() => setmodalView(null)}
        childrenContSx={{
          p: 3,
          width: {
            xs: "100%",
            md: "65%",
          },
          // minHeight: "100vh !important",
        }}
      >
        <ModalContainer
          view={modalView}
          handleClose={() => {
            setmodalView(null);
            modalRef?.current?.handleToggle();
          }}
        />
      </CustomModal>
    </Box>
  );
}

export default React.memo(StaffShift);
