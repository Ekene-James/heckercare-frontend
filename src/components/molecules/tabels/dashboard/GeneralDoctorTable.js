import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CustomButton from "components/atoms/CustomButton";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { GET_GENERALIST_APPOINTMENTS } from "utils/reactQueryKeys";
const rows = [
  {
    uniqueId: "ID-24354758",
    patientName: "Afam Okereke",
    orderNumber: "00001",
  },
  {
    uniqueId: "ID-24354758",
    patientName: "Afam Okereke",
    orderNumber: "00001",
  },
  {
    uniqueId: "ID-24354758",
    patientName: "Afam Okereke",
    orderNumber: "00001",
  },
];
const Row = ({ row, refetch }) => {
  const queryClient = useQueryClient();

  //discharge patient
  const { mutate: completeAppointment, isLoading: completeAppointmentLoading } =
    useCustomMutation(
      {
        url: `appointments/start-appointment/${row?._id}`,
        method: "patch",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_GENERALIST_APPOINTMENTS]);
          refetch();
          toast.success("Success");
        },

        onError: (error) => {
          if (Array.isArray(error.message)) {
            return error.message.map((msg) => toast.error(msg));
          }

          return toast.error(error.message);
        },
      }
    );

  const handleCompleteAppointment = () => {
    completeAppointment();
  };
  return (
    <TableRow
      sx={{
        "&:nth-of-type(odd)": {
          backgroundColor: "background.custom",
        },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?._id}
      </TableCell>

      <TableCell align="left" sx={{ fontWeight: "bold" }}>
        {`${row?.patient?.firstName} ${row?.patient?.lastName}`}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.orderNumber}
      </TableCell>

      <TableCell align="left">
        <CustomButton
          variant="custom"
          color="primary"
          text="Mark as Complete"
          disabled={completeAppointmentLoading}
          onClick={handleCompleteAppointment}
          rgb="105, 86, 229"
          // onClick={toggleModal.bind(null, row)}
        />
      </TableCell>
    </TableRow>
  );
};

export default function GeneralDoctorTable({
  data,
  checkBoxItems,
  refetch,
  setcheckBoxItems,
  isDoctorDashboard,
}) {
  const handleSelect = (item) => {
    const newState = [...checkBoxItems, item];
    setcheckBoxItems(newState);
  };
  const handleUnSelect = (item) => {
    const newState = checkBoxItems.filter(
      (selected) => selected._id !== item._id
    );
    setcheckBoxItems(newState);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="general doctor table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Unique ID
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Patient Name
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Order Number
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.length
            ? data.map((row, i) => (
                <Row
                  key={row?._id}
                  row={row}
                  refetch={refetch}
                  handleSelect={handleSelect}
                  handleUnSelect={handleUnSelect}
                  selectedItems={checkBoxItems}
                  isDoctorDashboard={isDoctorDashboard}
                />
              ))
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

GeneralDoctorTable.defaultProps = {
  isDoctorDashboard: false,
};
