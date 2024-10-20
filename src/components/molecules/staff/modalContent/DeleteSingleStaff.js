import { Button, Stack, Typography } from "@mui/material";

import React from "react";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";

const DeleteSingleStaff = ({
  msg,
  handleClose,
  id,
  lists,
  refetch,
  wardId,
}) => {
  const returnStaffIds = () => {
    const arr = lists.filter((l) => l._id !== id);
    const onlyIds = arr.map((staff) => staff._id);
    return onlyIds;
  };

  //delete staff

  const { mutate: handleDeleteStaffs, isLoading: deleteStaffLoading } =
    useCustomMutation(
      {
        url: `/wards/edit-ward/${wardId}`,
        method: "patch",
        data: {
          staff: [...returnStaffIds()],
        },
      },
      {
        onSuccess: () => {
          refetch();
          toast.success("Staff Deleted Successfully");
          handleClose();
        },

        onError: (error) => toast.error(error.message),
      }
    );

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
          onClick={handleDeleteStaffs}
          variant="contained"
          color="error"
          sx={{ fontWeight: "bold" }}
          disabled={deleteStaffLoading}
        >
          Yes, Delete
        </Button>
      </Stack>
    </Stack>
  );
};

export default DeleteSingleStaff;
