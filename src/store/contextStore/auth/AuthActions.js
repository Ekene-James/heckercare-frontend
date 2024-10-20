import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import setAuthToken from "../../../utils/setAuthToken";

export const handleLoadings = (state) => {
  return {
    type: "LOADINGS",
    payload: state,
  };
};

export const setCurrentUser = (user) => {
  return {
    type: "LOGIN",
    payload: user,
  };
};

// const signUserIn = (token, dispatch, navigate, user) => {
//   localStorage.setItem("hms_user", JSON.stringify({ token, user }));
//   //set token as auth header using axios
//   // setAuthToken(token);
//   // const decoded = jwt_decode(token);
//   // const cred = {
//   //   ...decoded,
//   // };
//   // dispatch(isLoading(false));
//   dispatch({
//     type: "LOGIN",
//     payload: user,
//   });
//   navigate(`/home/${user.role}`);
// };

// export const login = async (state, dispatch, navigate) => {
//   // dispatch(isLoading(true));
//   const user = {
//     role: state.loginType,
//     name: "jon doe",
//     forbiddenRoutes: [],
//     forbiddenModules: [],
//   };
//   signUserIn("abcd", dispatch, navigate, user);

//   // try {
//   //   const user = await axios.post("/api/auth/login", state);
//   //   signUserIn(user.data.token, dispatch, navigate);
//   // } catch (error) {
//   //   console.log(error);
//   //   dispatch(isLoading(false));
//   // }
// };
export const logout = (navigate) => {
  //clear local storage
  secureLocalStorage.removeItem("hms_user");
  //clear authHeader
  setAuthToken(false);
  navigate(`/auth`);
  toast.success("Logged out successfully");
  return {
    type: "LOGOUT",
  };
};
