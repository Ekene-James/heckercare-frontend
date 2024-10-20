import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";

import CustomButton from "components/atoms/CustomButton";
import moment from "moment";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { GET_LAB_UPCOMING_INVESTIGATIONS } from "utils/reactQueryKeys";

const Row = ({ row, i, toggleModal }) => {
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
        queryClient.invalidateQueries([GET_LAB_UPCOMING_INVESTIGATIONS]);
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
      <TableCell align="left">{i + 1}</TableCell>
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
      <TableCell align="left" sx={{ fontWeight: "bold" }}>
        {row?.test?.testType}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        <Link to={`/home/staff/${row?.doctor?._id}`}>
          {" "}
          {row?.doctor?.fullName}
        </Link>
      </TableCell>
      <TableCell align="left">
        <CustomButton
          text="Start Test"
          color="success"
          sx={{
            backgroundColor: i % 2 === 0 ? null : "background.lightSuccess",
            color: i % 2 === 0 ? null : "primary.success",
            textWrap: "nowrap",
            "&:hover": {
              backgroundColor: i % 2 === 0 ? null : "background.lightSuccess",
              color: i % 2 === 0 ? null : "primary.success",
              opacity: 0.9,
            },
          }}
          onClick={startTest}
          disabled={isLoading}
        />
      </TableCell>
    </TableRow>
  );
};

export default function AllLabRequestTable({ toggleModal, data }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="lab-request-table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              S/N
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Date
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
              Test Type
            </TableCell>

            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Created By
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <Row key={row._id} row={row} i={i} toggleModal={toggleModal} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
