import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  OutlinedInput,
  InputLabel,
  Stack,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import classes from "./ChangePassword.module.css";
import { useAuthCtx } from "../../store/contextStore/auth/AuthStore";

import secureLocalStorage from "react-secure-storage";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import CustomButton from "components/atoms/CustomButton";

import { toast } from "react-toastify";

import { useFormik } from "formik";
import { handleErrorProps } from "utils/handleErrorProps";

const initialValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const requireFields = ["oldPassword", "newPassword", "confirmPassword"];

const validate = (values) => {
  const errors = {};

  requireFields.forEach((field) => {
    if (!values[field]) return (errors[field] = "Required");
  });

  return errors;
};

function ChangePassword() {
  const navigate = useNavigate();
  const { dispatch, state } = useAuthCtx();
  const [showPassword, setshowPassword] = React.useState(false);
  const [showPassword1, setshowPassword1] = React.useState(false);
  const [showPassword2, setshowPassword2] = React.useState(false);

  const {
    handleBlur,
    handleChange,
    values,
    touched,
    errors,
    setValues,
    setFieldTouched,
    resetForm,
  } = useFormik({
    initialValues,
    validate: (values) => validate(values),
  });

  React.useEffect(() => {
    if (Object.keys(state.firstLogin).length) {
      setValues((prev) => ({
        ...prev,
        email: state.firstLogin.email,
      }));
    } else {
      navigate("/auth");
    }
  }, [state.firstLogin]);

  // handle Password change Test
  const {
    mutate: handlePasswordChange,
    isLoading: handlePasswordChangeLoading,
  } = useCustomMutation(
    {
      url: `/user/change-password-login`,
      method: "patch",
      data: {
        ...values,
      },
    },
    {
      onSuccess: () => {
        toast.success("Success");
        navigate("/auth");
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }

        return toast.error(error.message);
      },
    }
  );

  const onClickChangePassword = (e) => {
    e.preventDefault();
    let emptyRequiredFieldNumber = 0;

    requireFields.forEach((field) => {
      emptyRequiredFieldNumber =
        values[field] === ""
          ? emptyRequiredFieldNumber + 1
          : emptyRequiredFieldNumber;
      setFieldTouched(field, true, true);
    });

    if (emptyRequiredFieldNumber > 0) return;
    handlePasswordChange();
  };

  return (
    <div
      className={classes.bg}
      style={{
        background:
          'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url("/imgs/loginScreen/image 38.png") no-repeat center center/cover',
      }}
    >
      <Paper className={classes.paper}>
        <h3 className={classes.h3}>Change Password</h3>

        <form className={classes.txtField} onSubmit={onClickChangePassword}>
          <>
            <InputLabel htmlFor="password">Old Password</InputLabel>
            <OutlinedInput
              name="oldPassword"
              fullWidth
              className={classes.form1}
              value={values.oldPassword}
              placeholder="Old Passoword"
              onChange={handleChange}
              onBlur={handleBlur}
              {...handleErrorProps(touched.oldPassword, errors.oldPassword)}
              type={showPassword ? "text" : "password"}
              variant="outlined"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setshowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </>
          <>
            <InputLabel htmlFor="password">New Password</InputLabel>
            <OutlinedInput
              name="newPassword"
              fullWidth
              className={classes.form1}
              value={values.newPassword}
              placeholder="New Passoword"
              onBlur={handleBlur}
              onChange={handleChange}
              {...handleErrorProps(touched.newPassword, errors.newPassword)}
              type={showPassword1 ? "text" : "password"}
              variant="outlined"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setshowPassword1(!showPassword1)}
                    edge="end"
                  >
                    {showPassword1 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </>
          <>
            <InputLabel htmlFor="password">Re-enter Password</InputLabel>
            <OutlinedInput
              name="confirmPassword"
              fullWidth
              className={classes.form1}
              value={values.confirmPassword}
              placeholder="Confirm Passoword"
              onChange={handleChange}
              {...handleErrorProps(
                touched.confirmPassword,
                errors.confirmPassword
              )}
              onBlur={handleBlur}
              type={showPassword2 ? "text" : "password"}
              variant="outlined"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setshowPassword2(!showPassword2)}
                    edge="end"
                  >
                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ mb: 2 }}
          ></Stack>

          <CustomButton
            fullWidth
            variant="contained"
            color="secondary"
            type="submit"
            disabled={handlePasswordChangeLoading}
            text="Set New Password"
          />
        </form>
      </Paper>
    </div>
  );
}

export default ChangePassword;
