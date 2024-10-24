import React from "react";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import jwt_decode from "jwt-decode";
import secureLocalStorage from "react-secure-storage";
import setAuthToken from "../utils/setAuthToken";
import { setCurrentUser } from "../store/contextStore/auth/AuthActions";
import { useAuthCtx } from "../store/contextStore/auth/AuthStore";
import { sidebarData } from "utils/data";
import { hasDashboard } from "utils/hasDashboard";
import { getNonDashboardUserHomePage } from "utils/getNonDashboardUserHomePage";
import { getRole } from "utils/getRole";

const useAuth = () => {
  const userData = secureLocalStorage.getItem("hms_user");

  if (userData) {
    const { token, user } = userData;

    const role = getRole(user);
    let authorisedRoutes = [...user.authorisedRoutes];
    const isHasDashboard = hasDashboard(role);
    //solely for dashboard links
    //only add links from dashboard of a user role, like a doctor would need only links from doctors dashboard and not from nurse or accounting
    sidebarData.forEach((data) => {
      if (data.text === "Dashboard" && data?.for === role && isHasDashboard) {
        return (authorisedRoutes = [
          data.link,
          ...data.subroutes,
          ...authorisedRoutes,
        ]);
      }
    });

    const userDetails = {
      ...user,
      authorisedRoutes,
      roleObj: user.role,
      role: role || "",
    };
    // setAuthToken(token);
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

const AuthenticatedRoutes = () => {
  const { isAuth, user } = useAuth();

  const { role, authorisedRoutes, authorisedModules } = user;
  const params = useParams();
  const { pathname } = useLocation();

  const { dispatch } = useAuthCtx();
  const navigate = useNavigate();

  const isHasDashboard = hasDashboard(role);

  React.useLayoutEffect(() => {
    if (isAuth) {
      dispatch(setCurrentUser({ role, ...user }));
    }
  }, []);

  const reReoute = React.useCallback(() => {
    if (isHasDashboard) {
      return navigate(`/home/${role}/dashboard`, { replace: true });
    } else {
      return navigate(getNonDashboardUserHomePage(role), { replace: true });
    }
  }, [isHasDashboard, role, navigate]);

  React.useEffect(() => {
    const isAuthorizedToView = authorisedRoutes?.includes(pathname);
    const isDynamicRoute = Object.keys(params).length > 0;

    if (isAuth && isDynamicRoute) {
      //find the module the route is coming from using the 'isRouteIncludes' key from sidebar array

      let moduleOfRoute = "";

      sidebarData.forEach((sidebar) => {
        if (pathname?.includes(sidebar.isRouteIncludes))
          return (moduleOfRoute = sidebar.text);
      });

      const isAuthorizedToViewModule =
        authorisedModules?.includes(moduleOfRoute);

      if (!isAuthorizedToViewModule) {
        return reReoute();
      }
      return;
    }

    if (isAuth && pathname && !isAuthorizedToView) {
      return reReoute();
    }
  }, [
    pathname,
    authorisedRoutes,
    navigate,
    role,
    isHasDashboard,
    isAuth,
    params,
    authorisedModules,
    reReoute,
  ]);

  return <>{isAuth ? <Outlet /> : <Navigate to="/auth" />}</>;
};

export default AuthenticatedRoutes;
