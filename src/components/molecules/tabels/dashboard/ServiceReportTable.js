import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";

import moment from "moment";

import CustomButton from "components/atoms/CustomButton";

import { Stack } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from "@mui/icons-material/Check";

import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

import { numberFormatter } from "utils/numberFormatter";

import { useNavigate } from "react-router-dom";
import Pagination from "components/molecules/pagination/Pagination";

// let PageSize = 5;
// let total = 50;
const Row = ({ row, idx }) => {
  const navigate = useNavigate();

  return (
    <TableRow
      sx={{
        "&:nth-of-type(odd)": {
          backgroundColor: "background.custom",
        },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell component="th" scope="row" align="left" sx={{ width: "70px" }}>
        {idx + 1}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.uniqueCode}
      </TableCell>
      {/* <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {`${row?.patient?.firstName || ""} ${row?.patient?.lastName || ""}`}
      </TableCell> */}
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.service || row?.transactionType}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.status === "PAID" ? (
          <CustomButton
            variant="custom"
            rgb="0, 132, 53"
            startIcon={<CheckIcon sx={{ fontSize: "15px" }} />}
            text="Paid"
            sx={{ pointerEvents: "none" }}
          />
        ) : row.status === "DECLINED" ? (
          <CustomButton
            variant="custom"
            rgb="219, 30, 54"
            startIcon={<CloseIcon sx={{ fontSize: "15px" }} />}
            text="Declined"
            sx={{ pointerEvents: "none" }}
          />
        ) : row.status === "PENDING" ? (
          <CustomButton
            variant="custom"
            rgb="236, 142, 2"
            startIcon={<RemoveIcon sx={{ fontSize: "15px" }} />}
            text="Pending"
            sx={{ pointerEvents: "none" }}
          />
        ) : (
          <CustomButton
            variant="custom"
            rgb="82, 65, 195"
            startIcon={<SubdirectoryArrowRightIcon sx={{ fontSize: "15px" }} />}
            text={row?.status}
            sx={{ pointerEvents: "none" }}
          />
        )}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {`₦${numberFormatter(row?.totalCost)}`}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.department}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {moment(row?.createdAt).format("MMMM Do YYYY: hh:mm a")}
      </TableCell>

      <TableCell align="left">
        {row.attendant ? (
          <Stack direction={"row"} sx={{ width: "fit-content" }}>
            <CustomButton
              variant="text"
              color="secondary"
              // onClick={() => navigate(`/home/staff/${1}`)}
              text={row.attendant}
              sx={{ pointerEvents: "none" }}
            />
          </Stack>
        ) : null}
      </TableCell>
    </TableRow>
  );
};

export default function ServiceReportTable({
  data,
  handlePageChange,
  currentPage,
  count,
}) {
  return (
    <Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                S/N
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Request ID
              </TableCell>

              {/* <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Patient's Name
              </TableCell> */}
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Sevice/Order
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                {/* Status */}
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Price
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Department
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Date/Time
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Attendant
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length
              ? data?.map((row, i) => <Row key={row?._id} row={row} idx={i} />)
              : null}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Pagination
        currentPage={currentPage || 0}
        totalCount={count || 10}
        pageSize={10}
        activeColor="secondary.main"
        onPageChange={handlePageChange}
      /> */}
    </Stack>
  );
}
