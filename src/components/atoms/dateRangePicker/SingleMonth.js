import useDisplayDays from "hooks/useDisplayDays";
import React, { useEffect, useMemo, useRef, useState } from "react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  days,
  getDateString,
  getYearsFrom,
  isDayFutureToThatDay,
  isDayInBetweenDaysInclusive,
  isDayPreviousToThatDay,
  isNextMonth,
  isPrevMonth,
  isToday,
  months,
} from "./utils/utilFuncs";
import { Button, Grid, IconButton, Stack } from "@mui/material";
import CustomButton from "../CustomButton";
import { blue } from "@mui/material/colors";
export const SingleMonth = (props) => {
  const {
    date,
    setDate,
    selectedStartDate,
    setSelectedStartDate,
    disabled,
    selectedEndDate,
    onClick,
    min,
    max,
  } = props;

  const [showMonths, setShowMonths] = useState(false);
  const goToNextMonth = () => {
    if (disabled) return;
    setDate(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth() + 1,
          prev.getDate(),
          prev.getHours()
        )
    );
  };
  const goToPrevMonth = () => {
    if (disabled) return;
    setDate(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth() - 1,
          prev.getDate(),
          prev.getHours()
        )
    );
  };

  const toggleDateView = () => {
    setShowMonths((prev) => !prev);
  };
  return (
    <Stack spacing={3} width={"420px"} maxWidth="50%" sx={{ p: 4, pr: 0 }}>
      <Stack
        width={"100%"}
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <IconButton onClick={goToPrevMonth}>
          <NavigateBeforeIcon />
        </IconButton>
        <CustomButton
          text={`${months[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`}
          fontSize="0.75rem"
          color={"secondary"}
          sx={{
            pt: 1,
            pb: 1,
            fontSize: "0.75rem",
            fontWeight: "500px",
            // lineHeight: "160px",
            borderRadius: "0.375rem",
          }}
          onClick={toggleDateView}
        />
        <IconButton onClick={goToNextMonth}>
          <NavigateNextIcon />
        </IconButton>
      </Stack>
      {showMonths ? (
        <MonthYearView setDate={setDate} setShowMonths={setShowMonths} />
      ) : (
        <DaysView
          {...{
            date,
            setDate,
            selectedStartDate,
            setSelectedStartDate,
            disabled,
            selectedEndDate,
            onClick,
            min,
            max,
          }}
        />
      )}
    </Stack>
  );
};

