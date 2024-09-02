import { Navigate } from "react-router-dom";
import { isUserAuthenticated } from "../helpers";
import { PrivateRouteProps } from "../types/RouteTypes";
import { clearCookies, getLoggedInStatus } from "../services/ProfessionalAuth";
import { useDispatch } from "react-redux";
import { setIsloggedIn } from "../store/ProfessionalAuthStore";

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  isTalentRoute,
}) => {
  const dispatch = useDispatch();
  const isAuthenticated = isTalentRoute
    ? getLoggedInStatus()
    : isUserAuthenticated();

  if (isTalentRoute && !isAuthenticated) {
    localStorage.removeItem("isLoggedIn");
    clearCookies();
    dispatch(setIsloggedIn(false));
    return <Navigate to="/talent/login" />;
  } else if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
