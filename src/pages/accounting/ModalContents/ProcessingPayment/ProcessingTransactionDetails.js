import { Box, Grid, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";

import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";

import { GET_ALL_TRANSACTIONS } from "utils/reactQueryKeys";

import Summary from "../transactionDetails/Summary";

import PersonalInfo from "./PersonalInfo";
import PaymentMethod from "./PaymentMethod";
import CustomModal from "components/atoms/CustomModal";
import UpdateStatus from "./statusUpdateModals/UpdateStatus";
import StatusUpdate from "./statusUpdateModals/StatusUpdate";

function ProcessingTransactionDetails({
  closeModal,
  details,
  openBillsSection,
  setreceiptLink,
}) {
  const queryClient = useQueryClient();
  const modalRef = React.useRef(null);

  const [paymentMethod, setpaymentMethod] = useState("others");
  const [modalType, setmodalType] = useState("update");

  const { mutate: generateReceipt, isLoading: generateReceiptLoading } =
    useCustomMutation(
      {
        url: `/accounting/generate-receipt/${details?.id}`,
        method: "post",
        data: {
          method: paymentMethod,
          amountPaid: +details?.totalCost,
        },
      },
      {
        onSuccess: (res) => {
          setreceiptLink(res.data);
          closeModal();
          openBillsSection();
          toast.success("Generated Receipt Successfully");
        },
        onError: (error) => {
          if (Array.isArray(error.message)) {
            return error.message.map((msg) => toast.error(msg));
          }

          return toast.error(error.message);
        },
      }
    );

  const { mutate: processPayment, isLoading: processPaymentLoading } =
    useCustomMutation(
      {
        url: `/accounting/pay-transaction/${details?.id}`,
        method: "post",
        data: {
          method: paymentMethod,
          amountPaid: +details?.totalCost,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(GET_ALL_TRANSACTIONS);
          closeModal();

          toast.success("Payment Processed Successfully");
        },
        onError: (error) => {
          if (Array.isArray(error.message)) {
            return error.message.map((msg) => toast.error(msg));
          }

          return toast.error(error.message);
        },
      }
    );
  const onCloseModal = () => {
    modalRef?.current?.handleToggle();
    setmodalType("");
  };
  const onOpenModal = (type) => {
    setmodalType(type);
    modalRef?.current?.handleToggle();
  };
  return (
    <>
      <Stack spacing={2}>
        <Typography variant="displaySm" ml={{ xs: 0, md: 3.5 }}>
          Transaction Details
        </Typography>
        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} sm={6}>
            <Stack sx={{ width: "100%" }} spacing={4}>
              <PersonalInfo />
              <PaymentMethod
                paymentMethod={paymentMethod}
                paymentDetails={{}}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Summary isProcessingPayment />
          </Grid>
        </Grid>
        <Box pl={{ xs: 0, md: 6 }}>
          <CustomButton
            text={"Respond"}
            color="secondary"
            onClick={onOpenModal.bind(null, "update")}
          />
        </Box>
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
          setmodalType={setmodalType}
          modalType={modalType}
        />
      </CustomModal>
    </>
  );
}

export default ProcessingTransactionDetails;
