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
import CheckIcon from "@mui/icons-material/Check";
import CustomButton from "./CustomButton";

const Item = ({ item, trayItemKeys, handleClick, selectedItems }) => {
  const isSelecetd = selectedItems.filter((current) => current._id === item._id)
    .length
    ? true
    : false;
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={3}
      onClick={() => handleClick(item, isSelecetd ? "unSelect" : "select")}
      sx={{
        width: "100%",
        borderBottom: "1px solid #979797",
        cursor: "pointer !important",
        pl: 1,
        pt: 1,
        pr: 1,
        color: isSelecetd ? "secondary.main" : "primary.main",

        opacity: "0.7",
        "&:hover": {
          opacity: "1",
        },
      }}
    >
      {trayItemKeys?.map((k) => (
        <Typography sx={{ fontWeight: "bold" }} key={k}>
          {item[k]}
        </Typography>
      ))}
      {isSelecetd ? <CheckIcon size="small" color={"secondary"} /> : null}
    </Stack>
  );
};
function SearchSelectDropdown({
  placeholder,
  onAdd = () => {},
  handleOnselect = () => {},
  title,
  createBtnTxt = "",
  createBtnAction = () => {},
  readOnly = false,
  boxSx = {},
  defaultValue = "",
  traySx = {},
  data = [],
  isLoading = false,
  search,
  setsearch,
  reFetch = () => {},
  showAddBtn = false,
  selectedItems = [],
  noDataTxt = "No data matching search criteria",
  trayItemKeys = ["itemName"],
}) {
  const [showTray, setshowTray] = React.useState(false);
  // React.useEffect(() => {
  //   if (!search) setshowTray(false);
  // }, [search]);

  const handleAdd = () => {
    onAdd();
    setshowTray(false);
  };
  const handleCreateBtn = () => {
    createBtnAction();
    setshowTray(false);
  };
  const handleChange = (e) => {
    setsearch(e.target.value);

    setshowTray(true);
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
      <CustomTextInput
        value={search || defaultValue}
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
            top: "70px",
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
              height: "150px",
              overflowY: "auto",
            }}
          >
            {data?.length ? (
              data.map((item, i) => (
                <Item
                  item={item}
                  key={i}
                  handleClick={handleOnselect}
                  trayItemKeys={trayItemKeys}
                  selectedItems={selectedItems}
                />
              ))
            ) : (
              <Typography>{noDataTxt}</Typography>
            )}
          </Stack>
          <Stack
            direction={"row"}
            width="100%"
            justifyContent={"space-between"}
          >
            {showAddBtn && (
              <CustomButton
                text={"Add"}
                variant="lightSecondary"
                onClick={handleAdd}
              />
            )}

            {createBtnTxt && (
              <Button
                variant="text"
                startIcon={<AddCircleIcon />}
                onClick={handleCreateBtn}
              >
                {createBtnTxt}
              </Button>
            )}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}

export default SearchSelectDropdown;
