import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CustomCheckbox from "components/atoms/CustomCheckbox";
import moment from "moment";

const rows = [
  {
    admissionDate: "22/05/2022 : 2:30am",
    patientName: "Afam Okereke",
    ward: "Orthopaedic ",
    frequency: "Continous ",
    uniqueID: "ID-24354758",
    age: "34",
    gender: "F",
    roomNumber: "213",
    roomType: "VIP",
    mode: "Cash",
  },
  {
    admissionDate: "22/05/2022 : 2:30am",
    patientName: "Afam Okereke",
    ward: "Orthopaedic ",
    frequency: "2-3 Hourly ",
    uniqueID: "ID-24354758",
    age: "34",
    gender: "F",
    roomNumber: "213",
    roomType: "VIP",
    mode: "Insurance",
  },
  {
    admissionDate: "22/05/2022 : 2:30am",
    patientName: "Afam Okereke",
    ward: "Orthopaedic ",
    frequency: "Continous ",
    uniqueID: "ID-24354758",
    age: "34",
    gender: "F",
    roomNumber: "213",
    roomType: "VIP",
    mode: "Cash",
  },
];
const Row = ({ row, selectedItems, handleSelect, handleUnSelect }) => {
  const autoCheck = selectedItems.includes(row);

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
        <CustomCheckbox
          onClick={(checkState) =>
            checkState ? handleSelect(row) : handleUnSelect(row)
          }
          autoCheck={autoCheck}
        />
      </TableCell>
      <TableCell align="left">{row.ID}</TableCell>

      <TableCell align="left">{`${row.firstName} ${row.lastName}`}</TableCell>

      <TableCell align="left">
        {row.age}/{row.gender}
      </TableCell>
      <TableCell align="left">{row.ward}</TableCell>
      <TableCell align="left">{row.bedNumber}</TableCell>
      <TableCell align="left">
        {moment(new Date(row.admissionDate)).format("MMMM Do, YYYY, hh:mm:ss")}
      </TableCell>
    </TableRow>
  );
};

export default function PatientAdmissionTable({
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

  const handleSelectAll = () => {
    setcheckBoxItems(data);
  };

  const handleUnSelectAll = () => {
    setcheckBoxItems([]);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "70px" }}>
              <CustomCheckbox
                onClick={(checkState) =>
                  checkState ? handleSelectAll() : handleUnSelectAll()
                }
              />
            </TableCell>

            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Unique ID
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Patient Name
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Age/Gender
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Ward
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Bed No
            </TableCell>
            {/* <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Frequency
            </TableCell> */}
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Admin Date/Time
            </TableCell>
            {/* <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Mode
            </TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.length
            ? data?.map((row, i) => (
                <Row
                  key={row._id}
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
