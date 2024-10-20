import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomModal from "components/atoms/CustomModal";
import { ResetPasswordModal } from "pages/settings/resetpasswordmodal";
import { DeletePermissionModal } from "pages/settings/deletepermissionmodal";
import { EditPermissionModal } from "pages/settings/editpermissionmodal";

const Row = ({
  row,
  i,
  toggleResetModal,
  toggleDeleteModal,
  toggleEditModal,
}) => {
  const navigate = useNavigate();

  return (
    <TableRow
      sx={
        {
          // "&:nth-of-type(odd)": {
          //   backgroundColor: "background.custom",
          // },
          // "&:last-child td, &:last-child th": { border: 0 },
        }
      }
    >
      <TableCell align="left">{i + 1}</TableCell>

      <TableCell
        align="left"
        sx={{ color: "primary.darkGrey", textTransform: "capitalize" }}
      >
        {row?.name}
      </TableCell>

      <TableCell align="right">
        <Grid
          container
          spacing={1}
          sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
          gap={2}
        >
          <CustomButton
            variant="custom"
            rgb="255, 157, 0"
            text="Edit Permission"
            onClick={() => toggleEditModal(row)}
          />
          <CustomButton
            variant="custom"
            rgb="225, 25, 0"
            text="Delete"
            onClick={() => toggleDeleteModal(row)}
          />
        </Grid>
      </TableCell>
    </TableRow>
  );
};

export default function WardOverviewDashboardTable({ data }) {
  const [rowDetail, setrowDetail] = React.useState({});
  const resetModalRef = React.useRef(null);
  const deleteModalRef = React.useRef(null);
  const editModalRef = React.useRef(null);

  const toggleResetModal = () => {
    resetModalRef.current.handleToggle();
  };
  const toggleDeleteModal = (row) => {
    setrowDetail(row);
    deleteModalRef.current.handleToggle();
  };
  const toggleEditModal = (row) => {
    setrowDetail(row);
    editModalRef.current.handleToggle();
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
              {/* <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Department
                </TableCell> */}
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Role
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", paddingRight: 22 }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length ? (
              data?.map((row, i) => (
                <Row
                  key={row._id}
                  row={row}
                  i={i}
                  toggleResetModal={toggleResetModal}
                  toggleEditModal={toggleEditModal}
                  toggleDeleteModal={toggleDeleteModal}
                />
              ))
            ) : (
              <TableRow>
                <TableCell align="left">No data to display</TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomModal
        ref={resetModalRef}
        childrenContSx={{
          p: 3,
          height: "fit-content !important",
          width: "40% !important",
        }}
      >
        <ResetPasswordModal />
      </CustomModal>
      <CustomModal
        ref={editModalRef}
        childrenContSx={{
          p: 3,
          height: "fit-content !important",
          width: {
            xs: "97% !important",
            sm: "43vw !important",
          },
        }}
      >
        <EditPermissionModal toggleModal={toggleEditModal} data={rowDetail} />
      </CustomModal>
      <CustomModal
        ref={deleteModalRef}
        childrenContSx={{
          p: 3,
          height: "fit-content !important",
          width: "40% !important",
        }}
      >
        <DeletePermissionModal
          toggleModal={toggleDeleteModal}
          data={rowDetail}
        />
      </CustomModal>
    </>
  );
}
