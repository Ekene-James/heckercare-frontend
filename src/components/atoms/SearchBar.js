import React from "react";
import { Box, CircularProgress, IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function SearchBar({
  placeholder = "Search",
  width = "auto",
  icnBtnSx = {},
  isLoading,
  refetch,
  search,
  setsearch,
}) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") refetch();
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width,
      }}
    >
      <IconButton
        size="medium"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={refetch}
        color="inherit"
        sx={{
          background: "transparent",
          borderRadius: "2px",
          borderBottomRightRadius: "0px",
          borderTopRightRadius: "0px",
          border: "1px solid rgba(132, 132, 132, 0.15)",
          borderRightColor: "transparent",
          pt: 0.7,
          pb: 0.7,
          ...icnBtnSx,
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <Box p={0} m={0} height={24}>
            <CircularProgress size={18} color="inherit" />
          </Box>
        ) : (
          <SearchIcon sx={{ color: "#7C7B7B" }} />
        )}
      </IconButton>
      <TextField
        id="filled-search"
        placeholder={placeholder}
        type="text"
        variant="outlined"
        value={search}
        size="small"
        onChange={(e) => setsearch(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{
          width,
          "& .MuiInputBase-root.MuiOutlinedInput-root": {
            borderBottomLeftRadius: "0px",
            borderTopLeftRadius: "0px",
            fontSize: "0.875rem",
          },
          "& .MuiOutlinedInput-root:hover": {
            "& > fieldset": {
              border: "1px solid rgba(132, 132, 132, 0.15)",
              borderLeftColor: "transparent",
            },
          },
          "& .MuiOutlinedInput-root.Mui-focused": {
            "& > fieldset": {
              borderColor: "gray",
              border: "1px solid rgba(132, 132, 132, 0.15)",
              borderLeftColor: "transparent",
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "1px solid rgba(132, 132, 132, 0.15)",

            borderLeftColor: "transparent",
            left: "-1px",
          },
        }}
      />
    </Box>
  );
}

export default SearchBar;
