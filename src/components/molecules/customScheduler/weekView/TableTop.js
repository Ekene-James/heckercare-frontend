const {
  TableHead,
  TableRow,
  TableCell,
  Stack,
  Typography,
} = require("@mui/material");
const { days, months } = require("../staticData");

const TableTop = ({ data = [] }) => {
  const today = new Date();

  return (
    <TableHead>
      <TableRow sx={{}}>
        <TableCell />

        {data.map((day, i) => (
          <TableCell key={day} align="center">
            <Stack
              direction="column"
              spacing={1}
              width={"100%"}
              justifyContent="start"
              alignItems="center"
              p={0.5}
              sx={{ opacity: +day.getDate() === +today.getDate() ? 1 : 0.6 }}
            >
              <Typography variant="small" opacity="inherit">
                {days[i]}
              </Typography>
              <Stack
                direction="row"
                spacing={0.2}
                alignItems="flex-end"
                justifyContent="flex-end"
                sx={{
                  opacity: +day.getDate() === +today.getDate() ? 1 : 0.6,
                }}
              >
                <Typography variant="heading" opacity="inherit">
                  {day.getDate()}
                </Typography>

                <Typography
                  variant="small"
                  opacity="inherit"
                  sx={{ alignSelf: "flex-end", justifySelf: "flex-end" }}
                >
                  {months[day.getMonth()]}
                </Typography>
              </Stack>
            </Stack>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
export default TableTop;
