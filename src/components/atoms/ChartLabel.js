import { Box, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { numberFormatter } from "utils/numberFormatter";
const LabelComponent = ({ item, showValue, roundedLabelColor, smallLabel }) => {
  return (
    <Stack direction={"row"} spacing={0.5} alignItems={"center"}>
      <Box
        sx={{
          backgroundColor: item.fill,
          width: roundedLabelColor ? "15px" : "27px",
          height: roundedLabelColor ? "15px" : "4px",
          borderRadius: roundedLabelColor ? "50%" : null,
        }}
      />
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: smallLabel ? "0.65rem" : "0.75rem",
        }}
      >
        {item.name}
      </Typography>
      {showValue && (
        <Typography variant="small" sx={{ fontWeight: "bold" }}>
          {numberFormatter(item.value)}
        </Typography>
      )}
    </Stack>
  );
};
function ChartLabel({
  data,
  xs = 6,
  sm = 6,
  showValue,
  roundedLabelColor,
  smallLabel,
}) {
  return (
    <Grid
      container
      spacing={1}
      sx={{ mt: 1, width: "100%" }}
      aria-label="chart-label-grid"
    >
      {data.map((item, i) => (
        <Grid item xs={xs} sm={sm} key={i}>
          <LabelComponent
            item={item}
            showValue={showValue}
            roundedLabelColor={roundedLabelColor}
            smallLabel={smallLabel}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default ChartLabel;
