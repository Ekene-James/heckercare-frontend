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
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import { useQueryClient } from "react-query";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { GET_GENERALIST_APPOINTMENTS } from "utils/reactQueryKeys";

const Row = ({ row }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // console.log(row.id);
  //mark vitals done
  const { mutate: completeAppointment, isLoading: completeAppointmentLoading } =
    useCustomMutation(
      {
        url: `appointments/complete-appointment/${row?._id}`,
        method: "patch",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_GENERALIST_APPOINTMENTS]);

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

  return (
    <TableRow
      sx={{
        "&:nth-of-type(odd)": {
          backgroundColor: "background.custom",
        },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell align="left" sx={{ fontWeight: "bold" }}>
        {row?.orderNumber}
      </TableCell>

      <TableCell align="left" sx={{ fontWeight: "bold", textWrap: "nowrap" }}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={1}
        >
          <img
            alt="profile_img"
            src={
              row?.patient?.patientImage || "/imgs/blank-profile-picture.png"
            }
            style={{
              borderRadius: "50%",
              objectFit: "contain",
              objectPosition: "center",
              width: "24px",
              height: "24px",
            }}
          />
          {`${row?.patient?.firstName || ""} ${row?.patient?.lastName || ""}`}
        </Stack>
      </TableCell>
      <TableCell align="left" sx={{ fontWeight: "bold" }}>
        {moment(row?.createdAt).format("MMMM Do YYYY, h:mm a")}
      </TableCell>

      <TableCell align="left">
        <Stack direction={"row"} gap={2}>
          <CustomButton
            variant="custom"
            color="primary"
            text="Mark as Complete"
            disabled={completeAppointmentLoading}
            onClick={completeAppointment}
            rgb="105, 86, 229"
            sx={{ textWrap: "nowrap" }}
          />
          <CustomButton
            onClick={() =>
              navigate(`/home/patient/basic-information/${row?.patient?._id}`)
            }
            sx={{ textWrap: "nowrap" }}
            color="primary"
            text="Open"
            variant="contained"
          />
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default function DocDashboardGenDocTable({
  data,
  checkBoxItems,
  setcheckBoxItems,
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
              Order Number
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Patient Name
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Date
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.length
            ? data.map((row, i) => (
                <Row
                  key={row?._id}
                  row={row}
                  handleSelect={handleSelect}
                  handleUnSelect={handleUnSelect}
                  selectedItems={checkBoxItems}
                />
              ))
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
