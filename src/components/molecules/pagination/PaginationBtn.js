import React from "react";
import { Box } from "@mui/material";

function PaginationBtn({
  disabled = false,
  content,
  onClick = () => {},
  active,
  activeColor="background.black"
}) {
  // const [active, setactive] = React.useState(defaultActive);
  const handleClick = () => {
    onClick();
  };

  return (
    <Box
      sx={{
        backgroundColor:
          typeof content === "number" || typeof content === "string"
            ? disabled
              ? "background.light"
              : active
              ? activeColor
              : "background.lightest"
            : "",
        pointerEvents: disabled ? "none" : "auto",
        color: disabled
          ? "background.black"
          : active
          ? "background.light"
          : typeof content === "number" || typeof content === "string"
          ? "background.gray4"
          : "background.black",
        padding: "4px 10px",
        m: { xs: 0, sm: 0.5 },
        border:
          typeof content === "number" || typeof content === "string"
            ? "1px solid #BCBCBC"
            : "",
        borderRadius: "5px",
        cursor: "pointer",
        opacity: disabled ? 0.6 : 1,
        fontSize: { xs: "9px", sm: "13px" },
      }}
      onClick={handleClick}
    >
      {content}
    </Box>
  );
}

export default PaginationBtn;
