import { Stack, Typography } from "@mui/material";
import CustomDotMenu from "components/atoms/CustomDotMenu";
import React from "react";

function TextWithMenu({ text }) {
  return (
    <Stack
      direction={"row"}
      spacing={3}
      justifyContent="center"
      alignItems={"center"}
      sx={{
        p: 1,
        pb: 1.5,
        pt: 1.5,
        border: "0.5px solid rgba(0,0,0,0.2)",
        borderRadius: "2px",
      }}
    >
      <Typography>{text}</Typography>
      {/* <CustomDotMenu
        items={[
          {
            caption: "Do Something",
            action: () => {},
          },
          {
            caption: "Do another Something",
            action: () => {},
          },
        ]}
      /> */}
    </Stack>
  );
}

export default TextWithMenu;
