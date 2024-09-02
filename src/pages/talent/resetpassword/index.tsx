import { Card, CardBody } from "reactstrap";
import logo from "../../../assets/images/brendan-logo.png";
import ResetPasswordForm from "./ResetPasswordForm";
import Footer from "../../../components/talentlayout/footer";
import { useLocation } from "react-router-dom";

function index() {
  const location = useLocation();
  const pathArray = location.pathname.split("/");
  const route: string = `/${pathArray[2]}`;

  return (
    <div className="applicant-bg-wr bg-none">
      <div className="applicant-login-wr">
        <div className="auth-card-wr w-100">
          <Card className="auth-card mx-auto">
            <CardBody className="auth-card-body">
              <div className="auth-card-img-wr">
                <img src={logo} alt="logo" className="img-logo" />
              </div>
              <h2 className="purple-title">
                {route === "/set-password" ? "Set Password" : "Reset Password"}
              </h2>
              <ResetPasswordForm />
            </CardBody>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default index;
