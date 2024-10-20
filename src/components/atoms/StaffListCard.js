import { Paper, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function StaffListCard({ item }) {
  const navigate = useNavigate();
  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        p: 2,
        pb: 5,
        boxShadow: "0px 4px 33px rgba(0, 0, 0, 0.06)",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/home/staff/${item?._id}`)}
    >
      <img
        src={item?.profilePicture || "/imgs/blank-profile-picture.png"}
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          objectFit: "cover",
          objectPosition: "center",
        }}
        alt="profile_px"
      />
      <Typography>{`${item?.lastName} ${item?.firstName} ${
        item?.middleName || ""
      }`}</Typography>
      <Typography
        variant="caption"
        sx={{
          color: "primary.lightGrey",
          textTransform: "capitalize !important",
        }}
      >
        {item?.role?.name || "NO DESIGNATION"}
      </Typography>
    </Paper>
  );
}

export default StaffListCard;
