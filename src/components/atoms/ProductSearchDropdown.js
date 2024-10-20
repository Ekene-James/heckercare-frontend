import {
  Box,
  Button,
  InputAdornment,
  InputLabel,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import CustomTextInput from "./CustomTextInput";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "@mui/icons-material/Search";

function ProductSearchDropdown({
  placeholder,

  handleOnselect,
  title,
  createBtnTxt = "",
  createBtnAction = () => {},
  readOnly = false,
  boxSx = {},
  defaultValue = "",
  traySx = {},
  data = [],
  isLoading = false,
  searchProducts,
  setsearchProducts,
  reFetch = () => {},
  setOnSelect = () => {},
  noDataTxt = "No data matching search criteria",
  trayItemKeys = ["drugName", "drugType", "availableQuantity"],
}) {
  const [showTray, setshowTray] = React.useState(false);
  // React.useEffect(() => {
  //   if (!search) setshowTray(false);
  // }, [search]);

  const handleChange = (e) => {
    setOnSelect(false);
    setsearchProducts(e.target.value);

    setshowTray(true);
  };
  const handleClick = (item) => {
    handleOnselect(item);
    setshowTray(false);
    // setsearch("");
  };
  const handleOnBlur = (event) => {
    event.preventDefault();

    if (!event.currentTarget.contains(event.relatedTarget)) {
      setshowTray(false);
    }
  };
  return (
    <Box
      sx={{
        position: "relative",
        pt: 0.9,
        ...boxSx,
      }}
      onBlur={handleOnBlur}
      tabIndex="0"
    >
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
      <CustomTextInput
        value={searchProducts || defaultValue}
        name="search"
        handleChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        onFocus={() => {
          setshowTray(true);
          reFetch();
        }}
        inputProps={{
          endAdornment: isLoading ? (
            <InputAdornment position="end">
              <CircularProgress color="inherit" size={15} />
            </InputAdornment>
          ) : (
            <SearchIcon color="inherit" opacity={0.5} />
          ),
        }}
      />
      {showTray && !readOnly ? (
        <Box
          sx={{
            backgroundColor: "background.lightest",
            boxShadow: "0px 4px 33px rgba(0, 0, 0, 0.1)",
            p: 1,
            position: "absolute",
            bottom: "-159px",
            border: "1px solid rgba(245, 245, 245, 1)",
            width: "100%",
            zIndex: 10000,
            ...traySx,
          }}
        >
          <Stack
            direction="column"
            alignItems="start"
            spacing={1}
            sx={{
              height: "105px",
              overflowY: "auto",
            }}
          >
            {data?.length ? (
              data.map((item, i) => (
                <Stack
                  direction="row"
                  key={i}
                  justifyContent="space-between"
                  spacing={3}
                  onClick={() => handleClick(item)}
                  sx={{
                    cursor: "pointer",
                    width: "100%",
                    borderTop: "1px solid #979797",
                    pl: 1,
                    pr: 1,

                    opacity: "0.6",
                    "&:hover": {
                      opacity: "1",
                    },
                  }}
                >
                  {trayItemKeys?.map((k) => (
                    <Typography key={k}>{item[k]}</Typography>
                  ))}
                </Stack>
              ))
            ) : (
              <Typography>{noDataTxt}</Typography>
            )}
          </Stack>
          {createBtnTxt && (
            <Button
              variant="text"
              sx={{ justifySelf: "end" }}
              startIcon={<AddCircleIcon />}
              onClick={createBtnAction}
            >
              {createBtnTxt}
            </Button>
          )}
        </Box>
      ) : null}
    </Box>
  );
}

export default ProductSearchDropdown;
