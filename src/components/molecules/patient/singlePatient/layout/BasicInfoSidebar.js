import { Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
const data = [
  {
    to: "summary",
    text: "Summary",
  },
  {
    to: "personalDetails",
    text: "Personal Details",
  },
  {
    to: "residentialAddress",
    text: "Residential Address",
  },
  {
    to: "permanentAddress",
    text: "Permanent Address",
  },
  {
    to: "nextOfKin",
    text: "Next Of Kin",
  },
  {
    to: "payerDetails",
    text: `Payer's Details`,
  },
];
function BasicInfoSidebar() {
  const [clicked, setclicked] = useState("summary");
  const handleClick = (id) => {
    const element = document.getElementById(id);

    if (element) element.scrollIntoView({ behavior: "smooth" });

    setclicked(id);
  };
  return (
    <Paper
      sx={{
        height: "auto",
        pt: 3,
        pb: 3,
        pl: 1,
        pr: 1,
        display: "flex",
        justifyContent: {
          xs: "center",
          sm: "space-between",
          lg: "center",
        },
        alignItems: "center",
        flexDirection: {
          xs: "column",
          sm: "row",
          lg: "column",
        },
      }}
    >
      {data.map((item, i) => (
        <Typography
          key={i}
          sx={{
            fontWeight: clicked === item.to ? "bold" : null,
            fontSize: "0.938rem",
            mt: 2,
            cursor: "pointer",
          }}
          variant="h6"
          onClick={() => handleClick(item.to)}
        >
          {" "}
          {item.text}
        </Typography>
      ))}
    </Paper>
  );
}

export default BasicInfoSidebar;
