import React from "react";

function YearsDropdown() {
  return (
    <TextField
      id="filled-search"
      placeholder="Search"
      type="text"
      variant="outlined"
      value={search}
      size="small"
      onChange={(e) => setsearch(e.target.value)}
      sx={{
        "& .MuiInputBase-root.MuiOutlinedInput-root": {
          borderBottomLeftRadius: "0px",
          borderTopLeftRadius: "0px",
        },
        "& .MuiOutlinedInput-root:hover": {
          "& > fieldset": {
            borderLeftColor: "transparent",
          },
        },
        "& .MuiOutlinedInput-root.Mui-focused": {
          "& > fieldset": {
            borderColor: "gray",
            borderLeftColor: "transparent",
          },
        },
      }}
    />
  );
}

export default YearsDropdown;
