import React, { forwardRef, useImperativeHandle } from "react";
import Backdrop from "@mui/material/Backdrop";
import { Box, IconButton, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CustomModal = forwardRef(function Modal(props, ref) {
  const {
    children,
    childrenContSx,
    ariaLabel = "modal",
    cleanUp = () => {},
    backdropSx = {},
  } = props;
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    cleanUp();
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };
  useImperativeHandle(ref, () => {
    return {
      handleToggle,
    };
  });
  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        m: "0px !important",
        ...backdropSx,
      }}
      open={open}
      aria-label={ariaLabel}
    >
      <Box
        sx={{
          maxWidth: "90%",
          maxHeight: "95%",
          overflowY: "auto",
          // m: "0px !important",
        }}
      >
        <Paper
          sx={{
            p: 2,
            width: "auto",
            minHeight: "40%",
            margin: "auto",
            minWidth: {
              xs: "90%",
              sm: "30%",
            },
            // m: "0px !important",

            position: "relative",
            ...childrenContSx,
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: "1%",
              right: "2%",
              // zIndex: 10000000,
            }}
          >
            <CloseIcon />
          </IconButton>

          {open ? children : null}
        </Paper>
      </Box>
    </Backdrop>
  );
});

export default CustomModal;
