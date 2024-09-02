import { Card, CardBody } from "reactstrap";
import logo from "../../assets/images/brendan-logo.png";
import LoginForm from "./LoginForm";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getLocalAccessToken } from "../../helpers/tokens";

const Login = () => {
  const navigate = useNavigate();

  const isLoggedIn = getLocalAccessToken();
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    } else {
      navigate('/login')
    }
  }, [navigate, isLoggedIn]);

  return (
    <div className="card-main-wrapper">
      <Card className="card-content">
        <CardBody className="card-body-content">
          <img src={logo} alt="logo" className="img-logo" />
          <h1 className="card-title">Login</h1>
          <LoginForm />
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
