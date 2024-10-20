import { Grid, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";

import RadioBtnWithDescription from "components/atoms/RadioBtnWithDescription";

import React from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import { currencyFormatter } from "utils/numberFormatter";

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

const Detail = ({ title, children }) => {
  return (
    <Stack spacing={2}>
      <Typography sx={{ fontWeight: "bold" }}>{title}</Typography>
      {children}
    </Stack>
  );
};
function PaymentMethod({ paymentMethod, paymentDetails }) {
  return (
    <Stack spacing={2}>
      <Typography variant="displaySm">Payment Method</Typography>

      <Stack>
        {methods.map((method, i) =>
          paymentMethod === method.value ? (
            <RadioBtnWithDescription
              key={i}
              item={method}
              clicked={paymentMethod}
              checkColor="secondary.main"
              imgSx={{ marginLeft: "10px" }}
              headingSx={{
                fontSize: "1rem",
              }}
              descSx={{
                fontSize: "0.6rem",
              }}
              sx={{
                height: {
                  xs: "68px",
                  // md: "50px",
                },
                opacity: 0.5,
                pointerEvents: "none",
                justifyContent: "flex-start",
              }}
            />
          ) : null
        )}
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Detail title={"Type"}>
            <Typography variant="caption">{"cash Payment"}</Typography>
          </Detail>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Detail title={"Senders Name"}>
            <Typography variant="caption">{"stephen Blessing"}</Typography>
          </Detail>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Detail title={"Status"}>
            <CustomButton
              variant="outlined"
              startIcon={<RemoveIcon sx={{ fontSize: "15px" }} />}
              color="warning"
              text="Processing"
              sx={{
                pointerEvents: "none",
                width: "fit-content",
              }}
            />
          </Detail>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Detail title={"Amount"}>
            <Typography variant="displaySm">
              {" "}
              {currencyFormatter(70000)}
            </Typography>
          </Detail>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default PaymentMethod;
