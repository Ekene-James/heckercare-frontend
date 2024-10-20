import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import secureLocalStorage from "react-secure-storage";
import setAuthToken from "../utils/setAuthToken";
import { useAuthCtx } from "../store/contextStore/auth/AuthStore";
import { setCurrentUser } from "../store/contextStore/auth/AuthActions";
import { sidebarData } from "utils/data";
import jwt_decode from "jwt-decode";

const useAuth = () => {
  const userData = secureLocalStorage.getItem("hms_user");

  if (userData) {
    const { token, user } = userData;

    const lowerCaseRole = user?.role?.name?.toLowerCase();
    let authorisedRoutes = [];

    sidebarData.forEach((data) => {
      if (data.text === "Dashboard" && data?.for === lowerCaseRole) {
        return (authorisedRoutes = [
          ...user.authorisedRoutes,
          ...data.subroutes,
          data.link,
        ]);
      }
    });
    const userDetails = {
      ...user,
      authorisedRoutes,
      roleObj: user.role,
      role: lowerCaseRole || "",
    };
    setAuthToken(token);
    const currentTime = Date.now() / 1000;

    const decoded = jwt_decode(token);

    if (decoded.exp < currentTime || !decoded.user) {
      return {
        isAuth: false,
        token: null,
        user: { role: "" },
      };
    }

    return {
      isAuth: true,
      token: token,
      user: userDetails,
    };
  } else {
    return {
      isAuth: false,
      token: null,
      user: { role: "" },
    };
  }
};
function PublicRoutes() {
  const { isAuth, user } = useAuth();
  const { role } = user;

  const { dispatch } = useAuthCtx();
  React.useLayoutEffect(() => {
    if (isAuth) {
      dispatch(setCurrentUser({ role, ...user }));
    }
  }, []);

  return !isAuth ? <Outlet /> : <Navigate to={`/home/${role}`} />;
}

export default PublicRoutes;
