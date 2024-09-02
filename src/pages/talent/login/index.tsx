import { Card, CardBody } from "reactstrap";
import logo from "../../../assets/images/brendan-logo.png";
import LoginForm from "./LoginForm";
import Footer from "../../../components/talentlayout/footer";
import leftSideIamge from "../../../assets/images/applicantLogin.png";

const Login = () => {
  return (
    <div className="applicant-bg-wr">
      <div className="applicant-login-wr">
        <div className="left-side-wr">
          <div className="login-td-img">
            <img src={leftSideIamge} alt="logo" />
          </div>
        </div>
        <div className="auth-card-wr">
          <Card className="auth-card">
            <CardBody className="auth-card-body">
              <div className="auth-card-img-wr">
                <img src={logo} alt="logo" className="img-logo" />
              </div>
              <h2 className="purple-title">Welcome Back</h2>
              <LoginForm />
            </CardBody>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
