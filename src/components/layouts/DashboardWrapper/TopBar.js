import {
  AppBar,
  Avatar,
  Badge,
  Box,
  CssBaseline,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Slide,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NotificationsIcon from "@mui/icons-material/Notifications";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React from "react";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeCtx } from "../../../store/contextStore/theme/ThemeStore";
import { toggleTheme } from "../../../store/contextStore/theme/ThemeActions";
import { useNavigate, useOutletContext } from "react-router-dom";
import { logout } from "store/contextStore/auth/AuthActions";
import { useAuthCtx } from "store/contextStore/auth/AuthStore";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CustomModal from "components/atoms/CustomModal";
import NotificationModal from "./NotificationModal";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_DESIGNATION,
  GET_GENERALIST_APPOINTMENTS,
  GET_NOTIFICATIONS,
  GET_NOTIFICATIONS_COUNT,
  GET_SPECIALIST_APPOINTMENTS,
  GET_STAFF,
} from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";
const pageSize = 10;
const drawerWidth = 240;
function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}
const whoAmI = (userRole, role) => {
  if (userRole) return userRole.toLowerCase().includes(role);
  return false;
};

function TopBar({ pcopen, handleDrawerToggleMobile, socket }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [page, setpage] = React.useState(1);
  const modalRef = React.useRef(null);
  const authCtx = useAuthCtx();
  const { state, dispatch } = useThemeCtx();
  const { state: authState } = useAuthCtx();

  const editNotificationCount = (count, userRole) => {
    if (userRole === "DOCTOR") {
      queryClient.setQueryData([GET_NOTIFICATIONS_COUNT], (oldQueryData) => {
        return {
          ...oldQueryData,
          data: count === 0 ? 0 : count + oldQueryData?.data,
        };
      });
    } else {
      queryClient.setQueryData(
        [
          GET_NOTIFICATIONS,
          userRole,
          {
            page,
            limit: pageSize,
          },
        ],
        (oldQueryData) => {
          return {
            ...oldQueryData,
            data: {
              ...oldQueryData.data,
              unreadCount: oldQueryData.data.unreadCount + 1,
            },
          };
        }
      );
    }
  };

  const editNotificationsState = (notification, userRole) => {
    queryClient.setQueryData(
      [
        GET_NOTIFICATIONS,
        userRole,
        {
          page,
          limit: pageSize,
        },
      ],
      (oldQueryData) => {
        return {
          ...oldQueryData,
          data: {
            ...oldQueryData.data,
            result: [notification, ...oldQueryData.data.result],
            count: oldQueryData.data.count + 1,
          },
        };
      }
    );
  };

  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };

  //get designation
  const { data: designation } = useCustomQuery(
    [GET_DESIGNATION, authState?.user?.designation],
    {
      url: `/designation/${authState?.user?.designation}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!authState?.user?.designation,
    }
  );

  //get single staff
  const { data: userData } = useCustomQuery(
    [GET_STAFF, authState?.user?._id],
    {
      url: `/user/get-single-staff/${authState?.user?._id}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!authState?.user?.designation,
    }
  );

  //get doctors notification
  const { data: doctorNotifications, isLoading: doctorNotificationsLoading } =
    useCustomQuery(
      [
        GET_NOTIFICATIONS,
        "DOCTOR",
        {
          page,
          limit: pageSize,
        },
      ],
      {
        url: `/notification/mobile/all?page=${page}&limit=${pageSize}`,
        method: "get",
      },
      {
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        enabled: whoAmI(authCtx?.state?.user?.roleObj?.name, "doctor"),
      }
    );

  //get accountant notification
  const {
    data: accountantNotifications,
    isLoading: accountantNotificationsLoading,
  } = useCustomQuery(
    [
      GET_NOTIFICATIONS,
      "ACCOUNTANT",
      {
        page,
        limit: pageSize,
      },
    ],
    {
      url: `/notification/account?page=${page}&limit=${pageSize}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: whoAmI(authCtx?.state?.user?.roleObj?.name, "account"),
    }
  );

  //get pharmacy notification
  const {
    data: pharmacyNotifications,
    isLoading: pharmacyNotificationsLoading,
  } = useCustomQuery(
    [
      GET_NOTIFICATIONS,
      "PHARMACY",
      {
        page,
        limit: pageSize,
      },
    ],
    {
      url: `/notification/pharmacy?page=${page}&limit=${pageSize}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: whoAmI(authCtx?.state?.user?.roleObj?.name, "pharmac"),
    }
  );
  //get lab attendant notification
  const { data: labNotifications, isLoading: labNotificationsLoading } =
    useCustomQuery(
      [
        GET_NOTIFICATIONS,
        "LAB",
        {
          page,
          limit: pageSize,
        },
      ],
      {
        url: `/notification/lab?page=${page}&limit=${pageSize}`,
        method: "get",
      },
      {
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        enabled: whoAmI(authCtx?.state?.user?.roleObj?.name, "lab"),
      }
    );

  //get nurse notification
  const { data: nurseNotifications, isLoading: nurseNotificationsLoading } =
    useCustomQuery(
      [
        GET_NOTIFICATIONS,
        "NURSE",
        {
          page,
          limit: pageSize,
        },
      ],
      {
        url: `/notification/nurse?page=${page}&limit=${pageSize}`,
        method: "get",
      },
      {
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        enabled: whoAmI(authCtx?.state?.user?.roleObj?.name, "nurse"),
      }
    );

  //get frontdesk notification
  const {
    data: frontDeskNotifications,
    isLoading: frontDeskNotificationsLoading,
  } = useCustomQuery(
    [
      GET_NOTIFICATIONS,
      "NURSE",
      {
        page,
        limit: pageSize,
      },
    ],
    {
      url: `/notification/nurse?page=${page}&limit=${pageSize}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: whoAmI(authCtx?.state?.user?.roleObj?.name, "nurse"),
    }
  );

  //get notification count
  const { data: notificationCount, isLoading: notificationCountLoading } =
    useCustomQuery(
      [GET_NOTIFICATIONS_COUNT],
      {
        url: `/notification/mobile/count`,
        method: "get",
      },
      {
        refetchOnWindowFocus: false,
        enabled: authCtx?.state?.user?.roleObj?.name
          ? authCtx?.state?.user?.roleObj?.name.toLowerCase() === "doctor"
            ? true
            : false
          : false,
      }
    );

  React.useEffect(() => {
    socket.on("notification", (data) => {
      // console.log(data);
      const toLabAttendant = data?.to === "LABORATORY";
      const toPharmacist = data?.to === "PHARMACY";
      const toAccountant = data?.to === "ACCOUNTS";
      const toDoctor = data?.to === "DOCTOR";
      const toNurse = data?.to === "NURSE";
      const toFrontDesk = data?.to === "FRONT_DESK";

      const isAppointmentNotification =
        data?.title === "Appointment Started" ||
        data?.title?.toLowerCase()?.includes("appointment");
      // const isPrescriptionNotification = data.title === "New Prescription";
      // const isInvestigationNotification = data.title === "New Investigation";
      // const isRequisitionNotification = data.title === "New Requisition";
      // const isDisputeNotification = data.title === "Requisition Dispute";

      const isPharmacist = whoAmI(
        authCtx?.state?.user?.roleObj?.name,
        "pharmac"
      );
      const isAccountant = whoAmI(
        authCtx?.state?.user?.roleObj?.name,
        "account"
      );

      const isLabAttendant = whoAmI(authCtx?.state?.user?.roleObj?.name, "lab");
      const isNurse = whoAmI(authCtx?.state?.user?.roleObj?.name, "nurse");
      const isFrontDesk = whoAmI(
        authCtx?.state?.user?.roleObj?.name,
        "frontdesk"
      );

      //if any isPrescriptionNotification or isInvestigationNotification notification and logged in user is an accountant, and msg is for accountant send him the notification
      if (
        // (isPrescriptionNotification || isInvestigationNotification) &&
        toAccountant &&
        isAccountant
      ) {
        // console.log("inside acc");
        editNotificationCount(1, "ACCOUNTANT");
        editNotificationsState(data, "ACCOUNTANT");
      }

      //if any isPrescriptionNotification  and logged in user is an pharmacist, and msg is for pharmacist send him the notification
      if (toPharmacist && isPharmacist) {
        editNotificationCount(1, "PHARMACY");
        editNotificationsState(data, "PHARMACY");
      }

      //if any isInvestigationNotification  and logged in user is a LabAttendant, and msg is for toLabAttendant send him the notification
      if (toLabAttendant && isLabAttendant) {
        editNotificationCount(1, "LAB");
        editNotificationsState(data, "LAB");
      }

      if (toNurse && isNurse) {
        editNotificationCount(1, "NURSE");
        editNotificationsState(data, "NURSE");
        queryClient.invalidateQueries([GET_SPECIALIST_APPOINTMENTS]);
        queryClient.invalidateQueries([GET_GENERALIST_APPOINTMENTS]);
      }
      if (toFrontDesk && isFrontDesk) {
        editNotificationCount(1, "FRONTDESK");
        editNotificationsState(data, "FRONTDESK");
      }

      if (
        authState.user._id === data.userId &&
        toDoctor &&
        isAppointmentNotification
      ) {
        editNotificationCount(1, "DOCTOR");
        editNotificationsState(data, "DOCTOR");

        queryClient.invalidateQueries([GET_SPECIALIST_APPOINTMENTS]);
        queryClient.invalidateQueries([GET_GENERALIST_APPOINTMENTS]);
      }
    });
  }, [authState.user._id]);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogout = () => {
    authCtx.dispatch(logout(navigate));
    setAnchorEl(null);
  };
  const handleProfile = () => {
    navigate("/home/profile");
    setAnchorEl(null);
  };
  const handlePageChange = (page) => {
    setpage(page);
  };
  let notifications = {};
  let isLoading = false;

  let unreadMsgs = 0;
  let unreadMsgsLoading = false;
  if (whoAmI(authCtx?.state?.user?.roleObj?.name, "doctor")) {
    notifications = doctorNotifications;
    isLoading = doctorNotificationsLoading;

    unreadMsgsLoading = notificationCountLoading;
    unreadMsgs = notificationCount?.data;
  } else if (whoAmI(authCtx?.state?.user?.roleObj?.name, "account")) {
    notifications = accountantNotifications;
    isLoading = accountantNotificationsLoading;

    unreadMsgsLoading = accountantNotificationsLoading;
    unreadMsgs = accountantNotifications?.data?.unreadCount;
  } else if (whoAmI(authCtx?.state?.user?.roleObj?.name, "pharmac")) {
    notifications = pharmacyNotifications;
    isLoading = pharmacyNotificationsLoading;

    unreadMsgsLoading = pharmacyNotificationsLoading;
    unreadMsgs = pharmacyNotificationsLoading?.data?.unreadCount;
  } else if (whoAmI(authCtx?.state?.user?.roleObj?.name, "lab")) {
    notifications = labNotifications;
    isLoading = labNotificationsLoading;

    unreadMsgsLoading = labNotificationsLoading;
    unreadMsgs = labNotifications?.data?.unreadCount;
  } else if (whoAmI(authCtx?.state?.user?.roleObj?.name, "nurse")) {
    notifications = nurseNotifications;
    isLoading = nurseNotificationsLoading;

    unreadMsgsLoading = nurseNotificationsLoading;
    unreadMsgs = nurseNotifications?.data?.unreadCount;
  } else if (whoAmI(authCtx?.state?.user?.roleObj?.name, "frontdesk")) {
    notifications = frontDeskNotifications;
    isLoading = frontDeskNotificationsLoading;

    unreadMsgsLoading = frontDeskNotificationsLoading;
    unreadMsgs = frontDeskNotifications?.data?.unreadCount;
  }

  return (
    <>
      <CssBaseline />
      <HideOnScroll>
        <AppBar
          // position="fixed"
          elevation={0}
          sx={{
            backgroundColor: "transparent",
            color: "black",
            width: {
              sm: pcopen
                ? `calc(100% - ${drawerWidth}px)`
                : `calc(100% - ${theme.spacing(8)})`,
            },
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: { sm: "flex-end", xs: "space-between" },
              alignItems: "center",
              width: "100%",
            }}
          >
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggleMobile}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <ChevronRightIcon />
              </IconButton>
            </>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                width: { sm: "45%", lg: "25%", xs: "80%" },
              }}
            >
              <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                disabled={isLoading}
                onClick={toggleModal}
              >
                {!unreadMsgsLoading && unreadMsgs > 0 ? (
                  <Badge color="error" badgeContent={unreadMsgs}>
                    <NotificationsIcon />
                  </Badge>
                ) : (
                  <NotificationsIcon />
                )}
              </IconButton>

              <Avatar
                alt="Remy Sharp"
                src={
                  userData?.data?.profilePicture ||
                  "/imgs/blank-profile-picture.png"
                }
              />
              <Stack direction="row" spacing={0.2} alignItems="start">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                    variant="caption"
                  >
                    {`${authState?.user?.firstName} ${authState?.user?.lastName}`}
                  </Typography>
                  <Typography
                    color="primary"
                    sx={{ textTransform: "capitalize" }}
                    variant="small"
                  >
                    {authState?.user?.designation && designation?.data?.name
                      ? designation?.data?.name.toLowerCase()
                      : authState?.user?.roleObj?.name?.toLowerCase()}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                >
                  <KeyboardArrowDownIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    sx={{
                      color: "black",
                    }}
                    onClick={handleProfile}
                  >
                    <PersonOutlineOutlinedIcon sx={{ mr: 2 }} /> Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      color: "black",
                    }}
                  >
                    <LogoutOutlinedIcon sx={{ mr: 2 }} /> Logout
                  </MenuItem>
                </Menu>
              </Stack>

              <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => dispatch(toggleTheme())}
              >
                {state.lightTheme ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <CustomRightDrawer
        ref={modalRef}
        drawerSx={{
          width: {
            xs: "90vw",
            sm: "60vw",
            md: "40vw",
          },
        }}
        cleanUp={() => editNotificationCount(0)}
        title="Notifications"
        subTitle=""
      >
        <NotificationModal
          data={notifications?.data?.result || []}
          handlePageChange={handlePageChange}
          page={page}
          count={notifications?.data?.count}
        />
      </CustomRightDrawer>
    </>
  );
}

export default TopBar;
