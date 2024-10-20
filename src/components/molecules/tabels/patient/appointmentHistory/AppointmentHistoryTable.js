import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Chip } from "@mui/material";
import { Link } from "react-router-dom";
import CustomButton from "components/atoms/CustomButton";
import moment from "moment";
import CustomModal from "components/atoms/CustomModal";
import { grey } from "@mui/material/colors";
import ModalChild from "components/molecules/tabels/patient/appointmentHistory/ModalChild";

export default function AppointmentHistoryTable({ data }) {
  const modalRef = React.useRef(null);
  // const [item, setitem] = React.useState({});

  // const handleToggleModal = (row) => {
  //   setitem(row);
  //   modalRef?.current?.handleToggle();
  // };
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>S/N</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="left">
                Date
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="left">
                Start Time
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="left">
                End Time
              </TableCell>

              <TableCell sx={{ fontWeight: "bold" }} align="left">
                Doctor
              </TableCell>
              {/* <TableCell sx={{ fontWeight: "bold" }} align="left">
                Action
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <TableRow
                key={i}
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: "background.custom",
                  },
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {i + 1}
                </TableCell>
                <TableCell
                  scope="row"
                  align="left"
                  sx={{ color: "primary.darkGrey", fontSize: "0.75rem" }}
                >
                  {moment(row?.startDateTime).format("MMM Do YYYY") ===
                  moment(row?.endDateTime).format("MMM Do YYYY")
                    ? moment(row?.startDateTime).format("MMM Do YYYY")
                    : `${moment(row?.startDateTime).format(
                        "MMM Do YYYY"
                      )} - ${moment(row?.endDateTime).format("MMM Do YYYY")}`}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ color: "primary.darkGrey", fontSize: "0.75rem" }}
                >
                  {row?.startTime}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ color: "primary.darkGrey", fontSize: "0.75rem" }}
                >
                  {row?.endTime}
                </TableCell>

                <TableCell
                  align="left"
                  sx={{ color: "primary.darkGrey", fontSize: "0.75rem" }}
                >
                  <Link to={`/home/staff/${row?.doctor?._id}`}>
                    {row?.doctor?.fullName}
                  </Link>
                </TableCell>

                {/* <TableCell align="left">
                  <CustomButton
                    text="View Details"
                    variant="custom"
                    rgb="105, 86, 229"
                    sx={{ fontSize: "0.75rem" }}
                    onClick={() => handleToggleModal(row)}
                  />
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 4,
          backgroundColor: grey[200],
          width: {
            xs: "95%",
            sm: "70%",
            lg: "60%",
          },
        }}
      >
        <ModalChild
          handleClose={() => modalRef?.current?.handleToggle()}
          data={item}
        />
      </CustomModal> */}
    </>
  );
}
