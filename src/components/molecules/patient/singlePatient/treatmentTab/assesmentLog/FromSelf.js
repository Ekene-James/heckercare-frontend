import { Avatar, Box, Typography } from "@mui/material";

import React from "react";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

import { v4 as uuidv4 } from "uuid";

import AssesmentReport from "./AssesmentReport";
import moment from "moment";

const FromSelf = ({ item }) => {
  const isDoctor = item?.noteBy?.role?.name?.toLowerCase() === "doctor";
  return (
    <Box
      sx={{
        alignSelf: "end",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "end",
        width: { xs: "100%", sm: "50%" },
        mt: 1,
        mb: 1,
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "end", alignItems: "center" }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: "14px", mr: 1 }}>
          {item.noteBy.fullName}
        </Typography>
        <Avatar
          sx={{
            bgcolor: isDoctor
              ? "rgba(105, 86, 229, 0.2)"
              : "rgba(255, 129, 96, 0.2)",
            color: isDoctor ? "rgba(105, 86, 229, 1)" : "rgba(255, 129, 96, 1)",
          }}
        >
          {" "}
          {isDoctor ? "D" : "N"}{" "}
        </Avatar>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          mr: {
            xs: 0,
            sm: 5,
          },
          mt: 1,
        }}
      >
        <MoreHorizOutlinedIcon sx={{ mr: 1 }} />
        {/* if no topic, then its not a note */}
        {!item?.topic?.length ? (
          <Box
            sx={{
              p: 2,
              width: "100%",
              backgroundColor: "rgba(105, 86, 229, 0.05)",
              borderRadius: "10px",
            }}
            className="self_message"
            id={uuidv4()}
          >
            {item.note}
          </Box>
        ) : (
          <AssesmentReport item={item} />
        )}
      </Box>
      <Typography sx={{ fontSize: "9px", alignSelf: "end", mr: 4 }}>
        {moment(new Date(item.createdAt), "YYYYMMDD").fromNow()}
      </Typography>
    </Box>
  );
};
export default FromSelf;
