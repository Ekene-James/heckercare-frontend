import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useThemeCtx } from "store/contextStore/theme/ThemeStore";
import { Chip, Stack, Typography } from "@mui/material";
/**
 * @typedef {Object} otherPropsObj
 * @property {string} id custom id
 * @property {string} aria_control custom aria control
 */

/**
 *
 * @param {number} index index of the current iteration
 * @returns {{otherPropsObj}} otherPropsObj
 */

function otherProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

//LinkTab.js
/**
 * LinkTab component
 * @component
 * @example
 * const selected=false | true
 * const textColor='rgba(0,0,0,1)'
 * let value=0
 * const setValue=() => value=0
 * const handleClick = () => {
 * setValue();
 * if(to) navigate to the page
 * }
 * const item = {
 * to:'/link-to-another page',
 * label: "Vital Signs",
 * id: 0,
 * count:9
 * }
 *
 * return <Tab onClick={handleClick} label={label} selected={selected} textColor={textColor} ...otherProps/>
 *
 */
function LinkTab(props) {
  const { selected, textColor, item, value, setValue } = props;
  const { to, label, id, count } = item;

  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    setValue(value);
    if (to) navigate(to);
  };
  return (
    <Stack
      direction={"row"}
      justifyContent="center"
      alignItems={"center"}
      spacing={1}
    >
      <Tab
        onClick={handleClick}
        label={label}
        selected={selected}
        textColor={textColor}
        {...otherProps(id)}
      />
      {count && (
        <Chip label={count} size="small" sx={{ opacity: selected ? 1 : 0.3 }} />
      )}
    </Stack>
  );
}

LinkTab.propTypes = {
  /**is tab selected */
  selected: PropTypes.bool,
  /** custom texcolor of tab */
  textColor: PropTypes.string,
  /**value of the tab to know if its same value as the clicked one,
   *  used to know which component to display when a tab is clicked */
  value: PropTypes.number,
  /**setting value of the tab */
  setValue: PropTypes.func.isRequired,
  /**item object of the current iteration */
  item: PropTypes.object.isRequired,
};

//CustomTab.js
/**
 *
 * CustomTab reusable component
 * @component
 * @example
 *  const navItems = [{
 *  label: "Vital Signs",
 *  id: 0,
 * }]
 *
 * let value = 0;
 * const setValue = () => value = 0
 * return <CustomTab >
 * {navItems.map((item) => (
 *        <LinkTab key={item.id} item={item} setValue={setValue} />
 *     ))}
 * </CustomTab>
 *
 * @return {LinkTab} LinkTab element with a box wrapper
 * @category Atoms
 *
 *
 *
 */
function CustomTab({ navItems, value, setValue, sx = {} }) {
  const { state } = useThemeCtx();

  /**
   * tab onchange event
   * @param {object} event
   * @param {number} newValue
   */
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", overflow: "hidden !important", ...sx }}>
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
            fontWeight: "bold",
          },
        }}
      >
        {navItems.map((item) => (
          <LinkTab key={item.id} item={item} setValue={setValue} />
        ))}
      </Tabs>
    </Box>
  );
}

CustomTab.propTypes = {
  /** nav items array */
  navItems: PropTypes.array.isRequired,
  /**value of the tab to know if its same value as the clicked one,
   *  used to know which component to display when a tab is clicked */
  value: PropTypes.number.isRequired,
  /**setting value of the tab */
  setValue: PropTypes.func.isRequired,
};
export default CustomTab;
