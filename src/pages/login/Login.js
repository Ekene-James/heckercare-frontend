import React from "react";
import { Link } from "react-router-dom";
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
import classes from "./Login.module.css";
import { useAuthCtx } from "../../store/contextStore/auth/AuthStore";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import CustomButton from "components/atoms/CustomButton";

import { toast } from "react-toastify";

import secureLocalStorage from "react-secure-storage";
import { permissions } from "utils/permissionsData";
import { getNonDashboardUserHomePage } from "utils/getNonDashboardUserHomePage";
import { hasDashboard } from "utils/hasDashboard";
import { getRole } from "utils/getRole";

function Login() {
  const navigate = useNavigate();
  const { dispatch } = useAuthCtx();
  const [showPassword, setshowPassword] = React.useState(false);
  const [state, setstate] = React.useState({
    email: "",
    password: "",
  });

  const handleLoginSuccess = (response, variables, context) => {
    const { authorizationToken, user } = response?.data;

    let authorisedRoutes = new Set();
    let authorisedModules = new Set();

    authorisedRoutes.add("/home/profile");

    //user?.role?.permissions
    user?.role?.permissions.forEach((route) => {
      authorisedRoutes.add(route.url);
      if (route.module) authorisedModules.add(route.module);
    });
    authorisedRoutes = Array.from(authorisedRoutes);
    authorisedModules = Array.from(authorisedModules);

    if (response.data.accountStatus === "inactive") {
      dispatch({
        type: "FIRST_LOGIN",
        payload: response.data,
      });
      toast.success("Success");
      navigate(`/auth/change-password`);
    } else {
      if (response.data)
        secureLocalStorage.setItem("hms_user", {
          token: authorizationToken,
          user: { ...user, authorisedRoutes, authorisedModules },
        });

      dispatch({
        type: "LOGIN",
        payload: { ...user, authorisedRoutes, authorisedModules },
      });
      toast.success("Logged in Successfully");
      const role = getRole(user);

      if (hasDashboard(role)) {
        navigate(`/home/${role}`);
      } else {
        navigate(getNonDashboardUserHomePage(role));
      }
    }
  };

  const handleLoginError = (error, variables, context) => {
    toast.error(error.message);
    console.log(error);
    console.log(variables);
    console.log(context);
  };
  const queryObj = {
    onSuccess: (response, variables, context) =>
      handleLoginSuccess(response, variables, context),
    onError: (error, variables, context) =>
      handleLoginError(error, variables, context),
  };

  const { mutate: login, isLoading } = useCustomMutation(
    { url: "/auth/login", method: "post", data: state },
    queryObj
  );

  const onLogin = (e) => {
    e.preventDefault();
    if (!state.email)
      return toast.error("Please provide a valid email address");
    if (!state.password) return toast.error("Please provide a password");
    login();
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
        <h3 className={classes.h3}>Sign in to gain access</h3>

        <form className={classes.txtField} onSubmit={onLogin}>
          <TextField
            name="email"
            fullWidth
            value={state.email}
            onChange={handleChange}
            label="Email"
            variant="outlined"
            type="email"
            className={classes.form}
          />
          <>
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              name="password"
              fullWidth
              className={classes.form1}
              value={state.password}
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
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Link to={"/auth/recover-password"} className={classes.link}>
              Forgot Password?
            </Link>
          </Stack>

          <CustomButton
            fullWidth
            variant="contained"
            color="secondary"
            type="submit"
            disabled={isLoading}
            text="Sign in"
            endIcon={<ArrowRightAltIcon className={classes.icon} />}
          />
        </form>
      </Paper>
    </div>
  );
}

export default Login;
