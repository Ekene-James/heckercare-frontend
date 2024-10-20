import * as React from "react";
import StarIcon from "@mui/icons-material/Star";
import { CalendarPicker } from "@mui/x-date-pickers/CalendarPicker";
import { MonthPicker } from "@mui/x-date-pickers/MonthPicker";
import { YearPicker } from "@mui/x-date-pickers/YearPicker";
import { Box, FormHelperText, InputLabel, TextField } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
const currentYear = new Date().getFullYear();
const minDate = new Date(`${currentYear - 2}-01-01T00:00:00.000`);
const maxDate = new Date(`${currentYear}-01-01T00:00:00.000`);

export default function CustomDatePicker({
  type,
  views = ["year"],
  placeholder = "Select Date",
  disableFuture = true,
  lightBorder = false,
  readOnly = false,
  title = "",
  size = "medium",
  datePickerSx = {},
  datePickerRootSx = {},
  defaultValue = "",
  boxSx = {},
  required = false,
  name = "",
  helperText,
  date,
  setdate,
  ...otherProps
}) {
  let DateType;

  switch (type) {
    case "calender":
      return (DateType = (
        <CalendarPicker date={date} onChange={(newDate) => setdate(newDate)} />
      ));
    case "month":
      return (DateType = (
        <MonthPicker
          date={date}
          disableFuture={disableFuture}
          onChange={(newDate) => setdate(newDate)}
          sx={{
            "&.MuiMonthPicker-root": {
              width: "100%",
            },
          }}
        />
      ));
    case "year":
      return (DateType = (
        <YearPicker
          date={date}
          minDate={minDate}
          maxDate={maxDate}
          onChange={(newDate) => {
            setdate(newDate);
          }}
        />
      ));
    case "date":
      return (DateType = (
        <Box sx={{ pt: title ? 0.9 : 0, ...boxSx }}>
          {title && (
            <InputLabel
              sx={{
                mb: 1,
                fontWeight: "600",
                lineHeight: "18px",
                color: "primary.formLabel",
                fontSize: "0.86rem",
                position: "relative",
                width: "fit-content",
                overflow: required ? "unset" : "hidden",
              }}
            >
              {title}
              {required && (
                <StarIcon
                  sx={{
                    color: "black",
                    fontSize: "8px",
                    position: "absolute",
                    right: "-10px",
                    top: 0,
                  }}
                />
              )}
            </InputLabel>
          )}

          <DatePicker
            views={views}
            value={date}
            size={size}
            name={name}
            readOnly={readOnly}
            disableFuture={disableFuture}
            onChange={(newDate) => {
              setdate(newDate, name);
            }}
            renderInput={(params) => {
              const parameter = {
                ...params,
                error: false,
              };
              return (
                <TextField
                  {...parameter}
                  inputProps={{
                    ...params.inputProps,
                    placeholder,
                    readOnly: readOnly,
                  }}
                  sx={{
                    ...datePickerSx,
                    "& .MuiInputBase-root": {
                      height: "36.5px",
                      ...datePickerRootSx,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: lightBorder
                        ? "1px solid rgba(132, 132, 132, 0.15)"
                        : null,
                    },
                    "& .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-fullWidth.MuiInputBase-formControl.MuiInputBase-readOnly":
                      {
                        backgroundColor: "background.disabled !important",
                      },
                  }}
                />
              );
            }}
            {...otherProps}
          />
          {!date && (
            <FormHelperText error={otherProps?.error}>
              {helperText}
            </FormHelperText>
          )}
        </Box>
      ));
    case "dateAndtime":
      return (DateType = (
        <Box>
          {title && (
            <InputLabel
              sx={{
                mb: 1,
                fontWeight: "600",
                lineHeight: "18px",
                color: "primary.formLabel",
                fontSize: "0.86rem",
              }}
            >
              {title}
            </InputLabel>
          )}
          <DateTimePicker
            value={date}
            name={name}
            onChange={(newDate) => {
              setdate(newDate, name);
            }}
            readOnly={readOnly}
            renderInput={(params) => {
              const parameter = {
                ...params,
                error: false,
              };
              return (
                <TextField
                  {...parameter}
                  inputProps={{
                    ...params.inputProps,
                    placeholder,
                  }}
                  sx={{
                    ...datePickerSx,
                    "& .MuiInputBase-root": {
                      height: "36.5px",
                      ...datePickerRootSx,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: lightBorder
                        ? "1px solid rgba(132, 132, 132, 0.15)"
                        : null,
                    },
                  }}
                />
              );
            }}
            {...otherProps}
          />
          <FormHelperText error={otherProps?.error}>
            {helperText}
          </FormHelperText>
        </Box>
      ));
    case "time":
      return (DateType = (
        <Box sx={{ pt: title ? 0.9 : 0 }}>
          {title && (
            <InputLabel
              sx={{
                mb: 1,
                fontWeight: "600",
                lineHeight: "18px",
                color: "primary.formLabel",
                fontSize: "0.86rem",
              }}
            >
              {title}
            </InputLabel>
          )}
          <TimePicker
            defaultValue={defaultValue}
            name={name}
            renderInput={(params) => {
              const parameter = {
                ...params,
                error: false,
              };
              return (
                <TextField
                  {...parameter}
                  inputProps={{
                    ...params.inputProps,
                    placeholder,
                  }}
                  sx={{
                    ...datePickerSx,
                    "& .MuiInputBase-root": {
                      height: "36.5px",
                      ...datePickerRootSx,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: lightBorder
                        ? "1px solid rgba(132, 132, 132, 0.15)"
                        : null,
                    },
                  }}
                />
              );
            }}
            value={date}
            onChange={(newValue) => {
              setdate(newValue, name);
            }}
            size={size}
            {...otherProps}
          />
          {!date && (
            <FormHelperText error={otherProps?.error}>
              {helperText}
            </FormHelperText>
          )}
        </Box>
      ));

    default:
      break;
  }
  return <>{DateType}</>;
}
