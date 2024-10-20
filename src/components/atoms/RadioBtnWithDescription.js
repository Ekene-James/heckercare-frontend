import { Box, Paper, Stack, Typography } from "@mui/material";
import React from "react";

import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

function RadioBtnWithDescription({
  clicked,
  handleClicked,
  item,
  sx = {},
  headingSx = {},
  descSx = {},
  checkColor = "primary.main",
  imgSx = {},
  disabled = false,
}) {
  return (
    <Paper
      sx={{
        m: 1,
        mt: 2,
        mb: 3,
        p: 2,
        border: "1px solid rgba(105, 86, 229, 0.1)",
        borderRadius: "6px",
        cursor: "pointer",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        pointerEvents: disabled ? "none" : "cursor",

        overflowY: {
          md: "auto",
          xl: "hidden",
        },
        width: {
          xs: "100%",
          xl: "50%",
        },
        minWidth: "165px",

        height: {
          xs: "120px",
          xl: "100px",
        },
        opacity: disabled ? 0.5 : 1,
        backgroundColor: clicked === item.value ? "background.lightBlue" : null,
        ...sx,
      }}
      onClick={() => handleClicked(item.value)}
    >
      {clicked === item.value ? (
        <RadioButtonCheckedIcon sx={{ color: checkColor }} />
      ) : (
        <RadioButtonUncheckedIcon />
      )}
      <Stack direction={"row"} spacing={1} alignItems={"center"}>
        {item.descImg ? (
          <img
            alt="desc_img"
            src={item.descImg}
            width={30}
            height={30}
            style={{ borderRadius: "50%", ...imgSx }}
          />
        ) : null}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "column",
            ml: 2,
          }}
        >
          <Typography
            variant="heading"
            sx={{
              // wordBreak: "break-word",
              ...headingSx,
            }}
          >
            {item.header}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              // wordBreak: "break-word"
              ...descSx,
            }}
          >
            {item.desc}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default RadioBtnWithDescription;
