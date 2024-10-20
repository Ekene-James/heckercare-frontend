const {
  TableHead,
  TableRow,
  TableCell,
  Stack,
  Typography,
} = require("@mui/material");
const { daysFromSunday } = require("../staticData");

const TableTop = () => {
  return (
    <Stack
      sx={{ width: "100%" }}
      direction="row"
      justifyContent={"space-between"}
      spacing={1}
      p={2}
    >
      {daysFromSunday.map((day) => (
        <Typography variant="caption" opacity="inherit" key={day}>
          {day}
        </Typography>
      ))}
    </Stack>
  );
};
export default TableTop;
