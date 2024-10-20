import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import CustomButton from "components/atoms/CustomButton";
import { useNavigate } from "react-router-dom";

function StockMgtCard({ item: { title, desc, slug } }) {
  const navigate = useNavigate();
  return (
    <Stack
      direction={"column"}
      spacing={2}
      sx={{
        p: 2,
        pb: 5,
        boxShadow: "0px 4px 33px rgba(0, 0, 0, 0.06)",
        cursor: "pointer",
      }}
      aria-label="stock-mgt-card"
    >
      <Stack direction={"column"} spacing={1}>
        <Stack
          sx={{
            backgroundColor: "background.gray3",

            width: "72px",
            height: "64px",
            borderRadius: "4px",
          }}
          alignItems="center"
          justifyContent={"center"}
        >
          <ScienceOutlinedIcon sx={{ fontSize: "2rem" }} />
        </Stack>
        <Typography variant="heading" sx={{}}>
          {title}
        </Typography>
      </Stack>
      <Typography sx={{ opacity: 0.5 }}>{desc}</Typography>

      <Stack
        direction={"row"}
        justifyContent="space-between"
        sx={{ width: "100%" }}
      >
        {/* <CustomButton text={"Usage History"} variant="outlined" /> */}
        <CustomButton
          text={"View Stock"}
          disabled={slug === "Laboratory"}
          variant="contained"
          color="secondary"
          onClick={() => navigate(`/home/inventory/departments/${slug}`)}
        />
      </Stack>
    </Stack>
  );
}

export default StockMgtCard;
