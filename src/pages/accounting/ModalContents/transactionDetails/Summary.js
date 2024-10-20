import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import CustomCheckbox from "components/atoms/CustomCheckbox";
import moment from "moment";
import React, { useState } from "react";
import { currencyFormatter } from "utils/numberFormatter";
import CircleIcon from "@mui/icons-material/Circle";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PaymentMethod from "./PaymentMethod";
import CustomButton from "components/atoms/CustomButton";
import CustomModal from "components/atoms/CustomModal";

import StatusUpdate from "../ProcessingPayment/statusUpdateModals/StatusUpdate";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useQueryClient } from "react-query";
import {
  GET_ALL_PAID_TRANSACTIONS,
  GET_ALL_PENDING_TRANSACTIONS,
  GET_ALL_PENDING_TRANSACTIONS_FOR_PATIENT,
} from "utils/reactQueryKeys";
import { toast } from "react-toastify";

const initialState = {
  // type: "",
  // sendersName: "",
  // status: "",
  // amount: "",
  reference: "",
};

const getRemainingFees = (checkBoxItems, transactionDetails, totalCost = 0) => {
  const selectedItemsCost = checkBoxItems.reduce((a, b) => a + b.totalCost, 0);
  const processingPaymentsCost = transactionDetails
    .filter((a) => a.status === "PROCESSING")
    .reduce((a, b) => a + b.totalCost, 0);

  return totalCost - (selectedItemsCost + processingPaymentsCost);
};

