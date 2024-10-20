import { Divider, Grid, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";

import React from "react";
import DoneIcon from "@mui/icons-material/Done";
import DetailsCard from "./DetailsCard";

import moment from "moment";
import AdjustIcon from "@mui/icons-material/Adjust";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import {
  GET_ACCOUNTING_REQUISITIONS,
  GET_ALL_INVENTORY_REQUISITIONS,
} from "utils/reactQueryKeys";
import CustomSelect from "components/atoms/Select";

import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import CheckIcon from "@mui/icons-material/Check";

const hodApprovalOptions = [
  {
    name: "Waiting",
    value: "PENDING",
  },
  {
    name: "Declined",
    value: "DECLINED",
  },
  {
    name: "Approved",
    value: "APPROVED",
  },
];
const Status = ({ statusValue, desc }) => {
  let status;
  if (statusValue === "PENDING") {
    status = (
      <CustomButton
        sx={{
          pointerEvents: "none",
          ml: 3,
          fontSize: "0.8em",
        }}
        text={"Pending"}
        variant="custom"
        rgb="10, 10, 10"
        startIcon={
          <RemoveCircleOutlineIcon sx={{ color: "rgb(10, 10, 10)" }} />
        }
      />
    );
  } else if (statusValue === "APPROVED") {
    status = (
      <CustomButton
        sx={{
          pointerEvents: "none",
          ml: 3,
          fontSize: "0.8em",
        }}
        text={"Approved"}
        color="success"
        variant="outlined"
        startIcon={<CheckIcon />}
      />
    );
  } else if (statusValue === "INSPECTING") {
    status = (
      <CustomButton
        sx={{
          pointerEvents: "none",
          ml: 3,
          fontSize: "0.8em",
        }}
        text={"Inspecting"}
        variant="custom"
        rgb="0, 132, 53"
        startIcon={<AdjustIcon sx={{ color: "rgb(0, 132, 53)" }} />}
      />
    );
  } else if (statusValue === "RESOLVED") {
    status = (
      <CustomButton
        sx={{
          pointerEvents: "none",
          ml: 3,
          fontSize: "0.8em",
        }}
        text={"Resolved"}
        color="info"
        startIcon={<CheckIcon />}
      />
    );
  } else if (statusValue === "FULFILLED") {
    status = (
      <CustomButton
        sx={{
          pointerEvents: "none",
          ml: 3,
          fontSize: "0.8em",
        }}
        text={"Fulfilled"}
        variant="custom"
        rgb="0, 132, 53"
        startIcon={<DoneIcon sx={{ color: "rgb(0, 132, 53)" }} />}
      />
    );
  } else if (statusValue === "DECLINED") {
    status = (
      <CustomButton
        sx={{
          pointerEvents: "none",
          ml: 3,
          fontSize: "0.8em",
        }}
        text={"Declined"}
        variant="outlined"
        color="error"
        startIcon={<DoNotDisturbAltIcon />}
      />
    );
  } else {
    status = (
      <CustomButton
        sx={{
          pointerEvents: "none",
          ml: 3,
          fontSize: "0.8em",
        }}
        text={"No status"}
        color="warning"
        startIcon={<DoNotDisturbAltIcon />}
      />
    );
  }
  return (
    <Stack spacing={1}>
      <Typography variant="small" fontWeight={"bold"}>
        {desc}
      </Typography>
      {status}
    </Stack>
  );
};

function ViewRequisitionModal({ data, closeModal }) {
  const queryClient = useQueryClient();

  // Approve req
  const { mutate: approveReq, isLoading: approveReqLoading } =
    useCustomMutation(
      {
        url: `/accounting/approve-or-reject-purchase-order/${data._id}`,
        method: "post",
        data: {
          approvalStatus: "APPROVED",
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(GET_ACCOUNTING_REQUISITIONS);

          toast.success("Success");
          closeModal();
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
      url: `/accounting/approve-or-reject-purchase-order/${data._id}`,
      method: "post",
      data: {
        approvalStatus: "DECLINED",
      },
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(GET_ACCOUNTING_REQUISITIONS);

        toast.success("Success");
        closeModal();
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }

        return toast.error(error.message);
      },
    }
  );

  return (
    <>
      <Stack
        spacing={5}
        width={{
          xs: "100%",
          sm: "85%",
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <CustomSelect
              options={hodApprovalOptions}
              label="HODs Approval"
              state={data?.headApproval}
              readOnly
              haveTopLabel={true}
              placeholder="Select"
            />
          </Grid>
          <Grid item xs={12} sm={6} />

          <Grid item xs={8}>
            <CustomTextInput
              title="Reason for decline"
              value={data?.headApprovalComment}
              placeholder={""}
              readOnly
              disabled="true"
              multiline
            />
          </Grid>
        </Grid>

        <Stack spacing={1.5}>
          <Typography variant="displaySm">Product Details</Typography>
          <Divider />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography variant="heading">{data?.title}</Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Status
                    statusValue={data?.accountApproval}
                    desc="Account Approval Status"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack spacing={0.5}>
                <Typography variant="small">Order Number</Typography>
                <Typography variant="h6">{data?.uniqueCode}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={0.5}>
                <Typography variant="small">Location</Typography>
                <Typography variant="h6">{data?.location || "-"}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={0.5}>
                <Typography variant="small">Due Date</Typography>
                <Typography variant="h6">
                  {" "}
                  {moment(new Date(data?.dueDate)).format("MMMM Do, YYYY") ===
                  "Invalid date"
                    ? data?.dueDate
                    : moment(new Date(data?.dueDate)).format("MMMM Do, YYYY")}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={0.5}>
                <Typography variant="small">Created Date</Typography>
                <Typography variant="h6">
                  {moment(data?.createdAt).format("MMMM Do, YYYY")}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Stack>

        <Stack spacing={2}>
          <Typography variant="displaySm">Request</Typography>
          <Divider />
          <Grid container spacing={2}>
            {data?.inventoryDetails
              ? data?.inventoryDetails?.map((detail, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <DetailsCard
                      title={detail?.productType?.itemName || ""}
                      details={[
                        {
                          item: "Required Qty",
                          itemDetail: detail.quantity,
                        },
                        {
                          item: "Unit Cost",
                          itemDetail: detail.unitCost,
                        },
                      ]}
                    />
                  </Grid>
                ))
              : data?.drugDetails?.map((detail, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <DetailsCard
                      title={detail?.productType?.drugName || ""}
                      details={[
                        {
                          item: "Required Qty",
                          itemDetail: detail.quantity,
                        },
                        {
                          item: "Unit Cost",
                          itemDetail: detail.unitCost,
                        },
                        {
                          item: "Unit",
                          itemDetail: detail.unit,
                        },
                      ]}
                    />
                  </Grid>
                ))}
          </Grid>
        </Stack>
        <>
          <Typography variant="displaySm">Cost</Typography>
          <Stack
            // spacing={3}
            width={{
              xs: "100%",
              sm: "75%",
            }}
            p={2}
            sx={{
              border: "1px dashed rgba(0,0,0,0.2)",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <CustomTextInput
                  title="Sub-Total Cost"
                  value={data?.cost?.subTotalCost}
                  placeholder={"Enter quantity"}
                  disabled="true"
                  readOnly
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextInput
                  title="Shipping Cost"
                  value={data?.cost?.shippingCost}
                  placeholder={"Enter quantity"}
                  disabled="true"
                  readOnly
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextInput
                  title="Sales Tax"
                  value={data?.cost?.salesTax}
                  placeholder={"Enter quantity"}
                  disabled="true"
                  readOnly
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextInput
                  title="Other Costs"
                  value={data?.cost?.otherCost}
                  placeholder={"Enter quantity"}
                  disabled="true"
                  readOnly
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextInput
                  title="Sales Percentage"
                  value={data?.cost?.salesPercentage}
                  disabled="true"
                  readOnly
                />
              </Grid>

              <Grid item xs={12}>
                <CustomTextInput
                  title="Grand Total"
                  value={
                    (+data?.cost?.subTotalCost || 0) +
                    (+data?.cost?.shippingCost || 0) +
                    (+data?.cost?.otherCost || 0) +
                    (+data?.cost?.salesTax || 0)
                  }
                  placeholder={"Enter quantity"}
                  disabled="true"
                  readOnly
                />
              </Grid>
            </Grid>
          </Stack>
        </>
        <>
          <Typography variant="displaySm">Requester</Typography>
          <Stack
            // spacing={3}
            width={{
              xs: "100%",
              sm: "75%",
            }}
            p={2}
            sx={{
              border: "1px dashed rgba(0,0,0,0.2)",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <CustomTextInput
                  title="Requester"
                  value={data?.requester?.fullName}
                  disabled="true"
                  readOnly
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextInput
                  title="Requesters Note"
                  value={data?.requesterNote}
                  placeholder={"Enter quantity"}
                  disabled="true"
                  readOnly
                  multiline
                />
              </Grid>
            </Grid>
          </Stack>
        </>
        <Stack spacing={2}>
          <Typography variant="displaySm">Vendor Details</Typography>
          <Divider />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DetailsCard
                title={data?.vendorDetails?.vendorName}
                details={[
                  {
                    item: "Address",
                    itemDetail: data.vendorDetails.address,
                  },
                  {
                    item: "Phone Number",
                    itemDetail: data.vendorDetails.phoneNumber,
                  },
                ]}
              />
            </Grid>
          </Grid>
        </Stack>
        <>
          <Typography variant="displaySm">Shipping Details</Typography>
          <Stack
            // spacing={3}
            width={{
              xs: "100%",
              sm: "75%",
            }}
            p={3}
            sx={{
              backgroundColor: "background.custom",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <CustomTextInput
                  title="Address"
                  value={data?.shippiongDetails?.address}
                  placeholder="Enter Shipper’s Address here"
                  disabled="true"
                  readOnly
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextInput
                  title="Phone Number"
                  value={data?.shippiongDetails?.phoneNumber}
                  placeholder="Enter Shipper’s Phone number here"
                  disabled="true"
                  readOnly
                />
              </Grid>
            </Grid>
          </Stack>
        </>
        <>
          <Typography variant="displaySm">Additional information</Typography>
          <Stack
            // spacing={3}
            width={{
              xs: "100%",
              sm: "75%",
            }}
            p={3}
            sx={{
              backgroundColor: "background.custom",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <CustomTextInput
                  title="Notes"
                  value={data?.additionalInfo}
                  placeholder="Type the product name here"
                  disabled="true"
                  readOnly
                  multiline
                />
              </Grid>
            </Grid>
          </Stack>
        </>
        <Stack direction="row" spacing={2}>
          <CustomButton
            text="Approve"
            color="success"
            disabled={approveReqLoading || data?.accountApproval === "APPROVED"}
            onClick={approveReq}
          />
          <CustomButton
            text="Reject"
            color="error"
            onClick={rejectReq}
            disabled={
              data?.accountApproval === "APPROVED" ||
              rejectReqLoading ||
              data?.accountApproval === "DECLINED"
            }
          />
        </Stack>
      </Stack>
    </>
  );
}

export default ViewRequisitionModal;
