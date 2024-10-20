import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Box, FormHelperText, Typography } from "@mui/material";
import { useThemeCtx } from "store/contextStore/theme/ThemeStore";

export default function CustomSelect({
  options = [],
  label = "",
  state,
  handleChange,
  haveTopLabel = false,
  sx = {},
  boxSx = {},
  defaultValue = "",
  size = "small",
  name,
  placeholder = "Select from List",
  readOnly = false,
  id,
  helperText,
  variant = "standard",
  emptyOptionsText = "No Options",
  ...otherProps
}) {
  const { state: themeState } = useThemeCtx();
  const formatSelected = (selected) => {
    if (options?.length) {
      const isArrObj = typeof options[0] === "object";
      if (isArrObj) {
        const data = options.find((option) => option.value === selected);

        return data?.name ? data?.name : "";
      } else {
        return selected;
      }
    }
  };

  return (
    <>
      {haveTopLabel ? (
        <Box sx={{ minWidth: 120, width: "100%", pt: 0.9, ...boxSx }}>
          {label && (
            <InputLabel
              id={label}
              sx={{
                mb: 1,
                fontWeight: "600",
                lineHeight: "18px",
                color: "primary.formLabel",
                fontSize: "0.86rem",
              }}
            >
              {label}
            </InputLabel>
          )}
          <Select
            labelId={label}
            displayEmpty
            id={id || label}
            value={state || defaultValue}
            onChange={handleChange}
            name={name}
            fullWidth
            readOnly={readOnly}
            sx={{ backgroundColor: readOnly ? "background.gray3" : "", ...sx }}
            MenuProps={{
              PaperProps: {
                sx: {
                  border: "1px solid rgba(132, 132, 132, 0.15)",
                  backgroundColor: themeState.lightTheme
                    ? "white"
                    : "black !important",
                },
              },
            }}
            renderValue={(selectedValue) =>
              !selectedValue ? (
                <Typography sx={{ color: "primary.lightGrey" }}>
                  {placeholder}
                </Typography>
              ) : (
                formatSelected(selectedValue) || ""
              )
            }
            {...otherProps}
          >
            {options.length ? (
              options?.map((option, i) => (
                <MenuItem
                  key={i}
                  value={typeof option === "object" ? option.value : option}
                >
                  {typeof option === "object" ? option.name : option}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>{emptyOptionsText}</MenuItem>
            )}
          </Select>
          <FormHelperText error={otherProps?.error}>
            {helperText}
          </FormHelperText>
        </Box>
      ) : (
        <FormControl variant={variant} sx={{ m: 1, minWidth: 120 }} size={size}>
          <InputLabel id={label}>{label}</InputLabel>
          <Select
            labelId={label}
            id={label}
            value={state}
            onChange={handleChange}
            label={label}
            name={name}
            MenuProps={{
              PaperProps: {
                sx: {
                  border: "1px solid rgba(132, 132, 132, 0.15)",
                  zIndex: "10000000",
                },
              },
            }}
          >
            {options.map((option, i) => (
              <MenuItem key={i} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </>
  );
}
