import { Stack, Typography } from "@mui/material";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import ChartLabel from "./ChartLabel";

export default function CustomPieChart({
  data,
  height = "300px",
  title,
  xs,
  sm,
  showValue,
  outerRadius = 80,
  innerRadius,

  paddingAngle,
  width = "100%",
  roundedLabelColor = false,
  smallLabel,
}) {
  return (
    <Stack
      direction="column"
      sx={{ width: "100%", height }}
      aria-label="pie-chart"
    >
      <Typography variant="caption" sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>
      <ResponsiveContainer width={width} height="100%">
        <PieChart>
          <Pie
            data={data}
            labelLine={false}
            paddingAngle={paddingAngle}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <ChartLabel
        data={data}
        showValue={showValue}
        xs={xs}
        sm={sm}
        roundedLabelColor={roundedLabelColor}
        smallLabel={smallLabel}
      />
    </Stack>
  );
}
