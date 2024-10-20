import { Box, Grid, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomCheckbox from "components/atoms/CustomCheckbox";
import CustomTextInput from "components/atoms/CustomTextInput";
import React from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { groupBy } from "utils/groupByFunc";
import { hasDashboard } from "utils/hasDashboard";
import { permissions as permissionsData } from "utils/permissionsData";
import { GET_ROLES_FOR_USERS } from "utils/reactQueryKeys";
import { slugify } from "utils/slugify";

export const EditPermissionModal = ({ toggleModal, data }) => {
  const queryClient = useQueryClient();
  const [permissions, setpermissions] = React.useState(data?.permissions);
  const modules = groupBy(permissionsData, "module");
  const [name, setname] = React.useState(data?.name);

  const handleCheck = (state, item) => {
    //if checked
    if (state) {
      setpermissions((prev) => [
        ...prev,
        {
          url: item.url,
          module: item.module,
        },
      ]);
    } else {
      setpermissions((prev) => {
        const newPermissions = prev.filter((perm) => perm.url !== item.url);
        return newPermissions;
      });
    }
  };
  const handleSelectAll = (state) => {
    //if checked
    if (state) {
      const removeNameKey = permissionsData.map((permi) => ({
        url: permi.url,
        module: permi.module,
      }));
      setpermissions(removeNameKey);
    } else {
      setpermissions([]);
    }
  };

  // edit role
  const { mutate: editRole, isLoading: editRoleLoading } = useCustomMutation(
    {
      url: `/role/permission/${data._id}`,
      method: "patch",
      data: {
        name: slugify(name),
        permissions: permissions.map((permission) => ({
          url: permission.url,
          module: permission.module,
        })),
      },
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
  const handleEditRole = () => {
    if (!name) return toast.error("Please input a role name");
    editRole();
  };

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
      <Box>
        <h2>Edit New Role?</h2>
        <Typography>
          Add a new space to the system for which users can book
        </Typography>
      </Box>

      <Stack
        sx={{
          width: "100%",
          gap: 2,
        }}
      >
        <CustomTextInput
          title="Role"
          fullWidth={true}
          placeholder="Enter name of role"
          value={name}
          name={"name"}
          handleChange={(e) => setname(e.target.value)}
          readOnly={hasDashboard(name)}
        />

        <Stack sx={{ gap: 4 }}>
          <Stack
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography>
              Permissions({permissions.length}/{permissionsData.length})
            </Typography>
            <CustomCheckbox
              checkColor="#5545BB"
              desc="Select all"
              onClick={handleSelectAll}
            />
          </Stack>
          {Object.keys(modules).map((mod) =>
            mod ? (
              <Grid key={mod}>
                <Typography>{mod}</Typography>
                {modules[mod].map((urlObj) => (
                  <CustomCheckbox
                    key={urlObj.url}
                    autoCheck={permissions.some(
                      (perm) => perm.url === urlObj.url
                    )}
                    checkColor="#5545BB"
                    desc={urlObj.name}
                    item={urlObj}
                    onClick={handleCheck}
                  />
                ))}
              </Grid>
            ) : null
          )}
        </Stack>
      </Stack>

      <Box
        sx={{
          gap: 2,
        }}
      >
        <CustomButton
          variant="contained"
          color="secondary"
          text="Save"
          onClick={handleEditRole}
          disabled={editRoleLoading}
        />
        <CustomButton variant="secondary" text="Cancel" onClick={toggleModal} />
      </Box>
    </Stack>
  );
};
