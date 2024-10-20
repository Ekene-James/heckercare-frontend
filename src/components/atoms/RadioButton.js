import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function RadioButtons({
  title,
  btns = [],
  value,
  setvalue,
  row,
}) {
  const handleChange = (event) => {
    setvalue(event.target.value);
  };
  return (
    <FormControl>
      {title && (
        <FormLabel
          sx={{ fontWeight: "bold" }}
          id="demo-radio-buttons-group-label"
        >
          {title}
        </FormLabel>
      )}
      <RadioGroup
        row={row}
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        {btns.map((btn) => (
          <FormControlLabel
            key={btn.value}
            value={btn.value}
            control={<Radio />}
            label={btn.name}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
