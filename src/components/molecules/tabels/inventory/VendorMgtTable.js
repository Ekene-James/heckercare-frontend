import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Stack, Typography } from "@mui/material";

import CustomButton from "components/atoms/CustomButton";

import CustomRightDrawer from "components/atoms/CustomRightDrawer";

import ViewVendor from "components/molecules/inventory/modalContent/vendorMgt/ViewVendor";

const Row = ({ row, i, toggleModal }) => {
  return (
    <TableRow
      key={i}
      sx={{
        mt: 1,
        "&:nth-of-type(odd)": {
          backgroundColor: "background.custom",
        },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell component="th" scope="row">
        {i + 1}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row._id}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.vendorDetails?.vendorName}
      </TableCell>
      <TableCell align="center" sx={{ color: "primary.darkGrey" }}>
        {row?.contactPerson?.emailAddress}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.contactPerson?.name}
      </TableCell>
      <TableCell align="center">{row?.vendorDetails?.address}</TableCell>
      <TableCell align="left">
        {row?.active ? (
          <CustomButton
            text="Active"
            variant="lightSuccess"
            sx={{ pointerEvents: "none" }}
          />
        ) : (
          <CustomButton
            text="Inactive"
            variant="custom"
            rgb={"219, 30, 54"}
            sx={{ pointerEvents: "none" }}
          />
        )}
      </TableCell>
      <TableCell align="left">
        <CustomButton
          text="View"
          variant="text"
          color="secondary"
          onClick={toggleModal.bind(null, row)}
        />
      </TableCell>
    </TableRow>
  );
};

export default function VendorMgtTable({ data }) {
  const modalRef = React.useRef(null);

  const [edit, setedit] = React.useState(false);
  const [vendorDetail, setvendorDetail] = React.useState(null);

  const toggleModal = (item) => {
    setvendorDetail(item);
    modalRef?.current?.handleToggle();
  };
  const closeModal = () => {
    setedit(false);
    modalRef?.current?.handleToggle();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold" }} />

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Vendor ID
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Vendor Name
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Vendor Email
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Contact Person
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Location
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Action
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, i) => (
              <Row row={row} key={i} i={i} toggleModal={toggleModal} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomRightDrawer
        ref={modalRef}
        cleanUpFunc={() => setedit(false)}
        title={
          <Stack
            direction={"row"}
            alignItems="center"
            justifyContent={"space-between"}
            width="100%"
          >
            <Stack direction={"row"} alignItems="center" spacing={1}>
              <Typography sx={{ fontWeight: "bold" }} variant="heading">
                {vendorDetail?.vendorDetails?.vendorName} {" -"}
              </Typography>{" "}
              <Typography>{vendorDetail?._id}</Typography>
            </Stack>
            <CustomButton
              text="Edit"
              variant="containedBrown"
              onClick={() => setedit(true)}
              sx={{ minWidth: "15%" }}
            />
          </Stack>
        }
      >
        <ViewVendor detail={vendorDetail} closeModal={closeModal} edit={edit} />
      </CustomRightDrawer>
    </>
  );
}
