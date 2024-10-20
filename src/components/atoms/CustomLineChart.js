import { Stack } from "@mui/material";
import React, { PureComponent } from "react";
import CustomMenu from "./CustomMenu";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CustomLineChart({
  height = "400px",
  xVal = "name",
  type = "basis",
  data,
  showLabels = true,
  showMenuBtn = false,
  sx = {},
  lines = [],
}) {
  return (
    <Stack
      direction="column"
      sx={{ width: "100%", height, ...sx }}
      aria-label="line-chart"
    >
      {showMenuBtn && (
        <Stack
          direction="row"
          sx={{ width: "100%", mt: 1, mb: 2 }}
          justifyContent="flex-end"
        >
          <CustomMenu
            caption="Outpatient"
            onClickItem={() => {}}
            items={["One", "Two"]}
          />
        </Stack>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {showLabels && (
            <>
              <XAxis dataKey={xVal} />
              <YAxis />
              <Tooltip />
              <Legend />
            </>
          )}
          {lines.map((line, i) => (
            <Line
              key={i}
              type={type}
              dataKey={line.yVal}
              stroke={line.strokeColor}
              activeDot={{ r: 8 }}
              dot={line.showDot}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Stack>
  );
}
