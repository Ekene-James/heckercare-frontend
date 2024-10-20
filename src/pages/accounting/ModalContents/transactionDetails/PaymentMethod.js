import { Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import RadioBtnWithDescription from "components/atoms/RadioBtnWithDescription";
import CustomSelect from "components/atoms/Select";
import React, { useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from "@mui/icons-material/Check";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import CustomCheckbox from "components/atoms/CustomCheckbox";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_HMOS } from "utils/reactQueryKeys";

const methods = [
  {
    header: "HMO",
    desc: "Horizon Inc. HMO Services ",
    value: "hmo",
    descImg: "/imgs/image.png",
  },
  {
    header: "Others",
    desc: "USSD, Card Payments, Transfer",
    value: "others",
  },
];

const HmoPaymentMethod = ({
  hmoProvider,
  handleChange,
  paymentStatus,
  handleCheckBox,
}) => {
  let statusType;

  switch (paymentStatus) {
    case "PROCESSING":
      statusType = (
        <CustomButton
          variant="outlined"
          startIcon={<RemoveIcon sx={{ fontSize: "15px" }} />}
          color="warning"
          text="Processing"
          sx={{
            pointerEvents: "none",
          }}
        />
      );
      break;
    case "PENDING":
      statusType = (
        <CustomButton
          variant="outlined"
          startIcon={<SubdirectoryArrowRightIcon sx={{ fontSize: "15px" }} />}
          color="secondary"
          text="Pending"
          sx={{
            pointerEvents: "none",
          }}
        />
      );
      break;
    case "PAID":
      statusType = (
        <CustomButton
          variant="outlined"
          startIcon={<CheckIcon sx={{ fontSize: "15px" }} />}
          color="success"
          text="Paid"
          sx={{
            pointerEvents: "none",
          }}
        />
      );
      break;

    default:
      break;
  }

  //get HMO's
  const { data: hmos } = useCustomQuery(
    GET_HMOS,
    {
      url: `/hmo`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const formartedData = data.data.data.map((hmo) => {
          return { name: hmo.name, value: hmo._id };
        });
        return formartedData;
      },
    }
  );
  return (
    <>
      <CustomSelect
        options={hmos || []}
        placeholder="Select HMO Provider Name"
        state={hmoProvider}
        handleChange={handleChange}
        label="HMO Provider Name"
        name="hmoProvider"
        haveTopLabel={true}
        disabled={paymentStatus !== "PENDING"}
      />
      <Stack direction={"row"} spacing={2} alignItems={"center"}>
        <Typography sx={{ fontWeight: "bold" }}>Status</Typography>
        {statusType}
      </Stack>
      {paymentStatus === "PENDING" && (
        <CustomCheckbox
          desc={"By Clicking you agree to the terms and conditions"}
          checkColor="secondary.main"
          onClick={handleCheckBox}
        />
      )}
    </>
  );
};
const OthersPaymentMethod = ({ form, handleChange }) => {
  return (
    <>
      {/* <CustomSelect
        options={["Cash Transfer"]}
        placeholder="Select Transfer Type"
        state={form?.type}
        handleChange={handleChange}
        label="Type"
        name="type"
        haveTopLabel={true}
      />

      <CustomTextInput
        title="Senders Name"
        value={form?.sendersName}
        placeholder={"Senders Name"}
        name="Senders"
        handleChange={handleChange}
      />
      <CustomTextInput
        title="Status"
        value={form?.status}
        placeholder={"Status"}
        name="status"
        handleChange={handleChange}
      />
      <CustomTextInput
        title="Amount"
        value={form?.amount}
        placeholder={"Amount"}
        name="amount"
        handleChange={handleChange}
      /> */}
      <CustomTextInput
        title="Reference"
        value={form?.reference}
        placeholder={"Payment Reference"}
        name="reference"
        handleChange={handleChange}
      />
    </>
  );
};
function PaymentMethod({
  setpaymentMethod,
  paymentMethod,
  othersForm,
  setothersForm,
  hmoProvider,
  sethmoProvider,
  settermsAndConditionCheckBox,
  paymentStatus,
}) {
  const handleClicked = (method) => {
    setpaymentMethod(method);
  };
  const handleChange = (e) => {
    setothersForm({
      ...othersForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleChange1 = (e) => {
    sethmoProvider(e.target.value);
  };
  const handleCheckBox = (state) => {
    settermsAndConditionCheckBox(state);
  };
  return (
    <Stack spacing={2}>
      <Typography variant="displaySm">Payment Method</Typography>
      <Typography>
        Select a payment method to complete the transaction
      </Typography>

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={0.5}
        alignItems={"baseline"}
      >
        {methods.map((method, i) => (
          <RadioBtnWithDescription
            key={i}
            item={method}
            handleClicked={handleClicked}
            clicked={paymentMethod}
            checkColor="secondary.main"
            disabled={paymentStatus !== "PENDING"}
            headingSx={{
              fontSize: "1rem",
            }}
            descSx={{
              fontSize: "0.6rem",
            }}
            sx={{
              height: {
                xs: "68px",
                md: "fit-content",
              },
              width: {
                xs: "70%",
                md: "100%",
              },
            }}
          />
        ))}
      </Stack>
      {paymentMethod === "others" ? (
        <OthersPaymentMethod form={othersForm} handleChange={handleChange} />
      ) : (
        <HmoPaymentMethod
          hmoProvider={hmoProvider}
          handleChange={handleChange1}
          handleCheckBox={handleCheckBox}
          paymentStatus={paymentStatus}
        />
      )}
    </Stack>
  );
}

export default PaymentMethod;
