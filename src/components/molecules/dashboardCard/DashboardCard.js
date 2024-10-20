import { Box, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import PropTypes from "prop-types";

/**
 *
 * DashboardCard reusable component
 * @component
 *@property {function} icon the card icon
 *@property {string} smallTxt the card subheading
 *@property {string | number} bigTxt the card count number
 *@property {string} url the card url on click show more button
 *@property {object} icnBgSx the card styling
 *@property {object} smallTxtSx the card styling
 * @return {React.ReactElement} LinkTab element with a box wrapper
 * @category Molecule
 *
 *
 *
 */
function DashboardCard({
  hasDetails,
  icon,
  smallTxt,
  bigTxt,
  url = "",
  icnBgSx = {},
  smallTxtSx = {},
}) {
  return (
    <Paper
      sx={{ height: "120px", p: 2, width: "100%" }}
      aria-label="dashboard-card"
    >
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Stack direction="column" spacing={0}>
          <Typography
            variant="body"
            sx={{
              fontSize: "12px",
              fontWeight: "bold",
              m: 0,
              textTransform: "uppercase",
              ...smallTxtSx,
            }}
          >
            {smallTxt}
          </Typography>
          <Typography variant="displayMd" sx={{ fontWeight: "bold", m: 0 }}>
            {bigTxt}
          </Typography>
        </Stack>
        <Box
          sx={{
            p: 2,
            borderRadius: "50%",
            height: "70px",
            width: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...icnBgSx,
          }}
        >
          {icon}
        </Box>
      </Stack>
      {url ? (
        <Link
          to={url}
          style={{
            display: "flex",
            jutifyContent: "center",
            alignItems: "center",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Show Details <ArrowRightAltIcon sx={{ ml: 1 }} />
        </Link>
      ) : null}
    </Paper>
  );
}
DashboardCard.propTypes = {
  icon: PropTypes.element,
  smallTxt: PropTypes.string.isRequired,
  bigTxt: PropTypes.any,
  url: PropTypes.string,
  icnBgSx: PropTypes.object,
};
export default DashboardCard;
