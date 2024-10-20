import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function BackButton({ showText = true, size = "30px" }) {
  const navigate = useNavigate();
  return (
    <Button
      variant="text"
      startIcon={<ArrowBackIcon sx={{ fontSize: `${size}!important` }} />}
      onClick={() => navigate(-1)}
    >
      {showText && "Back"}
    </Button>
  );
}

export default BackButton;