const Fees = ({
  row,
  selectedItems,
  handleSelect,
  handleUnSelect,
  isProcessingPayment,
  isSummaryComponent,
}) => {
  const [openMore, setopenMore] = useState(false);

  const isSelected = isSummaryComponent
    ? selectedItems.find((item) => item._id === row._id)
    : null;

  return (
    <Stack
      width={"100%"}
      spacing={2}
      sx={{ opacity: isProcessingPayment ? 0.5 : 1 }}
    >
      <Stack
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        width={"100%"}
        spacing={2}
        direction={"row"}
      >
        {isSummaryComponent ? (
          <CustomCheckbox
            onClick={(checkState) =>
              checkState ? handleSelect(row) : handleUnSelect(row)
            }
            checkColor={isProcessingPayment ? "primary.main" : "secondary.main"}
            autoCheck={isSelected || isProcessingPayment}
            disabled={isProcessingPayment}
          />
        ) : (
          <IconButton
            onClick={handleUnSelect.bind(this, row)}
            color={"error"}
            disabled={isProcessingPayment}
          >
            <HighlightOffIcon />
          </IconButton>
        )}
        <Stack flexDirection={"column"} opacity={0.5}>
          <Typography>{row.transactionType}</Typography>
          <Stack spacing={1.5} direction={"row"} alignItems={"center"}>
            {/* <Typography variant="small">{row?.subtitle}</Typography> */}
            <CircleIcon sx={{ fontSize: "4px" }} />
            <Typography variant="small">
              {moment(new Date(row?.createdAt)).format("MMMM Do, YYYY, hh:ss")}
            </Typography>
          </Stack>
          {row.transactionType === "PHARMACY" && (
            <Stack>
              <Stack
                sx={{ cursor: "pointer" }}
                direction={"row"}
                gap={0.2}
                alignItems={"center"}
                onClick={() => setopenMore((prev) => !prev)}
              >
                <Typography
                  variant="small"
                  sx={{ textDecoration: "underline" }}
                >
                  Show more
                </Typography>
                {openMore ? (
                  <KeyboardArrowUpIcon fontSize="11px" />
                ) : (
                  <KeyboardArrowDownIcon fontSize="11px" />
                )}
              </Stack>
              {openMore && (
                <Stack px={1}>
                  {row?.itemToPayFor?.items?.map((item, idx) => (
                    <Stack
                      key={idx}
                      alignItems={"center"}
                      direction={"row"}
                      gap={1}
                    >
                      <CircleIcon sx={{ fontSize: "2px" }} />
                      <Typography variant="small">
                        {item?.product?.drugName}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Stack>
          )}

          {row.transactionType === "LABORATORY" ||
          row.transactionType === "RADIOLOGY" ? (
            <Stack alignItems={"center"} direction={"row"} gap={1}>
              <CircleIcon sx={{ fontSize: "4px" }} />
              <Typography variant="small" fontWeight={"800"}>
                {row?.itemToPayFor?.test?.testName}
              </Typography>
            </Stack>
          ) : null}
        </Stack>

        <Typography variant="heading">
          {currencyFormatter(row?.totalCost)}
        </Typography>
      </Stack>
      <Divider light sx={{ width: "100%" }} />
    </Stack>
  );
};

function Summary({
  transactionDetails = {},

  checkBoxItems,
  setcheckBoxItems,
  title = "Summary",
  isSummaryComponent = false,
  isSelectPaymentComponent = false,
  setpaymentMethod,
  paymentMethod,
  processHMOPayments = (data) => {},
  processHMOPaymentsLoading = false,
  paymentStatus = "PENDING",
  hmoProviderState = "",
  patientId = "",
  closeTransactionDetails = () => {},
  toggleDownloadModal = () => {},
}) {
  const queryClient = useQueryClient();
  const modalRef = React.useRef(null);

  const [modalType, setmodalType] = useState("update");

  const [othersForm, setothersForm] = useState(initialState);
  const [hmoProvider, sethmoProvider] = useState(hmoProviderState);
  const [termsAndConditionCheckBox, settermsAndConditionCheckBox] =
    useState(false);

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
  const processHMOPaymentsData = !isSummaryComponent
    ? {
        paymentIds: checkBoxItems.map((item) => item._id),
        hmoProvider,
      }
    : null;

  const onCloseModal = () => {
    modalRef?.current?.handleToggle();
    setmodalType("");
  };

  const onOpenModal = (type) => {
    setmodalType(type);
    modalRef?.current?.handleToggle();
  };

  //approve hmo transaction
  const { mutate: othersPayment, isLoading: othersPaymentLoading } =
    useCustomMutation(
      {
        url: `/payment/confirm-payment-cash`,
        method: "post",
      },
      {
        onSuccess: (res) => {
          const url = res?.data?.data?.receipt;

          queryClient.invalidateQueries(
            GET_ALL_PENDING_TRANSACTIONS_FOR_PATIENT,
            patientId
          );
          queryClient.invalidateQueries(GET_ALL_PENDING_TRANSACTIONS);
          queryClient.invalidateQueries(GET_ALL_PAID_TRANSACTIONS);
          setcheckBoxItems([]);

          toast.success("Success");

          toggleDownloadModal(url);
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
        direction={"column"}
        spacing={2}
        width={"100%"}
        sx={{
          border: "0.2px solid rgba(0,0,0,0.2)",
          borderRadius: "5px",
          p: { xs: 1, sm: 3 },
        }}
      >
        <Stack>
          <Typography variant="displaySm">{title}</Typography>
        </Stack>
        {checkBoxItems.length > 0 && isSummaryComponent ? (
          <Stack width={"100%"} alignItems={"flex-end"}>
            <Typography color="secondary">
              {checkBoxItems.length} item(s) selected
            </Typography>
          </Stack>
        ) : null}

        {transactionDetails?.payments?.length ? (
          transactionDetails?.payments?.map((row, i) => (
            <Fees
              key={row?._id}
              row={row}
              handleSelect={handleSelect}
              handleUnSelect={handleUnSelect}
              isProcessingPayment={row?.status === "PROCESSING"}
              selectedItems={checkBoxItems}
              isSummaryComponent={isSummaryComponent}
            />
          ))
        ) : (
          <Typography variant="">No Pending Payments</Typography>
        )}
        {isSelectPaymentComponent ? (
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            width={"100%"}
          >
            <Typography>Total</Typography>
            <Stack>
              <Typography variant="displaySm">
                {" "}
                {currencyFormatter(
                  checkBoxItems
                    .map((item) => item.totalCost)
                    .reduce((a, b) => a + b),
                  0
                )}
              </Typography>
            </Stack>
          </Stack>
        ) : null}
        {isSummaryComponent ? (
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            width={"100%"}
          >
            <Typography>Total</Typography>
            <Stack>
              <Typography variant="displaySm">
                {" "}
                {currencyFormatter(transactionDetails?.totalCost)}
              </Typography>
              <Stack direction={"row"} spacing={1}>
                <Typography variant="small" color="error">
                  Remaining
                </Typography>
                <Typography variant="small" color="error">
                  {currencyFormatter(
                    getRemainingFees(
                      checkBoxItems,
                      transactionDetails?.payments,
                      transactionDetails?.totalCost
                    )
                  )}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        ) : (
          <>
            <PaymentMethod
              paymentMethod={paymentMethod}
              setpaymentMethod={setpaymentMethod}
              setothersForm={setothersForm}
              othersForm={othersForm}
              hmoProvider={hmoProvider}
              sethmoProvider={sethmoProvider}
              settermsAndConditionCheckBox={settermsAndConditionCheckBox}
              paymentStatus={paymentStatus}
            />
            <Stack pl={{ xs: 0, md: 4 }}>
              {paymentMethod === "hmo" ? (
                <Box>
                  {paymentStatus === "PENDING" ? (
                    <CustomButton
                      text={"Process payment"}
                      color="secondary"
                      onClick={processHMOPayments.bind(
                        null,
                        processHMOPaymentsData
                      )}
                      disabled={
                        processHMOPaymentsLoading || !termsAndConditionCheckBox
                      }
                    />
                  ) : (
                    <CustomButton
                      text={"Respond"}
                      color="secondary"
                      onClick={onOpenModal.bind(null, "update")}
                    />
                  )}
                </Box>
              ) : (
                <Stack spacing={1} direction="row" width="fit-content">
                  <CustomButton
                    text={"Confirm Receipt"}
                    color="secondary"
                    onClick={() =>
                      othersPayment({
                        reference: othersForm.reference,
                        paymentIds: transactionDetails.payments.map(
                          (transaction) => transaction._id
                        ),
                      })
                    }
                    disabled={othersPaymentLoading}
                  />
                </Stack>
              )}
            </Stack>

            <CustomModal
              ref={modalRef}
              childrenContSx={{
                width: {
                  xs: "90vw",
                  sm: "40vw",
                  md: "495px",
                },
                height: {
                  xs: "fit-content",
                  md: "330px",
                },
                p: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StatusUpdate
                close={onCloseModal}
                modalType={modalType}
                transactionDetails={transactionDetails}
                patientId={patientId}
                toggleDownloadModal={toggleDownloadModal}
              />
            </CustomModal>
          </>
        )}
      </Stack>
    </>
  );
}

export default Summary;
