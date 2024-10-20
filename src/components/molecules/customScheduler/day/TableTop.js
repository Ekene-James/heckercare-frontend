const { TableHead, TableRow, TableCell } = require("@mui/material");
const { timeWithInterval } = require("../staticData");

const TableTop = () => {
  return (
    <TableHead>
      <TableRow sx={{}}>
        <TableCell sx={{ border: "none" }} />

        {timeWithInterval.map((time, i) => (
          <TableCell key={time.militaryTime} align="center">
            {time.normalTime}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
export default TableTop;
