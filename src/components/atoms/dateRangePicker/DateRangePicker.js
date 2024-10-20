import { Box, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useClickOutside } from "hooks/useClickOutside";
import InputWithAdornment from "pages/pharmacy/components/InputWithAdornment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import CustomButton from "../CustomButton";
import { SingleMonth } from "./SingleMonth";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  daysInMonth,
  isDayInBetweenDaysInclusive,
  pad,
} from "./utils/utilFuncs";

const DateRangePicker = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const calendarRef = useRef(null);
  const monthRef = useRef(null);
  const anchorRef = useRef(null);
  anchorRef.current = anchorEl;
  const clickHandler = (e) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  useClickOutside([anchorRef, calendarRef], () => {
    setStartDate(
      typeof values?.[0] === "string"
        ? new Date(values[0])
        : values?.[0] || today
    );
    setEndDate(
      typeof values?.[1] === "string"
        ? new Date(values[1])
        : values?.[1] ||
            new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
    );
    setAnchorEl(null);
  });

  const today = new Date();
  const {
    values,
    calendarSx,
    setValues,
    placeholder = "Select dates",
    fullWidth,
    position = "start",
    min,
    max,
    ...rest
  } = props;
  const [inputStr, setInputStr] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const initialDates = useRef({});

  const [startDate, setStartDate] = useState(
    typeof values?.[0] === "string" ? new Date(values[0]) : values?.[0] || today
  );
  const [endDate, setEndDate] = useState(
    typeof values?.[1] === "string"
      ? new Date(values[1])
      : values?.[1] ||
          new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
  );

  useEffect(() => {
    initialDates.current = {
      startDate: values[0],
      endDate: values[1],
    };
  }, []);

  useEffect(() => {
    if (
      initialDates.current.startDate === startDate &&
      initialDates.current.endDate === endDate
    )
      return;

    setEndDate(
      typeof values?.[1] === "string"
        ? new Date(values[1])
        : values?.[1] ||
            new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
    );

    setStartDate(
      typeof values?.[0] === "string"
        ? new Date(values[0])
        : values?.[0] || today
    );
  }, [values]);

  useEffect(() => {
    if (!selectedStartDate) return;
    if (
      isDayInBetweenDaysInclusive(
        selectedStartDate,
        new Date(endDate.getFullYear(), endDate.getMonth(), 1),
        new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          daysInMonth(endDate.getFullYear())[endDate.getMonth()]
        )
      )
    ) {
      setStartDate(endDate);
      setEndDate(
        new Date(
          endDate.getFullYear(),
          endDate.getMonth() + 1,
          endDate.getDate()
        )
      );
    }
  }, [endDate, startDate, selectedStartDate]);

  useEffect(() => {
    if (!inputStr) return;
    const pattern =
      /([\d]{2})-([\d]{2})-([\d]{4}) ~ ([\d]{2})-([\d]{2})-([\d]{4})/;
    const [_, startDate, startMonth, startYear, endDate, endMonth, endYear] =
      inputStr.match(pattern) || [];
    if (
      !(startDate && startMonth && startYear && endDate && endMonth && endYear)
    )
      return;
    setSelectedStartDate(
      new Date(Number(startYear), Number(startMonth) - 1, Number(startDate))
    );
    setSelectedEndDate(
      new Date(Number(endYear), Number(endMonth) - 1, Number(endDate))
    );
  }, [inputStr]);
  useClickOutside([monthRef], () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  });

  useEffect(() => {
    if (!values[0] || !values[1]) setInputStr("");
  }, [values]);

  const pickDateHandler = (date) => {
    if (!selectedStartDate) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else if (selectedEndDate && selectedStartDate) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else if (selectedStartDate) {
      if (date.getTime() < selectedStartDate.getTime()) {
        setSelectedStartDate(date);
        setSelectedEndDate(selectedStartDate);
      } else {
        setSelectedEndDate(date);
      }
    }
  };
  const pickToday = (e) => {
    e.stopPropagation();
    setSelectedStartDate(today);
    setSelectedEndDate(today);
    setStartDate(today);
    setValues?.([today, today]);
    setInputStr(
      (() => {
        return `${pad(today.getDate(), 2)}-${pad(
          today.getMonth() + 1,
          2
        )}-${today.getFullYear()} ~ ${pad(today.getDate(), 2)}-${pad(
          today.getMonth() + 1,
          2
        )}-${today.getFullYear()}`;
      })()
    );
    setAnchorEl(null);
  };
  const makeSelection = (e) => {
    e.stopPropagation();
    if (!(selectedStartDate && selectedEndDate)) return;

    setValues?.([selectedStartDate, selectedEndDate]);
    setInputStr(
      (() => {
        return `${pad(selectedStartDate.getDate(), 2)}-${pad(
          selectedStartDate.getMonth() + 1,
          2
        )}-${selectedStartDate.getFullYear()} ~ ${pad(
          selectedEndDate.getDate(),
          2
        )}-${pad(
          selectedEndDate.getMonth() + 1,
          2
        )}-${selectedEndDate.getFullYear()}`;
      })()
    );
    setAnchorEl(null);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };
  return (
    <Stack onClick={clickHandler} sx={{ position: "relative" }}>
      <InputWithAdornment
        left={<CalendarMonthIcon opacity={0.5} />}
        className="!bg-white border !border-[#D0D5DD] min-w-[170px]"
        style={{
          backgroundColor: "white",
          cursor: "pointer",
          width: "100%",
          minWidth: "170px",
          borderRadius: "3px",
          border: "1px solid #D0D5DD",
          height: "40px",
        }}
        value={inputStr}
        placeholder={placeholder}
        onInput={(e) => {
          const pattern =
            /([\d_]{0,2}?)-([\d_]{0,2}?)-([\d_]{0,4}?) ~ ([\d_]{0,2}?|__)-([\d_]{0,2}?)-([\d_]{0,4}?)/;

          const oldValue = e.currentTarget.value;

          const sanitized = oldValue.replace(/[\_\~\s]*/g, "");

          let newStr = sanitized.replace(
            /(\d{0,2}?)(\d{0,2}?)(\d{0,4}?)/,
            function (full, startDay, startMonth, startYear) {
              return startDay.length > 1
                ? startDay
                : startDay + "_" + "-" + startMonth + "-" + startYear;
            }
          );
          e.currentTarget.value = newStr;
        }}
        readOnly
        onChange={(e) => {
          const { value } = e.currentTarget;

          setInputStr(value);
        }}
        {...rest}
      />
      {Boolean(anchorEl) && (
        <Box
          ref={calendarRef}
          sx={{
            position: "absolute",
            top: 40,
            zIndex: 10000000,
            left: position === "start" ? -100 : null,
            right: position !== "start" ? 0 : null,
            ...calendarSx,
          }}
        >
          <Box
            sx={{
              width: "492px",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "background.lightest",

              filter:
                "drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06))",
            }}
          >
            <Typography
              variant="h6"
              color="secondary.main"
              sx={{ borderBottomWidth: "1px", p: 4, width: "100%" }}
            >
              {(!!(selectedStartDate && selectedEndDate) &&
                (() => {
                  return `${pad(selectedStartDate.getDate(), 2)}-${pad(
                    selectedStartDate.getMonth() + 1,
                    2
                  )}-${selectedStartDate.getFullYear()} ~${pad(
                    selectedEndDate.getDate(),
                    2
                  )}-${pad(
                    selectedEndDate.getMonth() + 1,
                    2
                  )}-${selectedEndDate.getFullYear()}   (dd-MM-yyyy)`;
                })()) ||
                placeholder}
            </Typography>

            <Box ref={monthRef}>
              <Stack
                sx={{ width: "100%", borderBottomWidth: "1px", pr: 2 }}
                direction="row"
                spacing={2}
              >
                <SingleMonth
                  disabled={false}
                  selectedEndDate={selectedEndDate}
                  date={startDate}
                  setDate={setStartDate}
                  selectedStartDate={selectedStartDate}
                  setSelectedStartDate={setSelectedStartDate}
                  onClick={pickDateHandler}
                  min={min}
                  max={max}
                />
                <Box
                  sx={{
                    minHeight: "274px",
                    width: "1px",
                    backgroundColor: "#D9D9D9",
                  }}
                ></Box>
                <SingleMonth
                  disabled={false}
                  selectedEndDate={selectedEndDate}
                  date={endDate}
                  setDate={setEndDate}
                  selectedStartDate={selectedStartDate}
                  setSelectedStartDate={setSelectedStartDate}
                  onClick={pickDateHandler}
                  min={min}
                  max={max}
                />
              </Stack>
              <Stack
                justifyContent={"space-between"}
                alignItems="center"
                p={4}
                direction="row"
              >
                <Stack justifyContent={"flex-start"} alignItems="center">
                  <CustomButton
                    text={"today"}
                    fontSize="0.75rem"
                    onClick={pickToday}
                    color={"secondary"}
                  />
                </Stack>
                <CustomButton
                  text={"Ok"}
                  fontSize="0.75rem"
                  color={"secondary"}
                  disabled={!Boolean(selectedStartDate && selectedEndDate)}
                  onClick={makeSelection}
                />
                {/* <button
                
                  className="bg-point-blue text-white flex justify-center items-center font-medium text-xs rounded p-1.5 disabled:bg-[#D3E2EE]"
                >
                  OK
                </button> */}
              </Stack>
            </Box>
          </Box>
        </Box>
      )}
    </Stack>
  );
};

export default DateRangePicker;
