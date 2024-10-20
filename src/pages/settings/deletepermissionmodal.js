import { Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomCheckbox from "components/atoms/CustomCheckbox";
import React from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { GET_ROLES_FOR_USERS } from "utils/reactQueryKeys";

export const DeletePermissionModal = ({ data, toggleModal }) => {
  const queryClient = useQueryClient();
  // delete role
  const { mutate: deleteRole, isLoading: deleteRoleLoading } =
    useCustomMutation(
      {
        url: `/role/${data._id}`,
        method: "delete",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_ROLES_FOR_USERS]);
          toast.success("Success");
          toggleModal();
        },

        onError: (error) => {
          if (Array.isArray(error.message)) {
            return error.message.map((msg) => toast.error(msg));
          }

          return toast.error(error.message);
        },
      }
    );
  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "start",
        flexDirection: "column",
        width: "100%",
        gap: 2,
      }}
    >
      <Typography>
        <h2>Delete this Role?</h2>
      </Typography>
      <Typography>
        Deleting this role will render it unavailable for users and permanently
        remove it from the system. This action cannot be undone.
      </Typography>
      <CustomCheckbox checkColor="#5545BB" desc="Dont show again" />
      <CustomButton
        variant="contained"
        color="error"
        text="Ok, Continue"
        onClick={deleteRole}
        disabled={deleteRoleLoading}
      />
    </Stack>
  );
};
