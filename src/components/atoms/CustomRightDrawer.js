import { Close } from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";

const CustomRightDrawer = forwardRef(function RightDrawer(props, ref) {
  const {
    children,
    cleanUpFunc = () => {},
    drawerSx = {},
    boxSx = {},
    title,
    subTitle,
  } = props;
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    cleanUpFunc();
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
          ...drawerSx,
        },
      }}
      anchor="right"
      open={open}
      onClose={handleClose}
    >
      <Stack
        justifyItems="flex-start"
        alignItems="flex-start"
        sx={{
          padding: subTitle ? "66px" : "18px",
          paddingBottom: subTitle ? "22px" : "0px",
        }}
        direction="column"
        width={"100%"}
      >
        <IconButton
          sx={{
            marginLeft: "-12px",
          }}
          onClick={handleClose}
          aria-label="close right sided drawer"
        >
          <Close fontSize="small" />
        </IconButton>
        <HeadSection title={title} subTitle={subTitle} />
      </Stack>
      <Divider light sx={{ width: "100%" }} />
      <Box
        sx={{
          width: "100%",
          padding: "0px 66px",
          paddingBottom: "66px",
          ...boxSx,
        }}
      >
        {open && children}
      </Box>
    </Drawer>
  );
});

const HeadSection = ({ title = "Create Drug Order", subTitle = "" }) => {
  return (
    <Box
      sx={{
        gap: "10px",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Typography variant="displayLg">{title}</Typography>
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
// CustomRightDrawer.propTypes = {
//   cleanUpFunc: PropTypes.func,
//   children: PropTypes.node,
//   title: PropTypes.node,
//   subTitle: PropTypes.node,
// };
export default CustomRightDrawer;