export const DaysView = (props) => {
  const {
    date,

    selectedStartDate,
    setSelectedStartDate,
    disabled,
    selectedEndDate,
    onClick,
    min,
    max,
  } = props;
  const displayableDays = useDisplayDays(date);
  const [internalEndDate, setInternalEndDate] = useState(selectedEndDate);
  const minDate = min && new Date(min);
  const maxDate = max && new Date(max);
  return (
    <main id="mainbody" role="grid" className="w-full">
      <div
        className="grid grid-cols-7 w-full mb-3"
        role="group"
        aria-label="Days of Week"
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(7,minmax(0,1fr))",

          marginBottom: "15px",
        }}
      >
        {days.map((day) => {
          const res = day.slice(0, 2);
          return (
            <div
              role="gridcell"
              key={day}
              className="col-span-1 text-point-blue flex justify-center items-center bg-white  font-light text-sm  leading-[160%]"
              sx={{
                display: "flex",
                gridColumn: "span 1 / span 1",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: 300,
                fontSize: "0.75rem",
                lineHeight: "160%",
                backgroundColor: "white",
              }}
            >
              {res}
            </div>
          );
        })}
      </div>

      <div
        role="group"
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(7,minmax(0,1fr))",
          gridTemplateRows: "repeat(5,minmax(0,1fr))",
          columnGap: "4px",
          rowGap: 0,
        }}
        className="w-full grid grid-cols-7 grid-rows-5 grid-flow-row gap-x-0 gap-y-1"
      >
        {displayableDays.map((day, ind) => {
          return (
            <button
              type="button"
              onMouseEnter={() => {
                if (!selectedStartDate || disabled) return;
                if (selectedStartDate && selectedEndDate) return;
                setInternalEndDate(day);
              }}
              onMouseOut={() => (disabled ? null : setInternalEndDate(null))}
              onClick={(e) => {
                if (isPrevMonth(date, day) || isNextMonth(date, day)) return;
                onClick ? onClick(day) : setSelectedStartDate?.(day);
              }}
              disabled={
                disabled ||
                !!(min && minDate && isDayPreviousToThatDay(minDate, day)) ||
                !!(max && maxDate && isDayFutureToThatDay(maxDate, day))
              }
              key={getDateString(day)}
              style={{
                display: "flex",
                gridColumn: "span 1 / span 1",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "32px",
                borderRadius: "2px",
                fontWeight: 500,
                fontSize: "0.75rem",
                lineHeight: "160%",
                padding: "12px 8px",
                border: "none",
                ...(!!(
                  min &&
                  minDate &&
                  isDayPreviousToThatDay(minDate, day)
                ) || !!(max && maxDate && isDayFutureToThatDay(maxDate, day))
                  ? {
                      color: "green",
                      fontWeight: 300,
                      background: "white",
                      borderRadius: 0,
                    }
                  : {
                      color: "blue",
                    }),
                ...(isToday(day)
                  ? {
                      cursor: "pointer",
                      border: "1px solid rgb(0,50,80)",
                      borderRadius: "12px",
                    }
                  : {}),
                ...((selectedEndDate || internalEndDate) && selectedStartDate
                  ? isDayInBetweenDaysInclusive(
                      day,
                      selectedStartDate,
                      selectedEndDate || internalEndDate
                    )
                    ? getDateString(selectedStartDate) === getDateString(day) ||
                      getDateString(selectedEndDate || internalEndDate) ===
                        getDateString(day) ||
                      isNextMonth(date, day) ||
                      isPrevMonth(date, day)
                      ? {}
                      : {
                          backgroundColor: "#D3E2EE",
                        }
                    : {}
                  : {}),
                ...(selectedStartDate
                  ? getDateString(selectedStartDate) === getDateString(day)
                    ? {
                        backgroundColor: "#1C3C54",
                        color: "white",
                        borderRadiusTopLeft: "8px",
                        borderRadiusBottomLeft: "8px",
                      }
                    : {}
                  : {}),
                ...(selectedEndDate || internalEndDate
                  ? getDateString(selectedEndDate || internalEndDate) ===
                    getDateString(day)
                    ? isNextMonth(date, day) || isPrevMonth(date, day)
                      ? {}
                      : {
                          backgroundColor: "#1C3C54",
                          color: "white",
                          borderRadiusTopRight: "8px",
                          borderRadiusBottomRight: "8px",
                        }
                    : {}
                  : {}),
                ...(isPrevMonth(date, day) || isNextMonth(date, day)
                  ? {
                      fontWeight: 300,
                      color: "green",
                      backgroundColor: "white",
                      borderRadius: 0,
                    }
                  : {}),
              }}
              // className={`flex col-span-1 flex-col justify-center items-center
              //         h-8 rounded-sm
              //     font-medium text-xs leading-[160%] px-2 py-3

              //     ${
              //       !!(
              //         min &&
              //         minDate &&
              //         isDayPreviousToThatDay(minDate, day)
              //       ) ||
              //       !!(max && maxDate && isDayFutureToThatDay(maxDate, day))
              //         ? "text-point-secondary-text font-light bg-white rounded-none"
              //         : "text-point-secondary-bg"
              //     }

              //     ${
              //       isToday(day)
              //         ? "!cursor-pointer border border-point-green-dark rounded-xl text-point-primary-text hover:!bg-[#1C3C54] hover:!text-white hover:!rounded-full"
              //         : ""
              //     }

              //         ${
              //           (selectedEndDate || internalEndDate) &&
              //           selectedStartDate
              //             ? isDayInBetweenDaysInclusive(
              //                 day,
              //                 selectedStartDate,
              //                 selectedEndDate || internalEndDate
              //               )
              //               ? getDateString(selectedStartDate) ===
              //                   getDateString(day) ||
              //                 getDateString(
              //                   selectedEndDate || internalEndDate
              //                 ) === getDateString(day) ||
              //                 isNextMonth(date, day) ||
              //                 isPrevMonth(date, day)
              //                 ? ""
              //                 : "bg-[#D3E2EE] hover:disabled:bg-[#D3E2EE]"
              //               : ""
              //             : ""
              //         }
              //         ${
              //           selectedStartDate
              //             ? getDateString(selectedStartDate) ===
              //               getDateString(day)
              //               ? "bg-[#1C3C54] text-[#ffffff] rounded-tl-2xl rounded-bl-2xl hover:disabled:bg-[#1C3C54] hover:rounded-tr-none hover:rounded-br-none"
              //               : ""
              //             : ""
              //         }
              //         ${
              //           selectedEndDate || internalEndDate
              //             ? getDateString(
              //                 selectedEndDate || internalEndDate
              //               ) === getDateString(day)
              //               ? isNextMonth(date, day) || isPrevMonth(date, day)
              //                 ? ""
              //                 : "bg-[#1C3C54] text-[#ffffff] rounded-tr-2xl rounded-br-2xl hover:disabled:rounded-tr-2xl hover:disabled:rounded-br-2xl hover:disabled:bg-[#1C3C54] hover:disabled:text-white"
              //               : ""
              //             : ""
              //         }
              //         hover:bg-[#1C3C54] hover:rounded-2xl hover:text-white
              //         hover:disabled:rounded-none hover:disabled:bg-white hover:disabled:text-point-primary-text
              //         disabled:hover:text-point-secondary-text disabled:hover:cursor-text
              //         ${
              //           isPrevMonth(date, day) || isNextMonth(date, day)
              //             ? "hover:!bg-white hover:rounded-none !text-point-secondary-text font-light !bg-white rounded-none"
              //             : ""
              //         }
              //     `}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
      {/* </main> */}
    </main>
  );
};

export const MonthYearView = (props) => {
  const { setDate, setShowMonths } = props;
  const today = new Date();
  const viewRef = useRef(null);
  const years = useMemo(() => {
    const oldYears = getYearsFrom(1998);
    for (let i = today.getFullYear() + 1; i < today.getFullYear() + 20; i++) {
      oldYears.unshift(i);
    }
    return oldYears;
  }, []);

  useEffect(() => {
    viewRef.current?.scrollTo({ top: 200 * 7 });
  }, [years]);
  const selectDate = (year, monthIdx) => {
    setDate(new Date(year, monthIdx, today.getDate()));
    setShowMonths(false);
  };
  return (
    <div
      ref={viewRef}
      className="w-full flex flex-col gap-3 h-[200px] scroller overflow-auto"
    >
      {years.map((year) => {
        return (
          <div
            key={year}
            className="w-full flex justify-start items-center gap-1.5"
          >
            <h5 className="text-sm">{year}</h5>
            <div className="grid gap-x-1 gap-y-0.5 flex-1 grid-cols-4">
              {months.map((month, idx) => (
                <button
                  onClick={() => selectDate(year, idx)}
                  className="col-span-1 text-[13px] text-point-blue hover:bg-point-input-bg"
                  key={month + year}
                >
                  {month.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
