import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useThemeCtx } from "../../../store/contextStore/theme/ThemeStore";

function LinkTab(props) {
  const { to } = props;
  const navigate = useNavigate();
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
        navigate(to);
      }}
      {...props}
    />
  );
}

export default function TabBar() {
  const { pathname } = useLocation();
  const { id } = useParams();
  // let match = useRouteMatch("/blog/:slug");

  const [value, setValue] = React.useState(0);
  const { state } = useThemeCtx();

  const navItems = [
    {
      label: "Basic Information",
      to: `/home/patient/basic-information/${id}`,
      id: 0,
    },
    {
      label: "Medical Records",
      to: `/home/patient/medical-records/${id}`,
      id: 1,
    },
    {
      label: "Treatments",
      to: `/home/patient/treatments/${id}`,
      id: 2,
    },
    {
      label: "Prescriptions",
      to: `/home/patient/prescriptions/${id}`,
      id: 3,
    },
    {
      label: "Investigations",
      to: `/home/patient/investigations/${id}`,
      id: 4,
    },
    {
      label: "Radiology",
      to: `/home/patient/radiology/${id}`,
      id: 5,
    },
    {
      label: "Appointments",
      to: `/home/patient/appointments/${id}`,
      id: 6,
    },
  ];

  React.useMemo(() => {
    const currentPg = navItems.find((item) => item.to === pathname);
    if (currentPg) setValue(currentPg.id);
  }, [pathname]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", overflow: "hidden !important" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="nav tabs example"
        variant="scrollable"
        scrollButtons={"auto"}
        allowScrollButtonsMobile
        indicatorColor="secondary"
        sx={{
          overflow: "hidden !important",

          "& .MuiTabs-indicator": {
            bgcolor: state.lightTheme ? "black" : "white",
          },
          "& .MuiTab-root.Mui-selected": {
            color: "text.primary",
          },
        }}
      >
        {navItems.map((item) => (
          <LinkTab key={item.id} label={item.label} to={item.to} />
        ))}
      </Tabs>
    </Box>
  );
}
