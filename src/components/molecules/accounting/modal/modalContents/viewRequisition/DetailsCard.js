import { Stack, Typography } from "@mui/material";
import React from "react";

function DetailsCard({ title, details }) {
  return (
    <Stack
      p={2}
      backgroundColor="background.custom"
      width={"100%"}
      spacing={1.5}
    >
      <Typography variant="heading">{title}</Typography>
      {details.map((detail) => (
        <Stack key={detail.item} spacing={2} direction="row">
          <Typography opacity={0.5}>{detail.item}</Typography>
          <Typography fontWeight={"bold"}>{detail.itemDetail}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default DetailsCard;
