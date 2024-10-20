import * as React from "react";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, InputLabel, Menu, Typography } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Stack } from "@mui/system";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// function BasicMenu({ caption, items }) {
//   const anchorRef = React.useRef(null);
//   const [open, setOpen] = React.useState(false);

//   const handleClick = (item) => {
//     if (item?.onClick) item?.onClick();

//     setOpen(!open);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Stack
//         ref={anchorRef}
//         onClick={() => setOpen(true)}
//         direction={"row"}
//         alignItems="center"
//         justifyContent={"space-between"}
//         sx={{ width: "100%" }}
//       >
//         {caption}
//         <ArrowForwardIosIcon sx={{ opacity: 0.5, fontSize: "15px" }} />
//       </Stack>

//       <Menu
//         id="basic-menu"
//         anchorEl={anchorRef.current}
//         open={open}
//         onClose={handleClose}
//         MenuListProps={{
//           "aria-labelledby": "basic-button",
//         }}
//         anchorOrigin={{
//           vertical: "center",
//           horizontal: "right",
//         }}
//       >
//         {items.map((item, i) => (
//           <MenuItem key={item.name} onClick={() => handleClick(item)}>
//             {item.name}
//           </MenuItem>
//         ))}
//       </Menu>
//     </Box>
//   );
// }

export default function CustomMenu({
  icon = null,
  endIcon = <KeyboardArrowDownIcon />,
  caption,
  items = [],
  onClickItem = () => {},
  popperPlacement = "bottom-start",
  buttonSx = {},
  popperSx = {},
  label = "",
  btnVariant = "outlined",
  btnColor = "primary",
  disabled = false,
}) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  const handleClickItem = (e, itemClicked) => {
    onClickItem(itemClicked);
    if (!itemClicked?.items?.length) handleClose(e);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Box>
      {label && (
        <InputLabel
          id={label}
          sx={{
            mb: 1,
            mt: 0.8,
            fontWeight: "600",
            lineHeight: "18px",
            color: "primary.formLabel",
            fontSize: "0.86rem",
          }}
        >
          {label}
        </InputLabel>
      )}
      <Button
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? "composition-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        endIcon={endIcon}
        startIcon={icon}
        variant={btnVariant}
        color={btnColor}
        disabled={disabled}
        sx={{
          border: "1px solid rgba(132, 132, 132, 0.15)",
          ...buttonSx,
        }}
      >
        {caption}
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement={popperPlacement}
        transition
        disablePortal
        sx={{ zIndex: "100000", ...popperSx }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper
              sx={{
                border: "1px solid rgba(132, 132, 132, 0.15)",
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  {items.map((item, i) =>
                    typeof item === "string" ? (
                      <MenuItem
                        key={item}
                        onClick={(e) => handleClickItem(e, item)}
                      >
                        {item}
                      </MenuItem>
                    ) : (
                      <MenuItem
                        key={item.name}
                        onClick={(e) => handleClickItem(e, item)}
                        sx={{ pr: 0.5, width: "100%" }}
                      >
                        {item.name}
                        {/* {item?.items?.length ? (
                          <BasicMenu items={item.items} caption={item.name} />
                        ) : (
                          item.name
                        )} */}
                      </MenuItem>
                    )
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}
