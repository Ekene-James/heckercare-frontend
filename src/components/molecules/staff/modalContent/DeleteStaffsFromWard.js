import { Button, Stack, Typography } from "@mui/material";

import React from "react";

const DeleteStaffsFromWard = ({
  msg,
  handleClose,
  handleDelete,
  deleteBtnLoading,
}) => {
  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      spacing={1}
      aria-label="delete-dept-modal"
      sx={{ width: "100%", p: 1 }}
    >
      <Typography variant="displaySm" sx={{}}>
        {`Are you sure you want to delete ${msg} ?`}
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{ mt: 2 }}
      >
        <Button
          variant="outline"
          onClick={handleClose}
          sx={{ fontWeight: "bold" }}
        >
          No, Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          sx={{ fontWeight: "bold" }}
          disabled={deleteBtnLoading}
        >
          Yes, Delete
        </Button>
      </Stack>
    </Stack>
  );
};

export default DeleteStaffsFromWard;
