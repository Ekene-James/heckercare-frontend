import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

import CustomTextInput from "components/atoms/CustomTextInput";
import CustomButton from "components/atoms/CustomButton";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomSelect from "components/atoms/Select";
import { GET_STAFFS } from "utils/reactQueryKeys";

const GetUnits = ({ value, handleChange }) => {
  //get units of a dept
  const { data: staffs } = useCustomQuery(
    GET_STAFFS,
    {
      url: `/user/get-all-staff`,
      method: "post",
      data: {
        limit: 1000,
      },
    },
    {
      refetchOnWindowFocus: false,

      select: (data) => {
        const formartedData = data.data.data.map((staf) => {
          return { name: staf.fullName, value: staf._id };
        });
        return formartedData;
      },
    }
  );

  return (
    <CustomSelect
      options={staffs}
      label="Head of Department"
      state={value}
      handleChange={handleChange}
      name="headOfDept"
      haveTopLabel={true}
      placeholder="Select"
    />
  );
};

function CreateDeptModalContent({ handleClose }) {
  const [formState, setformState] = React.useState({
    name: "",
    headOfDept: "",
  });

  const queryObj = {
    onSuccess: (response) => {
      toast.success("Department Created Successfully");
      handleClose(true);
    },

    onError: (error) => toast.error(error.message),
  };

  const { mutate: createNewDept, isLoading } = useCustomMutation(
    {
      url: `/department/add-department`,
      method: "post",
      data: formState,
    },
    queryObj
  );

  const handleChange = (e) =>
    setformState({
      ...formState,
      [e.target.name]: e.target.value,
    });

  return (
    <Grid container spacing={2} sx={{}}>
      <Grid item xs={1.5}>
        <Box
          sx={{
            height: "100px",
            width: "100px",
            borderRadius: "50%",
            p: 3,
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0px 4px 35px rgba(0, 0, 0, 0.15)",
          }}
        >
          <img
            alt="folder_icon"
            src="/imgs/Note.png"
            height="50px"
            width="50px"
          />
        </Box>
      </Grid>
      <Grid item xs={11} sm={9}>
        <Stack
          direction="column"
          alignItems="start"
          justifyContent="start"
          spacing={1}
          sx={{ width: "100%" }}
        >
          <Typography variant="displayMd">Create New Department</Typography>
        </Stack>
        <Stack
          direction="column"
          alignItems="start"
          justifyContent="start"
          spacing={1}
          sx={{ width: "100%" }}
        >
          <CustomTextInput
            title="Department "
            value={formState.name}
            name="name"
            handleChange={handleChange}
            boxSx={{ width: "100%" }}
            placeholder="Enter Dept name"
          />
          <GetUnits value={formState.headOfDept} handleChange={handleChange} />
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="start"
          spacing={1}
          sx={{ mt: 2, width: "100%" }}
        >
          <Button
            variant="contained"
            color="secondary"
            sx={{}}
            onClick={createNewDept}
            disabled={isLoading}
          >
            Create
          </Button>
          <CustomButton
            variant="containedBrown"
            onClick={handleClose}
            text="Cancel"
          />
        </Stack>
      </Grid>
    </Grid>
  );
}

export default CreateDeptModalContent;
