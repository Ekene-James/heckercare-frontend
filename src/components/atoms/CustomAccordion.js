import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";

const CustomAccordion = ({
  item: {
    title,
    subtitle,
    detailsComponent,
    changeOnExpanded = false,
    bgColor = "background.lightBlue",
    expandedColor = "secondary.main",
    iconExpandedColor = "background.white",
    titleSx = {},
    subtitleSx = {},
    summarySx = {},
  },
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };
  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      sx={{
        margin: "0px !important",
        width: {
          xs: "97%",
          sm: "90%",
          lg: "96%",
        },

        textDecoration: "none",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id={`panel1bh-header-${title}`}
        sx={{
          backgroundColor:
            changeOnExpanded && expanded ? expandedColor : bgColor,
          "& .MuiAccordionSummary-expandIconWrapper": {
            color: changeOnExpanded && expanded ? iconExpandedColor : "",
          },
          borderRadius: changeOnExpanded && expanded ? "10px" : 0,
          ...summarySx,
        }}
      >
        <Stack
          direction="row"
          justifyContent="cenetr"
          alignItems="center"
          gap={2}
          sx={{
            pl: {
              xs: 2,
              sm: 0,
            },
          }}
        >
          <Typography
            sx={{
              width: {
                xs: "73%",
                sm: "80%",
                lg: "90%",
              },
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              flexShrink: 0,
              color: changeOnExpanded && expanded ? "white" : "",
              ...titleSx,
            }}
            variant="heading"
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="subheading"
              sx={{
                backgroundColor: "rgba(35, 22, 120, 0.1)",
                p: 0.5,
                borderRadius: "6px",
                ...subtitleSx,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ margin: 0, padding: 0, boxShadow: 6 }}>
        {detailsComponent}
      </AccordionDetails>
    </Accordion>
  );
};
export default CustomAccordion;
