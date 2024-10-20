import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import PropTypes from "prop-types";

/**
 *
 * StatisticsCard reusable component
 * @component
 *@property {function} icon the card icon
 *@property {string} title the card subheading
 *@property {string | number} value the card count number
 *@property {string} url the card url on click show more button
 *@property {object} icnBgSx the card styling
 * @return {React.ReactElement} LinkTab element with a box wrapper
 *
 *
 *
 *
 */
function StatisticsCard({
  title,
  icon,
  value,
  url = "",
  icnBgSx = {},
  hasDetails,
}) {
  const theme = useTheme();
  return (
    <Paper sx={{ p: 2, width: "100%" }} aria-label="statistics-card">
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Stack direction="column" spacing={0}>
          <Typography
            variant="body"
            sx={{
              fontSize: "12px",
              fontWeight: "medium",
              m: 0,
              textTransform: "uppercase",
            }}
          >
            {title}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold", m: 0 }}>
            {value}
          </Typography>
        </Stack>
        <Box
          sx={{ p: 2, width: 66, height: 66, borderRadius: 999999, ...icnBgSx }}
        >
          {icon}
        </Box>
      </Stack>
      {hasDetails && (
        <Link
          to={url}
          style={{
            display: "flex",
            jutifyContent: "center",
            alignItems: "center",
            fontSize: "12px",
            fontWeight: 600,
            color: theme.palette.primary.darkGrey,
          }}
        >
          {/* {hasDetails === true &&
            `Show Details ${(<ArrowRightAltIcon sx={{ ml: 1 }} />)}`} */}
          Show Details <ArrowRightAltIcon sx={{ ml: 1 }} />
        </Link>
      )}
    </Paper>
  );
}
StatisticsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  url: PropTypes.string,
  icnBgSx: PropTypes.object,
};
export default StatisticsCard;
