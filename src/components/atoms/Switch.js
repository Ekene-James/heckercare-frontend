import * as React from "react";
import Switch from "@mui/material/Switch";
import { Stack, Typography } from "@mui/material";

export default function CustomSwitch({
  checkedTitle,
  unCheckedTitle,
  handleCheck,
  color,
  successTextcolor = "",
  initialState = false,
  disabled = false,
}) {
  const [checked, setChecked] = React.useState(false);
  React.useMemo(() => setChecked(initialState), [initialState]);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    handleCheck(event.target.checked);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {unCheckedTitle && <Typography>{unCheckedTitle}</Typography>}
      <Switch
        disabled={disabled}
        checked={checked}
        color={color}
        onChange={handleChange}
        inputProps={{
          "aria-label":
            typeof (unCheckedTitle || checkedTitle) === "string"
              ? unCheckedTitle || checkedTitle
              : "controlled",
        }}
        sx={{
          "& .MuiSwitch-thumb": {
            border: "1px solid #979797",
          },
        }}
      />
      {checkedTitle && (
        <Typography
          sx={{
            // color: "success",
            color: checked ? successTextcolor : null,
          }}
        >
          {checkedTitle}
        </Typography>
      )}
    </Stack>
  );
}
