import { Box, FormHelperText, InputLabel, TextField } from "@mui/material";
import React from "react";
import StarIcon from "@mui/icons-material/Star";
function CustomTextInput({
  title = "",
  disabled = "false",
  value = "",
  type = "text",
  defaultValue = "",
  variant = "outlined",
  handleChange = () => {},
  handleKeyDown = () => {},
  readOnly = false,
  fullWidth = true,
  name,
  placeholder,
  multiline = false,
  helperText,
  sx = {},
  boxSx = {},
  inputProps = {},
  required = false,
  grayBg = false,
  id,
  rows = 4,
  ...otherProps
}) {
  return (
    <Box sx={{ mt: 1, ...boxSx }}>
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
            textTransform: "capitalize",
          }}
          htmlFor={name}
        >
          {title}
          {required && (
            <StarIcon
              sx={{
                color: "red",
                fontSize: "8px",
                position: "absolute",
                right: "-10px",
                top: 0,
              }}
            />
          )}
        </InputLabel>
      )}
      <TextField
        type={type}
        name={name}
        disbaled={disabled}
        id={id || title}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={value || defaultValue}
        variant={variant}
        fullWidth={fullWidth}
        multiline={multiline}
        rows={rows}
        InputProps={{
          readOnly: readOnly,
          ...inputProps,
        }}
        placeholder={placeholder}
        sx={{
          backgroundColor: grayBg ? "background.custom" : null,
          "& .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-fullWidth.MuiInputBase-formControl.MuiInputBase-readOnly":
            {
              backgroundColor: "background.disabled",
            },
          ...sx,
        }}
        {...otherProps}
      />
      <FormHelperText error={otherProps?.error}>{helperText}</FormHelperText>
    </Box>
  );
}

export default CustomTextInput;
