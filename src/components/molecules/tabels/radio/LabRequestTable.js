import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Link, useNavigate } from "react-router-dom";
import CustomDotMenu from "components/atoms/CustomDotMenu";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import CustomButton from "components/atoms/CustomButton";
import moment from "moment";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useQueryClient } from "react-query";
import {
  GET_LAB_UPCOMING_INVESTIGATIONS,
  GET_RADIOLOGY_TEST_INFO,
  GET_RADIOLOGY_UPCOMING_INVESTIGATIONS,
  GET_TEST_LIST,
} from "utils/reactQueryKeys";
import { toast } from "react-toastify";

const Row = ({ row, i, openModal }) => {
  const queryClient = useQueryClient();
  //start test
  const { mutate: startTest, isLoading } = useCustomMutation(
    {
      url: `/laboratory/start-test/${row._id}`,
      method: "patch",
      data: {
        departmentType: "RADIOLOGY",
      },
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_RADIOLOGY_UPCOMING_INVESTIGATIONS]);
        queryClient.invalidateQueries([GET_TEST_LIST]);
        queryClient.invalidateQueries([GET_RADIOLOGY_TEST_INFO]);
        toast.success("Test Started Successfully");
      },

      onError: (error) => {
        toast.error(error.message);
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
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {i + 1}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {moment(row.createdAt).format("MMM Do, YYYY")}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {moment(row?.date).format("MMM Do, YYYY")}
      </TableCell>
      <TableCell align="left">{`${row?.patient?.firstName || ""} ${
        row?.patient?.lastName || ""
      }`}</TableCell>

      <TableCell align="left" sx={{ fontWeight: "bold" }}>
        {row?.test?.testName}
      </TableCell>
      <TableCell align="left" sx={{ width: "16%" }}>
        <CustomButton
          text="Start Test"
          color="success"
          sx={{
            // backgroundColor: i % 2 === 0 ? null : "background.lightSuccess",
            // color: "primary.success",
            "&:hover": {
              // backgroundColor: i % 2 === 0 ? null : "background.lightSuccess",
              // color: "primary.success",
              opacity: 0.9,
            },
            fontSize: "0.65rem",
            width: "100% !important",
          }}
          onClick={startTest}
          disabled={isLoading}
        />
      </TableCell>
    </TableRow>
  );
};

export default function LabRequestTable({ openModal, data }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              S/N
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Sent Date
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Scheduled Date
            </TableCell>

            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Patient Name
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Test Name
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <Row key={row._id} row={row} i={i} openModal={openModal} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
