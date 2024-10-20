import { IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

function CustomCheckbox({
  onClick = () => {},
  desc,
  item = {},
  checkColor = "primary.main",
  autoCheck = false,
  disabled = false,
}) {
  const [isSelected, setisSelected] = React.useState(false);

  React.useMemo(() => {
    if (autoCheck) {
      setisSelected(true);
    } else {
      setisSelected(false);
    }
  }, [autoCheck]);

  const handleClick = (state) => {
    setisSelected(state);
    onClick(state, item);
  };
  return (
    <Stack direction={"row"} spacing={1} alignItems="center">
      {isSelected ? (
        <IconButton
          onClick={handleClick.bind(this, false)}
          aria-label="check-box"
          disabled={disabled}
        >
          <CheckBoxIcon sx={{ color: checkColor, fontSize: "20px" }} />
        </IconButton>
      ) : (
        <IconButton
          onClick={handleClick.bind(this, true)}
          aria-label="uncheck-box"
          disabled={disabled}
        >
          <CheckBoxOutlineBlankIcon
            sx={{ color: "#DFDFDF", fontSize: "20px" }}
          />
        </IconButton>
      )}
      {desc && (
        <Typography sx={{ textTransform: "capitalize" }}>{desc}</Typography>
      )}
    </Stack>
  );
}

export default CustomCheckbox;
