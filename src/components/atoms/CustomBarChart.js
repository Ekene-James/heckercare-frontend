import { Typography, Stack } from "@mui/material";

import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartLabel from "./ChartLabel";

function CustomBarChart({ data }) {
  return (
    <Stack
      direction="column"
      sx={{ width: "100%", height: "300px" }}
      aria-label="bar-chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={400} height={250} data={data} margin={{}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="test">
            {data.map((entry, index) => (
              <Cell fill={entry.fill} key={`cell-${index}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <Typography>Symbols</Typography>
      <ChartLabel data={data} />
    </Stack>
  );
}
export default CustomBarChart;
