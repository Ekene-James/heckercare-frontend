import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import CustomButton from "components/atoms/CustomButton";

import RightDrawer from "pages/pharmacy/components/RightDrawer";

import EditDrugOrder from "pages/pharmacy/overview/EditDrugOrder";

const Row = ({ handleView, row }) => {
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
        {row?.uniqueCode}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {`${row?.patient?.firstName} ${row?.patient?.lastName}`}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.items?.length}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {"doctor" in row ? "Doctor" : "Pharmacist"}
      </TableCell>

      <TableCell align="left">
        <CustomButton
          variant="outlined"
          color="secondary"
          text="View"
          sx={{ border: "1px solid black", color: "primary.main" }}
          onClick={handleView}
        />
      </TableCell>
    </TableRow>
  );
};

export default function PharmacyTable({ refetch, refetchDispense, data }) {
  // const [showOrderForm, setShowOrderForm] = React.useState(false);
  const [requestDetail, setRequestDetail] = React.useState(null);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Prescription ID
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Patient Name
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Number of Medication
              </TableCell>
              {/* <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Room Type/No
            </TableCell> */}

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Requested By
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length
              ? data
                  ?.filter((d) => d.status !== "DISPENSED")
                  ?.map((row, i) => (
                    <Row
                      key={row?._id}
                      row={row}
                      handleView={() => setRequestDetail(row)}
                    />
                  ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      <RightDrawer
        open={Boolean(requestDetail)}
        closeHandler={() => setRequestDetail(null)}
        title="Request/Order"
      >
        <EditDrugOrder
          refetch={refetch}
          refetchDispense={refetchDispense}
          editData={requestDetail}
          closeModal={() => setRequestDetail(null)}
        />
      </RightDrawer>
    </>
  );
}
