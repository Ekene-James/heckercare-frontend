import React from "react";
import { Box, Button, Chip, Grid, Stack, Typography } from "@mui/material";

import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CustomTextInput from "components/atoms/CustomTextInput";
import { useFormik } from "formik";
import { handleErrorProps } from "utils/handleErrorProps";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { useAuthCtx } from "store/contextStore/auth/AuthStore";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_DESIGNATION, GET_STAFF } from "utils/reactQueryKeys";
import ImageUpload from "components/atoms/ImageUpload";
import { useQueryClient } from "react-query";

const initialValues = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  role: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const validate = (values) => {
  const errors = {};

  if (!values.currentPassword) {
    errors.currentPassword = "Required";
  }

  if (!values.newPassword) {
    errors.newPassword = "Required";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Required";
  } else if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = "Password mismatch";
  }

  return errors;
};

function ProfileDetails() {
  const { state } = useAuthCtx();
  const {
    handleBlur,
    handleChange,
    values,
    touched,
    errors,
    setValues,
    setFieldTouched,
  } = useFormik({
    initialValues,
    validate: (values) => validate(values),
    enableReinitialize: true,
  });
  const queryClient = useQueryClient();
  React.useEffect(() => {
    setValues({
      firstName: state.user.firstName,
      lastName: state.user.lastName,
      phoneNumber: state.user.phoneNumber,
      email: state.user.email,
      role: state.user?.roleObj?.name,
      // role: state.user?.role?.name ? state.user?.role?.name : state.user?.roleObj?.name,
      // profilePicture: state.user.profilePicture,
    });
  }, [state.user, setValues]);

  const queryObj = {
    onSuccess: (response) => toast.success("Password Changed Successfully"),

    onError: (error) => toast.error(error.message),
  };

  //get single staff
  const { data: userData } = useCustomQuery(
    [GET_STAFF, state?.user?._id],
    {
      url: `/user/get-single-staff/${state?.user?._id}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!state?.user?.designation,
    }
  );

  //get designation
  // const { data: designation } = useCustomQuery(
  //   [GET_DESIGNATION],
  //   {
  //     url: `/designation/${state?.user?.designation}`,
  //     method: "get",
  //   },
  //   {
  //     refetchOnWindowFocus: false,
  //     onSuccess: (res) => {
  //       setValues((prev) => ({ ...prev, role: res.data.name }));
  //     },
  //     enabled: !!state?.user?.designation,
  //   }
  // );

  const { mutate: changePassword, isLoading: changePasswordLoading } =
    useCustomMutation(
      {
        url: `/user/change-password`,
        method: "patch",
        data: {
          oldPassword: values.currentPassword,
          password: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
      },
      queryObj
    );

  //change profile pix
  const { mutate: changeProfilePix, isLoading: changeProfilePixLoading } =
    useCustomMutation(
      {
        url: `/user/update-staff/${state.user._id}`,
        method: "patch",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_STAFF, state?.user?._id]);
          toast.success("Profile picture uploaded successfully");
        },
        onError: (error) => {
          if (Array.isArray(error.message)) {
            return error.message.map((msg) => toast.error(msg));
          }

          return toast.error(error.message);
        },
      }
    );

  const handleChangePassword = () => {
    if (Object.keys(errors).length) {
      return Object.keys(errors).forEach((field) =>
        setFieldTouched(field, true, true)
      );
    }
    changePassword();
  };
  const handleAddImg = (files) => {
    const formData = new FormData();
    formData.append("filename", files[0]);
    changeProfilePix(formData);
  };

  return (
    <>
      {/* <Box sx={{ alignSelf: "end", mb: 2 }}>
        <Button variant="outlined" sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button variant="contained">Save Changes</Button>
      </Box> */}
      <Grid container spacing={1}>
        <Grid item xs={12} sm={3}>
          <ImageUpload
            onAddImg={handleAddImg}
            disabled={changeProfilePixLoading}
            blanckImg={userData?.data?.profilePicture}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          <Typography variant="subhead" color="primary.lightGrey">
            Basic Information
          </Typography>
          <Grid container sx={{ mt: 3 }} spacing={1}>
            <Grid item xs={12} sm={6}>
              <CustomTextInput
                value={values.firstName}
                name="firstName"
                handleChange={handleChange}
                placeholder="Enter First Name"
                title="First Name"
                readOnly
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextInput
                value={values.lastName}
                name="lastName"
                handleChange={handleChange}
                placeholder="Enter Last Name"
                title="Last Name"
                readOnly
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextInput
                value={values.phoneNumber}
                name="phoneNumber"
                handleChange={handleChange}
                placeholder="Enter Phone Number"
                title="Phone Number"
                readOnly
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextInput
                value={values.email}
                name="email"
                type="email"
                handleChange={handleChange}
                placeholder="Enter Email"
                title="Email Address"
                readOnly
              />
            </Grid>
            {/* <Stack
              direction="row"
              justifyContent="end"
              alignItems="center"
              spacing={1}
              sx={{ width: "100%", mt: 1 }}
            >
              <Chip
                label="Change Email"
                variant="outlined"
                onClick={() => setscreen(1)}
              />
            </Stack> */}
          </Grid>
          <Grid item xs={12} sx={{ mt: 5 }}>
            <Typography variant="subhead" color="primary.lightGrey">
              Speciality/Designation
            </Typography>
            <CustomTextInput
              value={values.role}
              name="role"
              handleChange={handleChange}
              placeholder="Enter Role"
              title="Role"
              boxSx={{ mt: 3 }}
              readOnly
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 5 }}>
            <Typography variant="subhead" color="primary.lightGrey">
              Change Password
            </Typography>
            <CustomTextInput
              value={values.currentPassword}
              name="currentPassword"
              handleChange={handleChange}
              placeholder="Enter Current Password"
              title="Current Password"
              type="password"
              boxSx={{ mt: 3 }}
              {...handleErrorProps(
                touched.currentPassword,
                errors.currentPassword
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sx={{}}>
            <CustomTextInput
              value={values.newPassword}
              name="newPassword"
              handleChange={handleChange}
              placeholder="Enter New Password"
              title="New Password"
              type="password"
              boxSx={{ mt: 3 }}
              {...handleErrorProps(touched.newPassword, errors.newPassword)}
              // error={touched.newPassword && !!errors.newPassword}
              // helperText={touched.newPassword && errors.newPassword}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sx={{}}>
            <CustomTextInput
              name="confirmPassword"
              value={values.confirmPassword}
              handleChange={handleChange}
              placeholder="Enter Confirm Password"
              title="Confirm Password"
              type="password"
              boxSx={{ mt: 3 }}
              {...handleErrorProps(
                touched.confirmPassword,
                errors.confirmPassword
              )}
              onBlur={handleBlur}
            />
            <Stack
              direction="row"
              justifyContent="end"
              alignItems="center"
              spacing={1}
              sx={{ width: "100%", mt: 1 }}
            >
              <Chip
                label="Update Password"
                variant="outlined"
                color="secondary"
                onClick={handleChangePassword}
                disabled={changePasswordLoading}
              />
            </Stack>
          </Grid>

          {/* <Box sx={{ alignSelf: "start", mt: 2 }}>
            <Button variant="contained">Save Changes</Button>
            <Button variant="outlined" sx={{ ml: 1 }}>
              Cancel
            </Button>
          </Box> */}
        </Grid>
      </Grid>
    </>
  );
}

export default ProfileDetails;
