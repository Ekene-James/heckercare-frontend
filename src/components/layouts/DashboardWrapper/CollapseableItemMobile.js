import React from "react";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import { Link, useLocation } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import Badge from "@mui/material/Badge";
import Divider from "@mui/material/Divider";
import { Box } from "@mui/material";
import { useAuthCtx } from "store/contextStore/auth/AuthStore";
const Collapseable = ({ item, handleDrawerToggleMobile }) => {
  const [open, setOpen] = React.useState(false);

  const { state } = useAuthCtx();
  const { authorisedRoutes } = state.user;

  const { pathname } = useLocation();
  const handleClick = () => {
    setOpen(!open);
  };
  const isDropdownItemSelected =
    item.subroutes.includes(pathname) ||
    pathname.includes(item?.isRouteIncludes);
  return (
    <Box>
      <ListItemButton
        onClick={handleClick}
        sx={{
          flexGrow: { xs: "0.03", sm: "1" },
          "&:hover": {
            background: isDropdownItemSelected
              ? "rgba(255, 255, 255, 0.3) !important"
              : "rgba(255, 255, 255, 0.2)",
          },
          "&.Mui-selected": {
            backgroundColor: isDropdownItemSelected
              ? "rgba(255, 255, 255, 0.09)"
              : "inherit",
            color: isDropdownItemSelected ? "#fff" : "#C4C4C4",
          },
        }}
        selected={isDropdownItemSelected}
      >
        <ListItemText
          primary={item.text}
          sx={{
            fontSize: "0.75rem !important",
            color: isDropdownItemSelected ? "#fff" : "#C4C4C4",
          }}
          disableTypography
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.subItem.map((subItem, i) =>
            authorisedRoutes?.includes(subItem.link) ? (
              <div key={i} style={{ margin: 0, padding: 0, width: "100%" }}>
                <Link
                  to={subItem.link}
                  style={{ textDecoration: "none", color: "inherit" }}
                  onClick={handleDrawerToggleMobile}
                >
                  <ListItemButton
                    sx={{
                      pl: 4,
                      fontSize: "0.938rem",
                      "&.Mui-selected": {
                        backgroundColor:
                          pathname === subItem.link ||
                          pathname.includes(subItem?.isRouteIncludes)
                            ? "rgba(255, 255, 255, 0.1)"
                            : "inherit",
                        color:
                          pathname === subItem.link ||
                          pathname.includes(subItem?.isRouteIncludes)
                            ? "#fff"
                            : "inherit",
                      },
                      "&:hover": {
                        background:
                          pathname === subItem.link ||
                          pathname.includes(subItem?.isRouteIncludes)
                            ? "rgba(255, 255, 255, 0.3) !important"
                            : "rgba(255, 255, 255, 0.2)",
                      },
                    }}
                    selected={
                      pathname === subItem.link ||
                      pathname.includes(subItem?.isRouteIncludes)
                    }
                  >
                    <ListItemIcon sx={{ color: "inherit" }}>
                      {subItem.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={subItem.text}
                      sx={{ fontSize: "0.688rem" }}
                      disableTypography
                    />
                  </ListItemButton>
                </Link>
              </div>
            ) : (
              ""
            )
          )}
        </List>
      </Collapse>
    </Box>
  );
};
const NonCollapseable = ({ item, handleDrawerToggleMobile }) => {
  const { pathname } = useLocation();
  const { state } = useAuthCtx();
  const { role } = state.user;

  if (item.text === "Dashboard" && item?.for !== role) return;
  const isSelected = (link, subroutes = null) => {
    if (subroutes) {
      return subroutes.includes(pathname) || pathname === link;
    } else {
      return pathname === link;
    }
  };
  return (
    <Link
      to={item.link}
      style={{ textDecoration: "none", color: "inherit" }}
      onClick={handleDrawerToggleMobile}
    >
      <ListItem
        button
        selected={isSelected(item.link, item.subroutes)}
        sx={{
          "&.Mui-selected": {
            backgroundColor: isSelected
              ? "rgba(255, 255, 255, 0.1)"
              : "inherit",
            color: isSelected ? "#fff" : "inherit",
          },
          "&:hover": { background: "rgba(255, 255, 255, 0.2)" },
        }}
      >
        <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
        <ListItemText
          primary={item.text}
          sx={{ fontSize: "0.75rem" }}
          disableTypography
        />
      </ListItem>
    </Link>
  );
};
export default function CollapseableItemMobile({
  items,
  handleDrawerToggleMobile,
}) {
  const { state } = useAuthCtx();
  const { authorisedRoutes, authorisedModules } = state.user;

  return (
    <>
      {
        <>
          <List>
            {items.map((item) =>
              !item.subItem.length &&
              (authorisedRoutes?.includes(item.link) ||
                authorisedModules?.includes(item.text)) ? (
                <NonCollapseable
                  key={item.link}
                  item={item}
                  handleDrawerToggleMobile={handleDrawerToggleMobile}
                />
              ) : null
            )}
          </List>
          <Divider
            sx={{
              "&.MuiDivider-root": {
                borderColor: "gray",
              },
            }}
          />
        </>
      }
      {items.map((item, i) =>
        item.subItem.length && authorisedModules?.includes(item.text) ? (
          <Collapseable
            key={i}
            item={item}
            handleDrawerToggleMobile={handleDrawerToggleMobile}
          />
        ) : null
      )}
    </>
  );
}
