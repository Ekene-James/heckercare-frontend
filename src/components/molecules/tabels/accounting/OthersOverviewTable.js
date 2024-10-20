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
import TransactionDetails from "pages/accounting/ModalContents/transactionDetails/TransactionDetails";
import { Chip, Stack } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from "@mui/icons-material/Check";

import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import CustomModal from "components/atoms/CustomModal";
import BillSection from "pages/accounting/ModalContents/BillSection";
import { numberFormatter } from "utils/numberFormatter";
import CustomDotMenu from "components/atoms/CustomDotMenu";
import { useNavigate } from "react-router-dom";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import ProcessingTransactionDetails from "pages/accounting/ModalContents/ProcessingPayment/ProcessingTransactionDetails";

// let PageSize = 5;
// let total = 50;
const Row = ({ row, idx, toggleModal, toggleModal1 }) => {
  const navigate = useNavigate();
  const actionBtnArr = [
    {
      caption: "View Details",

      action:
        row.status === "PAID"
          ? toggleModal1.bind(null, row)
          : toggleModal.bind(null, row),
    },
    {
      caption: "Download Receipt",
      disabled: row.status === "PAID",
      action: () => {},
    },
  ];
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
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {`${row?.patient?.firstName || ""} ${row?.patient?.lastName || ""}`}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {"Cash"}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.status === "PAID" ? (
          <CustomButton
            variant="custom"
            rgb="0, 132, 53"
            startIcon={<CheckIcon sx={{ fontSize: "15px" }} />}
            text="Approved"
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
        ) : row.status === "PROCESSING" ? (
          <CustomButton
            variant="custom"
            rgb="236, 142, 2"
            startIcon={<RemoveIcon sx={{ fontSize: "15px" }} />}
            text="Processing"
            sx={{ pointerEvents: "none" }}
          />
        ) : (
          <CustomButton
            variant="custom"
            rgb="82, 65, 195"
            startIcon={<SubdirectoryArrowRightIcon sx={{ fontSize: "15px" }} />}
            text="Pending"
            sx={{ pointerEvents: "none" }}
          />
        )}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {`₦${numberFormatter(row?.totalCost)}`}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {moment(row?.createdAt).format("MMMM Do YYYY")}
      </TableCell>

      <TableCell align="left">
        <Stack direction={"row"} sx={{ width: "fit-content" }}>
          <CustomButton
            variant="text"
            color="secondary"
            onClick={() => navigate(`/home/staff/${1}`)}
            text="Attendendants name"
          />
          <CustomDotMenu items={actionBtnArr} />
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default function OthersOverviewTable({ refetch, data }) {
  const [receiptLink, setreceiptLink] = React.useState("");

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
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                S/N
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Request ID
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Patient's Name
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Payment Method
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Amount
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
              ? data?.map((row, i) => (
                  <Row
                    toggleModal={toggleModal}
                    toggleModal1={toggleModal1}
                    key={row?._id}
                    row={row}
                    idx={i}
                  />
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomModal ref={modalRef}>
        <BillSection details={rowdata} receiptLink={receiptLink} />
      </CustomModal>

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
          setreceiptLink={setreceiptLink}
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
          setreceiptLink={setreceiptLink}
        />
      </CustomRightDrawer>
    </>
  );
}
