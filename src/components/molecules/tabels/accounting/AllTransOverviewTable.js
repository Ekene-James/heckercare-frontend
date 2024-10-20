import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import TransactionDetails from "pages/accounting/ModalContents/transactionDetails/TransactionDetails";

import { numberFormatter } from "utils/numberFormatter";
import CustomDotMenu from "components/atoms/CustomDotMenu";

import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import ProcessingTransactionDetails from "pages/accounting/ModalContents/ProcessingPayment/ProcessingTransactionDetails";
import CustomButton from "components/atoms/CustomButton";

const Row = ({ row, idx, toggleModal }) => {
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
        {row?.patient?.ID}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {`${row?.patient?.firstName || ""} ${row?.patient?.lastName || ""}`}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {`₦${numberFormatter(row?.totalCost)}`}
      </TableCell>

      <TableCell align="left">
        <CustomButton
          text="View Details"
          onClick={toggleModal.bind(null, row)}
          variant="containedBrown"
        />
      </TableCell>
    </TableRow>
  );
};

export default function OverviewTable({ data }) {
  const [rowdata, setRowData] = React.useState({});

  const modalRef = React.useRef(null);
  const modalRef1 = React.useRef(null);

  const toggleModal = (row) => {
    setRowData(row);
    modalRef?.current?.handleToggle();
  };
  const toggleModal1 = (row) => {
    setRowData(row);
    modalRef1?.current?.handleToggle();
  };

  const openBillSection = () => {
    modalRef?.current?.handleToggle();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 640 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                S/N
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Patient ID
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Patient's Name
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Amount
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length
              ? data?.map((row, i) => (
                  <Row
                    toggleModal={toggleModal}
                    toggleModal1={toggleModal1}
                    key={row?.patient?._id}
                    row={row}
                    idx={i}
                  />
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
      {/* 
      <CustomModal ref={modalRef}>
        <BillSection details={rowdata} receiptLink={receiptLink} />
      </CustomModal> */}

      <CustomRightDrawer
        title="Transaction"
        ref={modalRef}
        drawerSx={{
          width: {
            xs: "100%",
            sm: "85%",
          },
        }}
        subTitle=""
        boxSx={{
          padding: { xs: 4, sm: "60px" },
          pl: { xs: "40px", sm: "0px!important" },
          pt: { xs: "40px", sm: "15px!important" },
        }}
      >
        <TransactionDetails
          details={rowdata}
          closeModal={() => modalRef?.current?.handleToggle()}
          openBillsSection={openBillSection}
        />
      </CustomRightDrawer>
      <CustomRightDrawer
        title="Transaction"
        ref={modalRef1}
        drawerSx={{
          width: {
            xs: "90%",
            sm: "85%",
          },
        }}
        subTitle=""
        boxSx={{
          padding: { xs: 4, sm: "60px" },
          pl: { xs: "40px", sm: "0px!important" },
          pt: { xs: "40px", sm: "15px!important" },
        }}
      >
        <ProcessingTransactionDetails
          details={rowdata}
          closeModal={() => modalRef1?.current?.handleToggle()}
          openBillsSection={openBillSection}
        />
      </CustomRightDrawer>
    </>
  );
}
