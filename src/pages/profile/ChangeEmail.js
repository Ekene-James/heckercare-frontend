import React from "react";
import { Box, Button, Chip, Grid, Stack, Typography } from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CustomTextInput from "components/atoms/CustomTextInput";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import { useAuthCtx } from "store/contextStore/auth/AuthStore";
function ChangeEmail({ setscreen }) {
  const { state: authState } = useAuthCtx();
  const [state, setstate] = React.useState({});
  React.useMemo(
    () =>
      setstate((prev) => ({
        ...prev,
        oldEmail: authState.user.email,
      })),
    []
  );
  const handleChange = (e) => {
    setstate({
      [e.target.name]: e.target.value,
    });
  };
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContents: "space-between",
          ml: "-15px",
        }}
      >
        <Button onClick={() => setscreen(0)} variant="text" sx={{ p: 0.5 }}>
          <KeyboardBackspaceOutlinedIcon
            sx={{
              fontWeight: 800,
              fontSize: "28px",
            }}
          />{" "}
        </Button>
        <Typography variant="displaySm"> Change Email</Typography>
      </Box>
      <Grid container spacing={1} sx={{ pl: { xs: 0, sm: 6 } }}>
        <Grid item xs={12} sm={9}>
          <Grid item xs={12} sx={{ mt: 5 }}>
            <CustomTextInput
              value={state.oldEmail}
              name="oldEmail"
              handleChange={handleChange}
              placeholder="Enter old Email"
              title="Old Email"
              type="email"
              boxSx={{ mt: 3 }}
            />
          </Grid>
          <Grid item xs={12} sx={{}}>
            <CustomTextInput
              value={state.newEmail}
              name="newEmail"
              handleChange={handleChange}
              placeholder="Enter New Email"
              title="New Email"
              type="email"
              boxSx={{ mt: 3 }}
            />
          </Grid>

          <Box sx={{ alignSelf: "start", mt: 2 }}>
            <Button variant="contained" sx={{ width: "163px" }} color="success">
              Confirm
            </Button>
            <Button variant="outlined" sx={{ ml: 1 }}>
              Cancel
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChangeEmail;
