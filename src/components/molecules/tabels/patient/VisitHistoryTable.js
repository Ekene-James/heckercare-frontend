import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import CustomDotMenu from "components/atoms/CustomDotMenu";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import VisitSummaryModal from "components/molecules/patient/singlePatient/medicalRecords/VisitSummaryModal";

const Row = ({ row, i, toggleModal }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const menuItems = [
    {
      caption: "Visit Details",
      icon: <AssignmentOutlinedIcon sx={{ mr: 1 }} />,
      action: () => navigate(`/home/patient/visit_details/${id}/${row._id}`),
    },
    {
      caption: "Visit Summary",
      icon: <AssignmentOutlinedIcon sx={{ mr: 1 }} />,
      action: () => toggleModal(row?.id),
    },
  ];
  return (
    <TableRow
      sx={{
        mt: 1,
        "&:nth-of-type(odd)": {
          backgroundColor: "background.custom",
        },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell align="left">{i + 1}</TableCell>
      <TableCell align="left">
        {moment(new Date(row.createdAt)).format("MMM Do, YYYY : hh:mm a")}{" "}
      </TableCell>
      <TableCell align="left">
        {row.status === "ACTIVE"
          ? "Still Active"
          : moment(new Date(row.endedAt)).format("MMM Do, YYYY : hh:mm a")}
      </TableCell>

      <TableCell align="left" sx={{ fontWeight: "bold", textWrap: "nowrap" }}>
        {row.visitID}
      </TableCell>
      <TableCell align="left">
        <Stack gap={1} direction={"row"}>
          <Button
            // startIcon={<AssignmentOutlinedIcon />}
            variant="text"
            color="secondary"
            sx={{ fontSize: "0.8rem", textWrap: "nowrap" }}
            onClick={() =>
              navigate(`/home/patient/visit_details/${id}/${row._id}`)
            }
          >
            Visit Details
          </Button>
          <Button
            variant="text"
            color="secondary"
            sx={{ fontSize: "0.8rem", textWrap: "nowrap" }}
            onClick={() => toggleModal(row?.id)}
          >
            Visit Summary
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default function VisitHistoryTable({ data }) {
  const modalRef = React.useRef(null);
  const [visitId, setvisitId] = React.useState("");

  const toggleModal = (id) => {
    setvisitId(id);
    modalRef?.current?.handleToggle();
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left"></TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Start Date / Time
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                End Date / Time
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Visit ID
              </TableCell>

              <TableCell align="center" sx={{ fontWeight: "bold" }}>
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
      <CustomRightDrawer
        ref={modalRef}
        drawerSx={{
          width: {
            xs: "90vw",
            sm: "90vw",
          },
        }}
        title="Visits Summary"
      >
        <VisitSummaryModal visitId={visitId} />
      </CustomRightDrawer>
    </>
  );
}
