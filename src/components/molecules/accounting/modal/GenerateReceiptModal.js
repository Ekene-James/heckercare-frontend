import { Stack, Typography } from "@mui/material";
import React from "react";
import DoneIcon from "@mui/icons-material/Done";
import { Link } from "react-router-dom";
import CustomButton from "components/atoms/CustomButton";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";

const DescText = ({ first, second }) => {
  return (
    <Stack
      direction="row"
      justifyContent={"space-between"}
      sx={{
        width: "100%",
      }}
      spacing={1}
    >
      <Typography variant="caption">{first}</Typography>
      <Typography sx={{ fontWeight: "bold" }} variant="heading">
        {second}
      </Typography>
    </Stack>
  );
};

function GenerateReceiptModal({ toggleModal }) {
  return (
    <Stack
      direction={"column"}
      spacing={2}
      justifyContent="center"
      alignItems={"center"}
      sx={{ width: "100%", p: 5, pt: 2 }}
    >
      <Typography variant="displayMd">Receipt</Typography>

      <Stack
        direction={"column"}
        spacing={1}
        justifyContent="center"
        alignItems={"center"}
        sx={{
          width: "100%",
          border: "1px dashed black",
          borderRadius: "5px",
          backgroundColor: "rgba(248, 100, 100, 0.03)",
          p: 2,
        }}
      >
        <Typography variant="heading" sx={{ opacity: 0.5 }}>
          Billing Details
        </Typography>
        <Typography variant="displayLg">₦7550:00</Typography>
        <Typography variant="small" sx={{ opacity: 0.5 }}>
          Payment made July 27, 2022
        </Typography>

        <DescText
          first="Payment Status"
          second={
            <Stack
              direction={"row"}
              sx={{ color: "green" }}
              alignItems="center"
              spacing={1}
            >
              <DoneIcon sx={{ fontSize: "15px" }} />
              <Typography sx={{ fontWeight: "bold" }}>Paid</Typography>
            </Stack>
          }
        />
        <DescText first="Payback Amount" second="₦6500:00" />
        <DescText first="Service Fee" second="₦500:00" />
        <DescText first="Tax" second="₦100:00" />
        <Stack
          direction="row"
          justifyContent={"space-between"}
          alignItems="center"
          sx={{
            width: "100%",
          }}
          spacing={1}
        >
          <Link to="">View Payment Plan</Link>
          <CustomButton
            text="Download Receipt"
            variant="outlined"
            sx={{ border: "1px solid black", color: "primary.main" }}
            startIcon={<LocalPrintshopIcon />}
          />
        </Stack>
      </Stack>

      <Stack
        direction="row"
        justifyContent={"center"}
        alignItems="center"
        spacing={1}
      >
        <CustomButton text="Send Receipt" color="secondary" />

        <CustomButton
          text="Close"
          variant="outlined"
          sx={{ border: "1px solid black", color: "primary.main" }}
          onClick={toggleModal}
        />
      </Stack>
    </Stack>
  );
}

export default GenerateReceiptModal;
