import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useNavigate } from "react-router-dom";
import CustomDotMenu from "components/atoms/CustomDotMenu";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import moment from "moment";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { GET_PATIENTS_DISCHARGE_LIST } from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";
const rows = [
  {
    date: "22/05/2022",
    patientName: "Afam Okereke",
    department: "Orthopaedic ",
    patientId: "ID_24354758",
    age: "34",
    gender: "F",
    status: "Pending",
    doctor: "Hanzo Hasachi",
  },
  {
    date: "22/05/2022",
    patientName: "Afam Okereke",
    department: "Orthopaedic ",
    patientId: "ID_24354758",
    age: "34",
    gender: "F",
    status: "confirmed",
    doctor: "Hanzo Hasachi",
  },
  {
    date: "22/05/2022",
    patientName: "Afam Okereke",
    department: "Orthopaedic ",
    patientId: "ID_24354758",
    age: "34",
    gender: "F",
    status: "Pending",
    doctor: "Hanzo Hasachi",
  },
];
const Row = ({ row, i, currentPage }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //discharge patient
  const { mutate: dischargePatient, isLoading: dischargePatientLoading } =
    useCustomMutation(
      {
        url: `/patients/discharge-patient/${row._id}`,
        method: "patch",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([
            GET_PATIENTS_DISCHARGE_LIST,
            {
              page: currentPage,
              limit: 10,
            },
          ]);
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

  const handleViewDetails = () => {
    navigate(`/home/patient/basic-information/${row._id}`);
  };

  const handleConfirmDischarge = () => {
    dischargePatient();
  };

  let actionBtnArr;
  if (row.admissionStatus === "discharged") {
    actionBtnArr = [
      {
        caption: "View Patient Details",
        icon: <PersonOutlineOutlinedIcon sx={{ mr: 1 }} />,
        action: handleViewDetails,
      },
    ];
  } else {
    actionBtnArr = [
      {
        caption: "View Patient Details",
        icon: <PersonOutlineOutlinedIcon sx={{ mr: 1 }} />,
        action: handleViewDetails,
      },
      {
        caption: "Confirm Discharge",
        icon: (
          <LabelOutlinedIcon
            sx={{ mr: 1, opacity: dischargePatientLoading ? 0.4 : 1 }}
          />
        ),
        action: handleConfirmDischarge,
      },
    ];
  }
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
        {moment(row.dischargeDate).format("MMMM Do YYYY")}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.ward}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.ID}
      </TableCell>

      <TableCell align="left">{`${row.firstName} ${row.lastName}`}</TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.age}/{row.gender}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.admissionStatus}
      </TableCell>
      <TableCell align="left">
        {" "}
        <CustomDotMenu items={actionBtnArr} />{" "}
      </TableCell>
    </TableRow>
  );
};

export default function DischargeRecordsTable({ data, currentPage }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              S/N
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Date
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Clinic/Department
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Patient ID
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Patient Name
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Age/Gender
            </TableCell>

            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Status
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <Row key={row._id} row={row} i={i} currentPage={currentPage} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
