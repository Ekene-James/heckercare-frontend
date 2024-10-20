import { Avatar, Box, Typography } from "@mui/material";

import React from "react";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

import { v4 as uuidv4 } from "uuid";
import AssesmentReport from "./AssesmentReport";
import moment from "moment";

const FromOthers = ({ item }) => {
  const isDoctor = item?.noteBy?.role?.name?.toLowerCase() === "doctor";
  return (
    <Box
      sx={{
        justifySelf: "start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "start",
        width: { xs: "100%", sm: "50%" },
        mt: 1,
        mb: 1,
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}
      >
        <Avatar
          sx={{
            bgcolor: isDoctor
              ? "rgba(105, 86, 229, 0.2)"
              : "rgba(255, 129, 96, 0.2)",
            color: isDoctor ? "rgba(105, 86, 229, 1)" : "rgba(255, 129, 96, 1)",
          }}
        >
          {isDoctor ? "D" : "N"}{" "}
        </Avatar>
        <Typography
          sx={{
            fontWeight: "bold",
            ml: 1,
            fontSize: "14px",
            textTransform: "capitalize",
          }}
        >
          {item.noteBy.fullName}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          ml: {
            xs: 0,
            sm: 5,
          },
          mt: 1,
        }}
      >
        {/* if no topic, then its not a note */}
        {!item?.topic?.length ? (
          <Box
            sx={{
              p: 2,
              width: "100%",
              backgroundColor: "secondary.main",
              color: "white",
              borderRadius: "10px",
            }}
            className="others_message"
            id={uuidv4()}
          >
            {item.note}
          </Box>
        ) : (
          <AssesmentReport item={item} />
        )}

        <MoreHorizOutlinedIcon sx={{ ml: 1 }} />
      </Box>
      <Typography sx={{ fontSize: "9px", alignSelf: "end", mr: 4 }}>
        {moment(new Date(item?.createdAt), "YYYYMMDD").fromNow()}
      </Typography>
    </Box>
  );
};
export default FromOthers;
