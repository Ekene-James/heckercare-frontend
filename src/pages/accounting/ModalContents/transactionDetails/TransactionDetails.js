import { Box, Grid, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";

import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";

import {
  GET_ALL_PENDING_TRANSACTIONS,
  GET_ALL_PENDING_TRANSACTIONS_FOR_PATIENT,
  GET_ALL_TRANSACTIONS,
} from "utils/reactQueryKeys";

import PersonalInfo from "./PersonalInfo";
import Summary from "./Summary";
import PaymentMethod from "./PaymentMethod";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
import { useRef } from "react";
import { downloadOnClick } from "utils/exportToExcel";
import { baseURL } from "utils/axios-utils";
import moment from "moment";
import CustomModal from "components/atoms/CustomModal";
import DownloadPaymentReceipt from "../ProcessingPayment/DownloadPaymentReceipt";

function TransactionDetails({
  closeModal,
  details,
  openBillsSection,
  setreceiptLink,
}) {
  const queryClient = useQueryClient();
  const [checkBoxItems, setcheckBoxItems] = useState([]);
  const processingHMOPayments = useRef([]);
  const modalRef = React.useRef(null);
  const [paymentMethod, setpaymentMethod] = useState("hmo");
  const [paymentMethod1, setpaymentMethod1] = useState("hmo");
  const [downloadUrl, setdownloadUrl] = useState("");

  //get pending transactions
  const { data: transactionDetails, isLoading: getTransactionDetailsLoading } =
    useCustomQuery(
      [GET_ALL_PENDING_TRANSACTIONS_FOR_PATIENT, details?.patient?._id],
      {
        url: `/payment/get-pending-payents-for-patient/${details?.patient?._id}`,
        method: "get",
      },
      {
        refetchOnWindowFocus: false,
      }
    );

  // const { mutate: generateReceipt, isLoading: generateReceiptLoading } =
  //   useCustomMutation(
  //     {
  //       url: `/accounting/generate-receipt/${details?.id}`,
  //       method: "post",
  //       data: {
  //         method: paymentMethod,
  //         amountPaid: +details?.totalCost,
  //       },
  //     },
  //     {
  //       onSuccess: (res) => {
  //         setreceiptLink(res.data);
  //         closeModal();
  //         openBillsSection();
  //         toast.success("Generated Receipt Successfully");
  //       },
  //       onError: (error) => {
  //         if (Array.isArray(error.message)) {
  //           return error.message.map((msg) => toast.error(msg));
  //         }

  //         return toast.error(error.message);
  //       },
  //     }
  //   );

  const toggleDownloadModal = (url) => {
    if (url) setdownloadUrl(url);
    modalRef?.current?.handleToggle();
  };

  //process hmo transaction
  const { mutate: processHMO, isLoading: processHMOLoading } =
    useCustomMutation(
      {
        url: `/payment/process-payment-hmo`,
        method: "post",
      },
      {
        onSuccess: (res) => {
          queryClient.invalidateQueries(GET_ALL_PENDING_TRANSACTIONS);
          toast.success("Payment Processed Successfully");
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

  if (
    !getTransactionDetailsLoading &&
    transactionDetails?.data?.payments?.length
  ) {
    processingHMOPayments.current = transactionDetails?.data?.payments?.filter(
      (data) =>
        (data.status === "PROCESSING" || data.status === "PAID") &&
        data?.hmoProvider
    );
  }

  const processHMOPayments = (data) => {
    processHMO(data);
  };

  return (
    <>
      <Stack spacing={2}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography variant="displaySm" ml={{ xs: 0, md: 3.5 }}>
            Transaction Details
          </Typography>
          <CustomButton
            text="Generate Invoice"
            onClick={() =>
              downloadOnClick(
                `${baseURL}/payment/patient/${details?.patient?._id}/generate-invoice`,
                `invoice for ${details?.patient?.firstName} ${
                  details?.patient?.lastName
                } on ${moment(new Date()).format("MMMM Do, YYYY")}`
              )
            }
            color="success"
            // disabled={!row?.receiptUrl}
            sx={{ minWidth: "150px" }}
          />
        </Stack>
        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} sm={6}>
            <Stack sx={{ width: "100%" }} spacing={4}>
              <PersonalInfo patientInfo={details?.patient} />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            {getTransactionDetailsLoading ? (
              <CustomLoader />
            ) : (
              <Stack sx={{ width: "100%" }} spacing={2}>
                <Summary
                  transactionDetails={transactionDetails?.data}
                  checkBoxItems={checkBoxItems}
                  setcheckBoxItems={setcheckBoxItems}
                  paymentMethod={paymentMethod1}
                  setpaymentMethod={setpaymentMethod1}
                  isSummaryComponent
                  closeTransactionDetails={closeModal}
                  toggleDownloadModal={toggleDownloadModal}
                />
                {checkBoxItems.length ? (
                  <Summary
                    transactionDetails={{ payments: checkBoxItems }}
                    checkBoxItems={checkBoxItems}
                    setcheckBoxItems={setcheckBoxItems}
                    paymentMethod={paymentMethod}
                    setpaymentMethod={setpaymentMethod}
                    title="Selected Payments"
                    processHMOPayments={processHMOPayments}
                    processHMOPaymentsLoading={processHMOLoading}
                    isSelectPaymentComponent
                    closeTransactionDetails={closeModal}
                    toggleDownloadModal={toggleDownloadModal}
                  />
                ) : null}

                {processingHMOPayments.current.length ? (
                  <Summary
                    transactionDetails={{
                      payments: processingHMOPayments.current,
                    }}
                    checkBoxItems={checkBoxItems}
                    setcheckBoxItems={setcheckBoxItems}
                    paymentMethod={"hmo"}
                    setpaymentMethod={setpaymentMethod}
                    title="Processing HMO Payments"
                    processHMOPayments={processHMOPayments}
                    processHMOPaymentsLoading={processHMOLoading}
                    paymentStatus={processingHMOPayments.current[0].status}
                    hmoProviderState={
                      processingHMOPayments.current[0].hmoProvider
                    }
                    closeTransactionDetails={closeModal}
                    patientId={details?.patient?._id}
                    toggleDownloadModal={toggleDownloadModal}
                  />
                ) : null}

                {/* todo: get component for processing/processed others payments */}
              </Stack>
            )}
          </Grid>
        </Grid>
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
        <DownloadPaymentReceipt
          closeModal={() => {
            toggleDownloadModal();
            closeModal();
          }}
          downloadUrl={downloadUrl}
          patientDetails={details?.patient}
        />
      </CustomModal>
    </>
  );
}

export default TransactionDetails;
