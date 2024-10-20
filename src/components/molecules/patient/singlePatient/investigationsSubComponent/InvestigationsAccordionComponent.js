import { Box, Stack, Typography } from "@mui/material";
import React from "react";

import CustomAccordion from "components/atoms/CustomAccordion";

import SubComponent from "./SubComponent";

function InvestigationsAccordionComponent({ data, from = "lab" }) {
  /**
  data would look like 
  {
    test name 1: (5) [{…}, {…}, {…}, {…}, {…}]
  test name 2: (14) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]

  }

 */
  return (
    <Stack
      direction="column"
      gap={2}
      sx={{
        p: {
          xs: 1,
          sm: 2,
        },
      }}
    >
      {Object.keys(data)?.length
        ? Object.keys(data)?.map((test, i) => (
            <Stack
              direction="row"
              justifyContent="start"
              alignItems="start"
              gap={2}
              key={test}
            >
              <Box
                sx={{
                  height: {
                    xs: "50px",
                    md: "64px",
                  },
                  width: {
                    xs: "30px",
                    md: "64px",
                  },
                  borderRadius: "4px",
                  padding: "20px 27px",
                  background: "#F2F1F7",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="heading">{i + 1}</Typography>
              </Box>

              <CustomAccordion
                key={test}
                item={{
                  title: `${test}`,
                  subtitle: `${data[test].length}`,
                  detailsComponent: (
                    <SubComponent data={data[test]} from={from} />
                  ),
                  changeOnExpanded: true,
                  bgColor: "background.white",
                  expandedColor: "background.light",
                  titleSx: {
                    color: "primary.main",
                  },
                  summarySx: {
                    minHeight: "64px",
                    borderRadius: "2px !important",
                    border: "0.2px solid #E0E0E0",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  subtitleSx: {
                    borderRadius: "50%",
                    minWidth: "28px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                  },
                  iconExpandedColor: "primary.main",
                }}
              />
            </Stack>
          ))
        : null}
    </Stack>
  );
}

export default InvestigationsAccordionComponent;
