import { Card, CardBody } from "reactstrap";
import logo from "../../assets/images/brendan-logo.png";
import { Navigate } from "react-router-dom";
import { isUserAuthenticated } from "../../helpers/index";
import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPassword = () => {
  const isAuthenticated = isUserAuthenticated();
  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="card-main-wrapper">
      <Card className="card-content">
        <CardBody className="card-body-content">
          <img src={logo} alt="logo" className="img-logo" />
          <h1 className="card-title forgot-pass">Forgot Password</h1>
          <p>
            Please enter your registered email address and we will send you link
            to reset your password.
          </p>
          <ForgotPasswordForm />
        </CardBody>
      </Card>
    </div>
  );
};

export default ForgotPassword;
