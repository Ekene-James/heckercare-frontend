import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Button,
  TextField,
  InputLabel,
  IconButton,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";

import classes from "./RecoverPassword.module.css";
import { useAuthCtx } from "../../store/contextStore/auth/AuthStore";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";

function RecoverPassword() {
  const navigate = useNavigate();

  const [email, setemail] = React.useState("");
  // handle Password change Test
  const { mutate: resetPassword, isLoading: resetPasswordLoading } =
    useCustomMutation(
      {
        url: `/auth/forgot-password`,
        method: "post",
        data: {
          email,
        },
      },
      {
        onSuccess: () => {
          toast.success("A reset link has been sent to the provided email");
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
  const handleReset = () => {
    if (!email) return toast.error("Please input an email");
    resetPassword();
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setemail(value);
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
        <IconButton
          sx={{
            backgroundColor: "rgba(105, 86, 229, 0.2)",
            pointerEvents: "none",
          }}
          component="label"
        >
          <KeyIcon
            sx={{
              color: "rgba(105, 86, 229, 1)",
              transform: "rotate(150deg)",
            }}
          />
        </IconButton>
        <h3 className={classes.h3}>Recover Password</h3>
        <small>
          Please type in your email address to recover your password
        </small>
        <div className={classes.txtField}>
          <>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <TextField
              name="email"
              fullWidth
              value={email}
              onChange={handleChange}
              placeholder="Enter email address"
              variant="outlined"
              type="email"
              className={classes.form}
            />
          </>

          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handleReset}
            sx={{ mt: 2 }}
            disabled={resetPasswordLoading}
          >
            Reset Password
          </Button>
        </div>
      </Paper>
    </div>
  );
}

export default RecoverPassword;
