import React from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import classes from "./ResetPassword.module.css";

import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import CustomButton from "components/atoms/CustomButton";

import { toast } from "react-toastify";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [state, setstate] = React.useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setshowPassword] = React.useState(false);
  const [showPassword1, setshowPassword1] = React.useState(false);

  // handle Password change Test
  const {
    mutate: handlePasswordChange,
    isLoading: handlePasswordChangeLoading,
  } = useCustomMutation(
    {
      url: `/auth/reset-password/${token}`,
      method: "patch",
      data: {
        ...state,
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

  const onClickChangePassword = () => {
    if (!state.password) return toast.error("Please input a password");
    if (!state.confirmPassword)
      return toast.error("Please input confirm password");
    if (state.confirmPassword !== state.password)
      return toast.error("Password and Confirm Password must be the same");
    handlePasswordChange();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setstate({
      ...state,
      [name]: value,
    });
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

        <div className={classes.txtField}>
          <>
            <InputLabel htmlFor="password">New Password</InputLabel>
            <OutlinedInput
              name="password"
              fullWidth
              className={classes.form1}
              value={state.password}
              placeholder="New Passoword"
              onChange={handleChange}
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
            <InputLabel htmlFor="password">Confirm Password</InputLabel>
            <OutlinedInput
              name="confirmPassword"
              fullWidth
              className={classes.form1}
              value={state.confirmPassword}
              placeholder="Confirm Passoword"
              onChange={handleChange}
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

          <CustomButton
            fullWidth
            variant="contained"
            color="secondary"
            onClick={onClickChangePassword}
            disabled={handlePasswordChangeLoading}
            text="Set New Password"
          />
        </div>
      </Paper>
    </div>
  );
}

export default ResetPassword;
