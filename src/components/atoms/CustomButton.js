import { Button } from "@mui/material";
import React from "react";

function CustomButton({ sx, variant = "contained", text, rgb, ...other }) {
  if (variant === "containedBrown") {
    return (
      <Button
        variant="contained"
        sx={{
          backgroundColor: "background.gray3",
          color: "primary.main",
          "&:hover": {
            backgroundColor: "background.gray3",
            opacity: 0.8,
          },
          ...sx,
        }}
        {...other}
      >
        {text}
      </Button>
    );
  } else if (variant === "lightSuccess") {
    return (
      <Button
        variant="contained"
        color="success"
        sx={{
          backgroundColor: "background.lightSuccess",
          color: "primary.success",
          "&:hover": {
            backgroundColor: "background.lightSuccess",
            color: "primary.success",
            opacity: 0.9,
          },
          ...sx,
        }}
        {...other}
      >
        {text}
      </Button>
    );
  } else if (variant === "lightSecondary") {
    return (
      <Button
        variant="contained"
        color="secondary"
        sx={{
          backgroundColor: "background.lightBlue",
          color: "secondary.main",
          "&:hover": {
            backgroundColor: "background.lightBlue",
            color: "secondary.main",
            opacity: 0.9,
          },
          ...sx,
        }}
        {...other}
      >
        {text}
      </Button>
    );
  } else if (variant === "custom") {
    return (
      <Button
        variant="contained"
        sx={{
          backgroundColor: `rgba(${rgb},0.1)`,
          color: `rgba(${rgb},1)`,
          "&:hover": {
            backgroundColor: `rgba(${rgb},0.1)`,
            color: `rgba(${rgb},1)`,
            opacity: 0.9,
          },
          ...sx,
        }}
        {...other}
      >
        {text}
      </Button>
    );
  }
  return (
    <Button sx={{ ...sx }} variant={variant} {...other}>
      {text}
    </Button>
  );
}

export default CustomButton;
