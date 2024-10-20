import { Box, Button, Grid, Stack, Typography } from "@mui/material";

import React from "react";

import CustomTextInput from "components/atoms/CustomTextInput";
import CustomButton from "components/atoms/CustomButton";
import { useFormik } from "formik";
import { handleErrorProps } from "utils/handleErrorProps";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import CustomSelect from "components/atoms/Select";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_DEPARTMENTS } from "utils/reactQueryKeys";

const validate = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = "Required";
  }
  if (!values.totalBeds) {
    errors.totalBeds = "Required";
  }
  if (!values.phoneNumber) {
    errors.phoneNumber = "Required";
  }
  if (!values.amount) {
    errors.amount = "Required";
  }

  return errors;
};
const validateEdit = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = "Required";
  }
  if (!values.totalBeds) {
    errors.totalBeds = "Required";
  }
  if (!values.phoneNumber) {
    errors.phoneNumber = "Required";
  }

  return errors;
};

const initialValues = {
  name: "",
  totalBeds: "",
  phoneNumber: "",
  department: "",
  amount: "",
};
const initialValuesEdit = {
  name: "",
  totalBeds: "",
  phoneNumber: "",
  department: "",
};

function CraeteOrEditWard({
  handleClose,
  wardDetails,
  type,
  refetchWardOverview,
}) {
  //formik state
  const { handleBlur, handleChange, values, touched, errors, setValues } =
    useFormik({
      initialValues,
      validate: (values) =>
        type === "edit" ? validateEdit(initialValuesEdit) : validate(values),
    });

  //get depts
  const { data: allDepartments } = useCustomQuery(
    GET_DEPARTMENTS,
    {
      url: `/department/get-all-departments`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const formartedData = data.data.departments.map((dept) => {
          return { name: dept.name, value: dept._id };
        });
        return formartedData;
      },
    }
  );

  //edit ward
  const { mutate: editWard, isLoading: editWardLoading } = useCustomMutation(
    {
      url: `/wards/edit-ward/${wardDetails._id}`,
      method: "patch",
      data: {
        ...values,
        headOfWard: wardDetails.headOfWard,
        totalBeds: +values.totalBeds,
      },
    },
    {
      onSuccess: () => {
        refetchWardOverview();
        toast.success("Ward edited Successfully");
        handleClose();
      },

      onError: (error) => {
        toast.error(error.message[0]);
      },
    }
  );

  //create ward
  const { mutate: createWard, isLoading: createWardLoading } =
    useCustomMutation(
      {
        url: `/wards/create-ward`,
        method: "post",
        data: { ...values, totalBeds: +values.totalBeds },
      },
      {
        onSuccess: () => {
          refetchWardOverview();
          toast.success("Success");
          handleClose();
        },

        onError: (error) => {
          toast.error(error.message[0]);
        },
      }
    );

  const handleEditWard = () => {
    if (Object.keys(errors).length) return toast.error("Fill out all fields");
    editWard();
  };
  const handleCreateWard = () => {
    if (Object.keys(errors).length) {
      toast.error("Fill out all fields");
      return;
    }
    createWard();
  };
  React.useMemo(() => {
    if (type === "edit") {
      setValues({
        name: wardDetails.name,
        totalBeds: wardDetails.totalBeds,
        phoneNumber: wardDetails.phoneNumber,
        department: wardDetails.department,
      });
    } else {
      setValues(initialValues);
    }
  }, [type, wardDetails]);

  return (
    <Grid
      container
      spacing={2}
      sx={{}}
      aria-label="ward-overview-modal-content"
    >
      <Grid item xs={1.5} sm={2}>
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
          <Typography variant="displayMd">{`${
            type === "edit" ? "Edit" : "Create New"
          } Ward`}</Typography>
        </Stack>
        <Stack
          direction="column"
          alignItems="start"
          justifyContent="start"
          spacing={1}
          sx={{ width: "100%" }}
        >
          <CustomTextInput
            title="Ward "
            value={values.name}
            name="name"
            handleChange={handleChange}
            boxSx={{ width: "100%" }}
            placeholder="Enter ward name"
            {...handleErrorProps(touched.name, errors.name)}
            onBlur={handleBlur}
          />
          <CustomSelect
            options={allDepartments}
            label="Department (optional)"
            state={values.department}
            handleChange={handleChange}
            name="department"
            haveTopLabel={true}
            placeholder="Select"
          />
          <CustomTextInput
            title="Number of Beds"
            value={values.totalBeds}
            name="totalBeds"
            handleChange={handleChange}
            boxSx={{ width: "100%" }}
            placeholder="Enter number here"
            {...handleErrorProps(touched.totalBeds, errors.totalBeds)}
            onBlur={handleBlur}
          />
          <CustomTextInput
            title="Phone Number"
            value={values.phoneNumber}
            name="phoneNumber"
            handleChange={handleChange}
            boxSx={{ width: "100%" }}
            placeholder="Enter phone number"
            {...handleErrorProps(touched.phoneNumber, errors.phoneNumber)}
            onBlur={handleBlur}
          />
          {type === "create" && (
            <CustomTextInput
              title="Cost"
              value={values.amount}
              name="amount"
              type="number"
              handleChange={handleChange}
              boxSx={{ width: "100%" }}
              placeholder="Enter amount"
              {...handleErrorProps(touched.amount, errors.amount)}
              onBlur={handleBlur}
            />
          )}
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
            disabled={type === "edit" ? editWardLoading : createWardLoading}
            onClick={type === "edit" ? handleEditWard : handleCreateWard}
          >
            {type === "edit" ? "Edit" : "Create"}
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

export default CraeteOrEditWard;
