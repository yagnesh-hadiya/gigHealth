import { Form, useNavigate } from "react-router-dom";
import { Button, Col, FormFeedback, FormGroup, Label } from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoginFormDataType } from "../../../types/AuthTypes";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginFormSchema } from "../../../helpers/schemas/AuthSchema";
import {
  clearCookies,
  getLoggedInStatus,
  loggedInProfessional,
  loginProfessional,
} from "../../../services/ProfessionalAuth";
import { showToast } from "../../../helpers";
import { useDispatch } from "react-redux";
import { setIsloggedIn } from "../../../store/ProfessionalAuthStore";
import Loader from "../../../components/custom/CustomSpinner";

const LoginForm: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormDataType>({
    resolver: yupResolver(LoginFormSchema),
  });

  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = getLoggedInStatus();

  useEffect(() => {
    if (!isLoggedIn) {
      clearCookies();
      localStorage.removeItem("isLoggedIn");
      navigate("/talent/login");
    } else {
      navigate("/talent/main-home");
    }
  }, [isLoggedIn]);

  const togglePasswordVisibility = () =>
    setShowPassword((prevPassword) => !prevPassword);

  const onSubmit = async (data: LoginFormDataType) => {
    try {
      const { email, password } = data;
      setLoading("loading");
      const response = await loginProfessional(email, password);
      setLoading("idle");
      if (response.status === 200) {
        showToast("success", "Professional logged in successfully!");
        loggedInProfessional();
        dispatch(setIsloggedIn(true));
        setTimeout(() => {
          navigate("/talent/main-home");
        }, 500);
      }
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {loading === "loading" && <Loader />}
      <FormGroup row>
        <Label for="auth_email">
          Email Address <span className="asterisk">*</span>{" "}
        </Label>
        <Col sm={12}>
          <CustomInput
            type="text"
            placeholder="Email Address"
            id="auth_email"
            {...register("email")}
            invalid={!!errors.email}
          />
          <FormFeedback>{errors.email?.message}</FormFeedback>
        </Col>
      </FormGroup>
      <FormGroup row className="mb-4">
        <Label for="auth_password">
          Password <span className="asterisk">*</span>
        </Label>
        <Col sm={12}>
          <div className="password-input-wr">
            <CustomInput
              type={showPassword ? "password" : "text"}
              id="auth_password"
              placeholder="Password"
              invalid={!!errors.password}
              {...register("password")}
            />
            <Button
              color="link"
              className="transparent-btn show-pwd-btn"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Show" : "Hide"}
            </Button>
            <FormFeedback>{errors.password?.message}</FormFeedback>
          </div>
        </Col>
      </FormGroup>
      <Button type="submit" className="blue-gradient-btn login-btn mb-4">
        Login
      </Button>
      <div className="text-center mt-2">
        <NavLink to="/talent/forgot-password" className="forgot-redirect">
          Forgot Password
        </NavLink>
      </div>
    </Form>
  );
};

export default LoginForm;
