import React from "react";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import { Link, useLocation } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import ListItem from "@mui/material/ListItem";
import { Box } from "@mui/material";
import { useAuthCtx } from "store/contextStore/auth/AuthStore";

const Collapseable = ({ sidebarOpen, item }) => {
  const [open, setOpen] = React.useState(false);

  const { state } = useAuthCtx();
  const { authorisedRoutes } = state.user;

  const { pathname } = useLocation();
  const handleClick = () => {
    setOpen(!open);
  };
  // const isDropdownItemSelected = pathname.includes(item.text.toLowerCase());

  const isDropdownItemSelected =
    item.subroutes.includes(pathname) ||
    pathname.includes(item?.isRouteIncludes);
  return (
    <Box>
      <ListItemButton
        onClick={handleClick}
        sx={{
          flexGrow: { xs: "0.03", sm: "1" },
          fontWeight: 600,
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
        <ListItemIcon
          sx={{
            color: "inherit",
            display: sidebarOpen ? "none" : "block",
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          disableTypography
          primary={item.text}
          sx={{
            display: sidebarOpen ? "block" : "none",
            fontSize: "0.75rem !important",
            color: isDropdownItemSelected ? "#fff" : "#C4C4C4",
          }}
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
                >
                  <ListItemButton
                    sx={{
                      pl: 4,

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
                    <ListItemIcon
                      sx={{
                        color: "inherit",
                        minWidth: 0,
                        mr: sidebarOpen ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {subItem.icon}
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      primary={subItem.text}
                      sx={{
                        display: sidebarOpen ? "block" : "none",
                        fontSize: "0.688rem !important",
                      }}
                    />
                  </ListItemButton>
                </Link>
              </div>
            ) : null
          )}
        </List>
      </Collapse>
    </Box>
  );
};

const NonCollapseable = ({ item, sidebarOpen }) => {
  const { pathname } = useLocation();

  const { state } = useAuthCtx();
  const { role } = state.user;

  if (item.text === "Dashboard" && item?.for !== role) return;
  let isSelected = false;
  if (item.subroutes) {
    isSelected = item.subroutes.includes(pathname) || pathname === item.link;
  } else {
    isSelected = pathname === item.link;
  }

  return (
    <Link to={item.link} style={{ textDecoration: "none", color: "inherit" }}>
      <ListItem
        button
        selected={isSelected}
        sx={{
          "&.Mui-selected": {
            backgroundColor: isSelected
              ? "rgba(255, 255, 255, 0.1)"
              : "inherit",
            color: isSelected ? "#fff" : "inherit",
          },
          "&:hover": {
            background: isSelected
              ? "rgba(255, 255, 255, 0.3) !important"
              : "rgba(255, 255, 255, 0.2)",
          },
          minHeight: 48,
          justifyContent: sidebarOpen ? "initial" : "center",
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            color: "inherit",
            minWidth: 0,
            mr: sidebarOpen ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          disableTypography
          primary={item.text}
          sx={{
            display: sidebarOpen ? "block" : "none",
            fontSize: "0.75rem !important",
          }}
        />
      </ListItem>
    </Link>
  );
};

export default function CollapseableItemPc({ items, sidebarOpen }) {
  const { state } = useAuthCtx();
  const { authorisedRoutes, authorisedModules } = state.user;

  return (
    <>
      {
        <>
          <List>
            {items.map((item, index) =>
              !item.subItem.length &&
              (authorisedRoutes?.includes(item.link) ||
                authorisedModules?.includes(item.text)) ? (
                <NonCollapseable
                  item={item}
                  key={index}
                  sidebarOpen={sidebarOpen}
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
          <Collapseable key={i} sidebarOpen={sidebarOpen} item={item} />
        ) : null
      )}
    </>
  );
}
