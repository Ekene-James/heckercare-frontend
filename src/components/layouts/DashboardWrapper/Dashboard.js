import * as React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import { styled, useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MuiDrawer from "@mui/material/Drawer";
import { Outlet, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../../../store/contextStore/auth/AuthStore";
import { logout } from "../../../store/contextStore/auth/AuthActions";

import CollapseableItemPc from "./CollapseableItemPc";
import CollapseableItemMobile from "./CollapseableItemMobile";
import TopBar from "./TopBar";
import { sidebarData } from "utils/data";
import withSocket from "./withSocket";
const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),

  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const PcDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

function Dashboard(props) {
  const { window } = props;
  const theme = useTheme();
  const authCtx = React.useContext(AuthContext);
  const socket = withSocket();

  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [pcopen, setpcopen] = React.useState(true);

  const handleLogout = () => {
    authCtx.dispatch(logout(navigate));
  };

  const handleDrawerToggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerTogglePc = () => {
    setpcopen(!pcopen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <TopBar
        handleDrawerToggleMobile={handleDrawerToggleMobile}
        pcopen={pcopen}
        socket={socket}
      />
      {/* Drawer for Mobile screen*/}

      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "#020011",
            color: "#6D7175",
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggleMobile}>
            <ChevronLeftIcon sx={{ color: "white" }} />
          </IconButton>
        </DrawerHeader>
        <Divider
          sx={{
            "&.MuiDivider-root": {
              borderColor: "gray",
            },
          }}
        />
        <CollapseableItemMobile
          items={sidebarData}
          handleDrawerToggleMobile={handleDrawerToggleMobile}
        />
      </Drawer>

      {/* Drawer for Big screen*/}
      <PcDrawer
        variant="permanent"
        open={pcopen}
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            backgroundColor: "#020011",
            boxSizing: "border-box",
            color: "#6D7175",
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerTogglePc}>
            {!pcopen ? (
              <ChevronRightIcon sx={{ color: "white" }} />
            ) : (
              <ChevronLeftIcon sx={{ color: "white" }} />
            )}
          </IconButton>
        </DrawerHeader>

        <CollapseableItemPc items={sidebarData} sidebarOpen={pcopen} />
      </PcDrawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,

          m: 0,
          width: "100vw",
          bgcolor: "background.custom",
          //backgroundColor: "rgb(236,236,236)",
          minHeight: "100vh",
          overflow: "auto",
          maxWidth: "100% !important",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Dashboard;
