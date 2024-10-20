import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import { useFormik } from "formik";
import React from "react";
import DoneIcon from "@mui/icons-material/Done";
import DetailsCard from "./DetailsCard";
import GoodsReceived from "./GoodsReceived";
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
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import OpenDisputeModal from "./OpenDisputeModal";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import CheckIcon from "@mui/icons-material/Check";

const initialValues = {
  headApprovalComment: "",
  headApproval: "",
};
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
const formatReceiveReqVals = (val) => {
  if (!val?.length) return;

  return val.map((data) => ({
    product: data?.productType?._id,
    // unit: data?.unit,
    batchNumber: data?.batchNumber,
    quantity: data?.quantityReceived,
    sellingPrice: data?.sellingPrice,
    purchasePrice: data?.purchasePrice,
    expiryDate: data?.expiryDate,
  }));
};
function ViewRequisitionModal({ detail: data, closeModal }) {
  const modalRef = React.useRef(null);
  const [isInspecting, setisInspecting] = React.useState(false);

  const queryClient = useQueryClient();
  const [goodsReceived, setgoodsReceived] = React.useState(
    data?.inventoryDetails || []
  );

  const { handleChange, values, setValues } = useFormik({
    initialValues,
  });
  React.useMemo(
    () => setValues({ ...values, headApproval: data.headApproval }),
    [data]
  );
  //start inspection
  const { mutate: startInspection, isLoading: startInspectionLoading } =
    useCustomMutation(
      {
        url: `/itemrequisition/mark-inspecting/${data._id}`,
        method: "patch",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(GET_ALL_INVENTORY_REQUISITIONS);
          queryClient.invalidateQueries(GET_ACCOUNTING_REQUISITIONS);
          setisInspecting(true);
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
  //head Approval
  const { mutate: updateHodApproval, isLoading: updateHodApprovalLoading } =
    useCustomMutation(
      {
        url: `/itemrequisition/headapproval/${data._id}`,
        method: "patch",
        data: values,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(GET_ALL_INVENTORY_REQUISITIONS);
          queryClient.invalidateQueries(GET_ACCOUNTING_REQUISITIONS);
          setValues({ ...values, headApprovalComment: "" });
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

  //receive requisition
  const { mutate: receiveRequisition, isLoading: receiveRequisitionLoading } =
    useCustomMutation(
      {
        url: `/itemproduct/create-item-batch/${data._id}`,
        method: "post",
        data: formatReceiveReqVals(goodsReceived),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(GET_ALL_INVENTORY_REQUISITIONS);
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

  const handleChangeDetail = (idx, e) => {
    setgoodsReceived((prev) => {
      const copy = [...prev];
      const itemObj = copy[idx];
      const item = {
        ...itemObj,
        [e.target.name]:
          e.target.name === "batchNumber" ? e.target.value : +e.target.value,
      };
      copy[idx] = item;

      return copy;
    });
  };
  const handleExpiryDate = (idx, date) => {
    setgoodsReceived((prev) => {
      const copy = [...prev];
      const itemObj = copy[idx];
      const item = {
        ...itemObj,
        expiryDate: date,
      };
      copy[idx] = item;

      return copy;
    });
  };
  let status;
  if (data.accountApproval === "PENDING") {
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
  } else if (
    data.accountApproval === "APPROVED" &&
    data.requisitionStatus === "PENDING"
  ) {
    status = (
      <CustomButton
        sx={{
          pointerEvents: "none",
          ml: 3,
          fontSize: "0.8em",
        }}
        text={"Approved"}
        color="success"
        startIcon={<CheckIcon />}
      />
    );
  } else if (
    isInspecting ||
    (data.accountApproval === "APPROVED" &&
      data.requisitionStatus === "INSPECTING")
  ) {
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
  } else if (
    data.accountApproval === "APPROVED" &&
    data.requisitionStatus === "RESOLVED"
  ) {
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
  } else if (
    data.accountApproval === "APPROVED" &&
    data.requisitionStatus === "FULFILLED"
  ) {
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
  } else if (
    data.accountApproval === "APPROVED" &&
    data.requisitionStatus === "DISPUTED"
  ) {
    status = (
      <CustomButton
        sx={{
          pointerEvents: "none",
          ml: 3,
          fontSize: "0.8em",
        }}
        text={"Disputed"}
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
  const handleReceiveRequisition = () => {
    let errorFields = 0;

    goodsReceived.forEach((goods) => {
      if (!goods?.batchNumber) {
        errorFields += 1;
        toast.error(
          `Please input Batch ID value for ${goods.productType.itemName}`
        );
      }
      if (!goods?.sellingPrice) {
        errorFields += 1;
        toast.error(
          `Please input Selling Price value for ${goods.productType.itemName}`
        );
      }
      if (
        goods?.sellingPrice &&
        goods?.purchasePrice &&
        goods?.sellingPrice < goods?.purchasePrice
      ) {
        errorFields += 1;
        toast.error(
          `Selling price cannot be less than the purchase price  for ${goods.productType.itemName}`
        );
      }
      if (!goods?.purchasePrice) {
        errorFields += 1;

        toast.error(
          `Please input Purchase Price value for ${goods.productType.itemName}`
        );
      }
      if (!goods?.expiryDate) {
        errorFields += 1;

        toast.error(
          `Please input Expiry Date value for ${goods.productType.itemName}`
        );
      }
      if (!goods?.quantityReceived) {
        errorFields += 1;

        toast.error(
          `Please input Quantity Received value for ${goods.productType.itemName}`
        );
      }
      if (goods?.quantityReceived > goods.quantity) {
        errorFields += 1;

        toast.error(
          `Quantity Received for ${goods.productType.itemName} cannot be higher than the required quantity`
        );
      }
      if (goods?.quantityReceived < goods.quantity) {
        errorFields += 1;

        toast.error(
          `Quantity Received for ${goods.productType.itemName} cannot be lower than the required quantity`
        );
      }
    });

    if (!errorFields) receiveRequisition();
  };
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
              state={values?.headApproval}
              handleChange={handleChange}
              name="headApproval"
              haveTopLabel={true}
              placeholder="Select"
            />
          </Grid>
          <Grid item xs={12} sm={6} />
          {values?.headApproval === "DECLINED" ? (
            <Grid item xs={12}>
              <CustomTextInput
                title="If Declined, State reason(s)"
                value={values.headApprovalComment}
                placeholder={"Start Typing"}
                name="headApprovalComment"
                handleChange={handleChange}
                multiline
                helperText={`${values.headApprovalComment.length}/200`}
              />
            </Grid>
          ) : null}

          <Grid item xs={8} sm={4}>
            <CustomButton
              text="Update Status"
              color="secondary"
              onClick={updateHodApproval}
              disabled={
                updateHodApprovalLoading ||
                data?.requisitionStatus === "FULFILLED"
              }
            />
          </Grid>
        </Grid>

        <Stack spacing={1.5}>
          <Typography variant="displaySm">Product Details</Typography>
          <Divider />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography variant="heading">{data?.title}</Typography>
              {data.accountApproval === "DECLINED" ? (
                <CustomButton
                  sx={{
                    pointerEvents: "none",
                    ml: 3,
                    fontSize: "0.8em",
                  }}
                  text={"Declined"}
                  color="error"
                  startIcon={<DoNotDisturbAltIcon />}
                />
              ) : (
                status
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack spacing={0.5}>
                <Typography variant="small">Location</Typography>
                <Typography variant="h6">{data?.location}</Typography>
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
            {data?.inventoryDetails?.map((detail, i) => (
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
            ))}
          </Grid>
        </Stack>
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

        <Stack spacing={2} direction="row">
          <CustomButton
            text="Start inspection"
            variant="lightSuccess"
            onClick={startInspection}
            disabled={
              startInspectionLoading ||
              data?.requisitionStatus === "INSPECTING" ||
              data?.requisitionStatus === "FULFILLED" ||
              isInspecting ||
              data?.requisitionStatus === "DISPUTED" ||
              data?.requisitionStatus === "RESOLVED" ||
              data?.accountApproval === "DECLINED"
            }
          />
        </Stack>

        {data?.requisitionStatus === "INSPECTING" ||
        isInspecting ||
        data?.requisitionStatus === "RESOLVED" ||
        data?.requisitionStatus === "DISPUTED" ? (
          <Stack spacing={2}>
            <Typography variant="displaySm">Goods Received Note</Typography>
            <Typography>Actual Stock of Goods are entered below</Typography>
            <GoodsReceived
              data={goodsReceived}
              handleChangeDetail={handleChangeDetail}
              handleExpiryDate={handleExpiryDate}
            />
          </Stack>
        ) : null}

        <Stack direction="row" spacing={2}>
          <CustomButton
            text="Update Stock"
            color="secondary"
            disabled={
              receiveRequisitionLoading ||
              data?.requisitionStatus === "FULFILLED" ||
              data?.requisitionStatus === "DISPUTED" ||
              data?.accountApproval === "DECLINED"
            }
            onClick={handleReceiveRequisition}
          />
          <CustomButton
            text="Open Dispute"
            variant="containedBrown"
            onClick={() => modalRef?.current?.handleToggle()}
            disabled={
              data?.requisitionStatus === "DISPUTED" ||
              data?.requisitionStatus === "FULFILLED" ||
              data?.requisitionStatus === "RESOLVED" ||
              data?.accountApproval === "DECLINED"
            }
          />
        </Stack>
      </Stack>
      <CustomRightDrawer ref={modalRef} title={"Open Dispute"} subTitle={""}>
        <OpenDisputeModal
          closeDisputeModal={() => modalRef?.current?.handleToggle()}
          requisitionId={data._id}
          closeViewReqModal={closeModal}
        />
      </CustomRightDrawer>
    </>
  );
}

export default ViewRequisitionModal;
