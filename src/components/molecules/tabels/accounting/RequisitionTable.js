import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Link, useNavigate } from "react-router-dom";
import CustomDotMenu from "components/atoms/CustomDotMenu";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import moment from "moment";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import CustomCheckbox from "components/atoms/CustomCheckbox";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_ACCOUNTING_REQUISITIONS,
  GET_EMERGENCY_PATIENTS,
  GET_PENDING_REQUEST,
  GET_WARDS,
  SCHEDULE_DISCHARGE,
} from "utils/reactQueryKeys";

import CustomButton from "components/atoms/CustomButton";

import { useQueryClient } from "react-query";

import ExpiredDrugDetails from "pages/pharmacy/overview/ExpiredDrugDetails";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";

import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import CheckIcon from "@mui/icons-material/Check";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";

import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

import RuleIcon from "@mui/icons-material/Rule";
import ViewRequisitionModal from "components/molecules/accounting/modal/modalContents/viewRequisition/ViewRequisitionModal";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
const Status = ({ icon, status, color }) => {};
const Row = ({
  openModal,
  row,
  selectedItems,
  handleSelect,
  handleUnSelect,
}) => {
  const queryClient = useQueryClient();
  // Approve req
  const { mutate: approveReq, isLoading: approveReqLoading } =
    useCustomMutation(
      {
        url: `/accounting/approve-or-reject-purchase-order/${row._id}`,
        method: "post",
        data: {
          approvalStatus: "APPROVED",
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(GET_ACCOUNTING_REQUISITIONS);

          toast.success("Success");
        },

        onError: (error) => {
          if (Array.isArray(error.message)) {
            return error.message.map((msg) => toast.error(msg));
          }

          return toast.error(error.message);
        },
      }
    );

  //reject req
  const { mutate: rejectReq, isLoading: rejectReqLoading } = useCustomMutation(
    {
      url: `/accounting/approve-or-reject-purchase-order/${row._id}`,
      method: "post",
      data: {
        approvalStatus: "DECLINED",
      },
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(GET_ACCOUNTING_REQUISITIONS);

        toast.success("Success");
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }

        return toast.error(error.message);
      },
    }
  );
  let status;
  if (row?.accountApproval === "PENDING") {
    status = (
      <CustomButton
        variant="text"
        startIcon={<RemoveCircleOutlineIcon />}
        color="secondary"
        text="Pending"
        sx={{ pointerEvents: "none" }}
      />
    );
  } else if (row.accountApproval === "APPROVED") {
    status = (
      <CustomButton
        variant="text"
        startIcon={<CheckIcon />}
        color="success"
        text="Approved"
        sx={{ pointerEvents: "none" }}
      />
    );
  } else {
    status = (
      <CustomButton
        variant="text"
        startIcon={<DoNotDisturbAltIcon />}
        color="error"
        text="Declined"
        sx={{ pointerEvents: "none" }}
      />
    );
  }

  const isSelected = selectedItems.find((item) => item._id === row.id);
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
          autoCheck={isSelected}
        />
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.title}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.uniqueCode}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {(row?.cost?.salesTax || 0) +
          (row?.cost?.shippingCost || 0) +
          (row?.cost?.otherCost || 0) +
          (row?.cost?.subTotalCost || 0)}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.vendorDetails?.vendorName}
      </TableCell>

      <TableCell align="left">{`${row?.checkedBy?.firstName || ""} ${
        row?.checkedBy?.lastName || ""
      }`}</TableCell>
      <TableCell align="left">
        {moment(new Date(row?.createdAt)).format("MMMM Do, YYYY")}
      </TableCell>
      <TableCell align="left">{status}</TableCell>
      <TableCell align="right">
        <CustomDotMenu
          disabled={rejectReqLoading || approveReqLoading}
          items={[
            {
              caption: "View Details",
              action: () => openModal(row),
            },
            {
              caption: "Approve",
              action: () => approveReq(),
              disabled: row.accountApproval === "APPROVED",
            },
            {
              caption: "Decline",
              action: () => rejectReq(),
              disabled:
                row.accountApproval === "APPROVED" ||
                row.accountApproval === "DECLINED",
            },
          ]}
        />
      </TableCell>
    </TableRow>
  );
};

export default function RequisitionTable({
  data,
  checkBoxItems,
  setcheckBoxItems,
}) {
  const modalRef = React.useRef(null);

  const [requisitionDetail, setrequisitionDetail] = React.useState({});

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
  const openModal = (row) => {
    setrequisitionDetail(row);
    modalRef?.current?.handleToggle();
  };

  return (
    <>
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
                Title
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Order Number
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Total Cost
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Vendor
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Checked By
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Date Created
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length
              ? data?.map((row, i) => (
                  <Row
                    key={row?._id}
                    row={row}
                    openModal={openModal}
                    handleSelect={handleSelect}
                    handleUnSelect={handleUnSelect}
                    selectedItems={checkBoxItems}
                  />
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomRightDrawer ref={modalRef} title={"Requisition"} subTitle={""}>
        <ViewRequisitionModal
          data={requisitionDetail}
          closeModal={() => modalRef?.current?.handleToggle()}
        />
      </CustomRightDrawer>
    </>
  );
}
