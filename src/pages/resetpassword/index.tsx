import { useLocation } from "react-router";
import { Card, CardBody } from "reactstrap";
import logo from "../../assets/images/brendan-logo.png";
import ResetPasswordForm from "./ResetPasswordForm";
import { useNavigate } from "react-router-dom";
import {
  clearCookies,
  getLoggedInStatus,
} from "../../services/ProfessionalAuth";
import { useEffect } from "react";
import { setIsloggedIn } from "../../store/ProfessionalAuthStore";
import { useDispatch } from "react-redux";

const ResetPassword = () => {
  const location = useLocation();
  const pathArray = location.pathname.split("/");
  const route: string = `/${pathArray[1]}`;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = getLoggedInStatus();

  useEffect(() => {
    if (isLoggedIn === "1") {
      navigate("/talent/main-home");
    } else {
      clearCookies();
      localStorage.removeItem("isLoggedIn");
      dispatch(setIsloggedIn(false));
      navigate("/talent/login");
    }
  }, [isLoggedIn]);

  return (
    <div className="card-main-wrapper">
      <Card className="card-content">
        <CardBody className="card-body-content">
          <img src={logo} alt="logo" className="img-logo" />
          <h1 className="card-title">
            {route === "/set-password" ? "Set Password" : "Reset Password"}
          </h1>
          <ResetPasswordForm />
        </CardBody>
      </Card>
    </div>
  );
};

export default ResetPassword;
