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

export const logout = (navigate) => {
  //clear local storage
  secureLocalStorage.removeItem("hms_user");
  //clear authHeader
  setAuthToken(false);
  navigate(`/`);
  toast.success("Logged out successfully");
  return {
    type: "LOGOUT",
  };
};
