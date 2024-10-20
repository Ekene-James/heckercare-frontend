import { Close } from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";

function RightDrawer({
  children,
  open,
  setOpen,
  closeHandler,
  title,
  subTitle,
}) {
  const onClose = (e) => {
    closeHandler?.(e) || setOpen?.(false);
  };
  return (
    <Drawer
      PaperProps={{
        sx: {
          width: {
            xs: "100%",
            sm: "95%",
            md: "80%",
          },
          //   padding: "66px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: "36px",
          borderTopLeftRadius: "4px",
          borderBottomLeftRadius: "4px",
          overflow: "auto",
        },
      }}
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Stack
        justifyItems="flex-start"
        alignItems="flex-start"
        sx={{ padding: "66px", paddingBottom: "22px" }}
        direction="column"
      >
        <IconButton
          sx={{
            marginLeft: "-12px",
          }}
          onClick={onClose}
          aria-label="close right sided drawer"
        >
          <Close fontSize="small" />
        </IconButton>
        <HeadSection title={title} subTitle={subTitle} />
      </Stack>
      <Divider light sx={{ width: "100%" }} />
      <Box sx={{ width: "100%", padding: "0px 66px", paddingBottom: "66px" }}>
        {React.cloneElement(children, { onClose })}
      </Box>
    </Drawer>
  );
}

const HeadSection = ({ title = "Create Drug Order", subTitle = "" }) => {
  return (
    <Box
      sx={{
        gap: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header title={title} />
      <Typography
        variant="body1"
        sx={{
          color: "text.tertiary",
        }}
      >
        {subTitle}
      </Typography>
    </Box>
  );
};
RightDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func,
  closeHandler: PropTypes.func,
  children: PropTypes.node,
  title: PropTypes.node,
  subTitle: PropTypes.node,
};
export default RightDrawer;
