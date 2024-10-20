import React, { useState } from "react";
import UpdateStatus from "./UpdateStatus";
import Approved from "./Approved";
import Failed from "./Failed";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";

import {
  GET_ALL_PAID_TRANSACTIONS,
  GET_ALL_PENDING_TRANSACTIONS,
  GET_ALL_PENDING_TRANSACTIONS_FOR_PATIENT,
} from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";

function StatusUpdate({
  close,
  toggleDownloadModal,
  modalType,
  patientId,
  transactionDetails,
}) {
  const queryClient = useQueryClient();

  // const [receiptUrl, setreceiptUrl] = useState("");

  let view;

  //approve hmo transaction
  const { mutate: approve, isLoading: approveLoading } = useCustomMutation(
    {
      url: `/payment/confirm-payment-hmo`,
      method: "post",
    },
    {
      onSuccess: (res) => {
        // console.log(res);
        const url = res?.data?.data?.receipt;
        queryClient.invalidateQueries(
          GET_ALL_PENDING_TRANSACTIONS_FOR_PATIENT,
          patientId
        );
        queryClient.invalidateQueries(GET_ALL_PENDING_TRANSACTIONS);
        queryClient.invalidateQueries(GET_ALL_PAID_TRANSACTIONS);
        toast.success("Success");
        toggleDownloadModal(url);
        close();
        // setreceiptUrl(res);
        // setmodalType("approved");
      },
      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }

        return toast.error(error.message);
      },
    }
  );

  //reject hmo payment
  const { mutate: reject, isLoading: rejectLoading } = useCustomMutation(
    {
      url: `/payment/reject-payment-hmo`,
      method: "post",
    },
    {
      onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(
          GET_ALL_PENDING_TRANSACTIONS_FOR_PATIENT,
          patientId
        );
        queryClient.invalidateQueries(GET_ALL_PENDING_TRANSACTIONS);
        toast.success("Success");
        close();
        // setreceiptUrl(res);
        // setmodalType("approved");
      },
      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }

        return toast.error(error.message);
      },
    }
  );
  switch (modalType) {
    case "update":
      view = (
        <UpdateStatus
          transactionDetails={transactionDetails}
          approve={approve}
          reject={reject}
          rejectLoading={rejectLoading}
          approveLoading={approveLoading}
        />
      );
      break;
    // case "approved":
    //   view = <Approved close={close} />;
    //   break;
    // case "failed":
    //   view = <Failed close={close} setmodalType={setmodalType} />;
    //   break;

    default:
      break;
  }
  return <>{view}</>;
}

export default StatusUpdate;
