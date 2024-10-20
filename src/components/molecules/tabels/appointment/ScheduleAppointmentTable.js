import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CustomButton from "components/atoms/CustomButton";
import CustomLoader from "components/atoms/CustomLoader";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { Typography } from "@mui/material";

const rows = [
  {
    id: "123456789a",
    name: "sam smith",
    dob: "22/05/2022",
    orderNumber: "00001",
  },
  {
    id: "123456789a",
    name: "sam smith",
    dob: "22/05/2022",
    orderNumber: "00001",
  },
  {
    id: "123456789a",
    name: "sam smith",
    dob: "22/05/2022",
    orderNumber: "00001",
  },
];

const Row = ({ row, refetch }) => {
  //mark appointmnent as completed
  const { mutate, isLoading } = useCustomMutation(
    {
      url: `/appointments/mark-appointment/${row._id}`,
      method: "patch",
    },
    {
      onSuccess: () => {
        refetch();

        toast.success("Success");
      },

      onError: (error) => {
        if (error.message.length) {
          error.message.map((msg) => toast.error(msg));
        } else {
          toast.error(error.message);
        }
      },
    }
  );

  return (
    <TableRow
      sx={{
        "&:nth-of-type(odd)": {
          backgroundColor: "background.custom",
        },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell
        component="th"
        scope="row"
        align="left"
        sx={{ color: "primary.darkGrey" }}
      >
        {row.id}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {`${row?.patient?.firstName} ${row?.patient?.lastName}`}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.patient?.age}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.orderNumber}
      </TableCell>
      <TableCell
        align="left"
        sx={{
          color:
            row.appointmentStatus === "completed"
              ? "green"
              : "primary.darkGrey",
        }}
      >
        {row.appointmentStatus}
      </TableCell>
    </TableRow>
  );
};
export default function ScheduleAppointmentTable({ data, refetch }) {
  return (
    <>
      {data.length ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{}}>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  Unique Id
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  Patients Name
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  Age
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  Order number
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, i) => (
                <Row key={i} row={row} refetch={refetch} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" mt={5}>
          No generalist appointment created yet
        </Typography>
      )}
    </>
  );
}
