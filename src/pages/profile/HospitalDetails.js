import { Divider, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useAuthCtx } from "store/contextStore/auth/AuthStore";
import moment from "moment";

function HospitalDetails({ toggleModal, hospitalDetails }) {
  const { state } = useAuthCtx();
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Stack
          direction={"row"}
          width={"100%"}
          justifyContent={
            state.user.role === "admin" ? "space-between" : "flex-start"
          }
          alignItems={"center"}
        >
          <Typography variant="heading">Hospital Details</Typography>
          {state.user.role === "admin" && (
            <IconButton onClick={toggleModal}>
              <BorderColorIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
        <Divider width="100%" light />
      </Stack>
      <img
        alt="upload_img"
        src={hospitalDetails?.picture || "/imgs/productImg.png"}
        style={{ width: "100%", height: "201px", objectFit: "contain" }}
      />
      <Stack spacing={1.5}>
        {/* hospital Name */}
        <Typography variant="heading">
          {hospitalDetails?.name || "No Name found"}
        </Typography>
        <Typography>
          {hospitalDetails?.address || "No Address found"}
        </Typography>
      </Stack>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Stack
            direction={"row"}
            spacing={1}
            width={"100%"}
            alignItems={"center"}
          >
            <FilterListIcon />
            <Typography variant="heading">Working Hours</Typography>
          </Stack>
          <Divider width="100%" light />
        </Stack>

        <Stack spacing={0.7}>
          <Typography sx={{ fontWeight: "bold" }}>Monday to Friday</Typography>
          <Typography>
            {moment(new Date(hospitalDetails?.weekDayOpeningHours)).format(
              "hh:mm a"
            ) || "No start time found"}{" "}
            to{" "}
            {moment(new Date(hospitalDetails?.weekDayClosingHours)).format(
              "hh:mm a"
            ) || "No end time found"}
          </Typography>
        </Stack>
        <Stack spacing={0.7}>
          <Typography sx={{ fontWeight: "bold" }}>
            Weekends & Holidays
          </Typography>
          <Typography>
            {moment(new Date(hospitalDetails?.weekendOpeningHours)).format(
              "hh:mm a"
            ) || "No start time found"}{" "}
            to{" "}
            {moment(new Date(hospitalDetails?.weekendClosingHours)).format(
              "hh:mm a"
            ) || "No end time found"}
          </Typography>
        </Stack>
      </Stack>

      {/* contact info */}
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Stack
            direction={"row"}
            spacing={1}
            width={"100%"}
            alignItems={"center"}
          >
            <FilterListIcon />
            <Typography variant="heading">Contact Information</Typography>
          </Stack>
          <Divider width="100%" light />
        </Stack>

        <Stack spacing={0.7}>
          <Typography sx={{ fontWeight: "bold" }}>Email Address</Typography>
          <Typography>
            {" "}
            {hospitalDetails?.email || "No email address found"}
          </Typography>
        </Stack>
        <Stack spacing={0.7}>
          <Typography sx={{ fontWeight: "bold" }}>Phone Number</Typography>
          <Typography>
            {" "}
            {hospitalDetails?.phone || "No phone number found"}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default HospitalDetails;
