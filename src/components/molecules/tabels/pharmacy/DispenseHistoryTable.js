import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import moment from "moment";

import { IconButton } from "@mui/material";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import Pagination from "components/molecules/pagination/Pagination";
import MediceDetailsModal from "pages/pharmacy/components/MedicineDetails";
import { currencyFormatter } from "utils/numberFormatter";

const Row = ({ i, toggleModal, row }) => {
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
        {i + 1}
      </TableCell>

      <TableCell align="left">{row?.uniqueCode}</TableCell>
      <TableCell align="left">{`${row?.patient?.firstName} ${row?.patient?.lastName}`}</TableCell>

      <TableCell align="left">{currencyFormatter(row?.totalCost)}</TableCell>
      <TableCell align="left">
        {moment(row.dispensedDate).format("MMMM d, YYYY")}
      </TableCell>

      <TableCell align="left">
        <IconButton
          color="secondary"
          disableRipple
          sx={{
            fontSize: "14px",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => toggleModal(row)}
        >
          View
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default function DispenseHistoryTable({
  data,
  currentPage,
  handlePageChange,
}) {
  const modalRef = React.useRef(null);
  const [details, setdetails] = React.useState(null);
  const toggleModal = (item) => {
    setdetails(item);
    modalRef?.current?.handleToggle();
  };
  return (
    <>
      {data.prescriptions.length ? (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={{ fontWeight: "70px" }}>
                    S/N
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Request Number
                  </TableCell>

                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Patient Name
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Sales Price
                  </TableCell>

                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Dispense Date
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.prescriptions?.map((row, i) => (
                  <Row
                    key={row?._id}
                    row={row}
                    toggleModal={toggleModal}
                    i={i}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            currentPage={currentPage}
            totalCount={data?.count || 5}
            pageSize={10}
            activeColor="secondary.main"
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        "No data found"
      )}

      <CustomRightDrawer ref={modalRef} title={"Medicine Details"} subTitle="">
        <MediceDetailsModal details={details} />
      </CustomRightDrawer>
    </>
  );
}
