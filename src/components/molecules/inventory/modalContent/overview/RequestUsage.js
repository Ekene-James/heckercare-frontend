import { Box, Grid, Paper, Stack, Typography } from "@mui/material";

import React from "react";

import UsageHistoryModalTable from "components/molecules/tabels/inventory/UsageHistoryModalTable";
import RequestListModalTable from "components/molecules/tabels/inventory/RequestListModalTable";
function RequestUsage({
  requestDetails: { title, quantity, department, category, location, module },
}) {
  return (
    <Box aria-label="request-list-modal-child">
      <Typography variant="displayMd">Request List</Typography>
      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={11}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <Stack direction={"row"} spacing={2}>
                <Typography sx={{ fontWeight: "bold" }}>Item:</Typography>
                <Typography sx={{ opacity: 0.5 }}>{title}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction={"row"} spacing={2}>
                <Typography sx={{ fontWeight: "bold" }}>Department:</Typography>
                <Typography sx={{ opacity: 0.5 }}>{department}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction={"row"} spacing={2}>
                <Typography sx={{ fontWeight: "bold" }}>
                  Available Quantity:{" "}
                </Typography>
                <Typography sx={{ opacity: 0.5 }}>{quantity}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction={"row"} spacing={2}>
                <Typography sx={{ fontWeight: "bold" }}>Category: </Typography>
                <Typography sx={{ opacity: 0.5 }}>{category}</Typography>{" "}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction={"row"} spacing={2}>
                <Typography sx={{ fontWeight: "bold" }}>Module: </Typography>
                <Typography sx={{ opacity: 0.5 }}>{module}</Typography>{" "}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction={"row"} spacing={2}>
                <Typography sx={{ fontWeight: "bold" }}>Location: </Typography>
                <Typography sx={{ opacity: 0.5 }}>{location}</Typography>{" "}
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Stack
          direction="column"
          spacing={2}
          justifyContent="flex-start"
          alignItems={"flex-start"}
        >
          <RequestListModalTable />
        </Stack>
      </Paper>
    </Box>
  );
}

export default RequestUsage;
