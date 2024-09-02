import { Form, useLocation, useNavigate } from "react-router-dom";
import { Button, Col, FormFeedback, FormGroup, Label } from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ResetPasswordDataType } from "../../../types/AuthTypes";
import { ResetPasswordSchema } from "../../../helpers/schemas/AuthSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { showToast } from "../../../helpers";
import Loader from "../../../components/custom/CustomSpinner";
import {
  getLoggedInStatus,
  resetProfesssionalPassword,
  setProfessionalPassword,
} from "../../../services/ProfessionalAuth";

function ResetPasswordForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ResetPasswordDataType>({
    resolver: yupResolver(ResetPasswordSchema),
  });

  const isLoggedIn = getLoggedInStatus();

  useEffect(() => {
    if (isLoggedIn === "1") {
      navigate("/talent/main-home");
    }
  }, [isLoggedIn]);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordTo, setShowPasswordTo] = useState<boolean>(false);

  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const navigate = useNavigate();
  const location = useLocation();
  const pathArray = location.pathname.split("/");
  const route: string = `/${pathArray[2]}`;
  const queryParam = new URLSearchParams(location?.search);
  const token: string | null = queryParam.get("token");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibilityFirst = () => {
    setShowPasswordTo(!showPasswordTo);
  };

  const onSubmit = async (data: ResetPasswordDataType) => {
    const password = data.password;
    let response;
    try {
      if (!token) {
        showToast("error", "Invalid Token");
        return;
      }
      setLoading("loading");
      if (route === "/set-password") {
        response = await setProfessionalPassword(token, password);
        if (response.status === 200) {
        }
        showToast("success", "Password Set Successfully");
      } else if (route === "/reset-password") {
        response = await resetProfesssionalPassword(token, password);
        if (response.status === 200) {
          showToast("success", "Password Reset Successfully");
        }
      }
      setLoading("idle");
      if (response?.status === 200) {
        setTimeout(() => {
          navigate("/talent/login");
        }, 1500);
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
        <Label for="auth_new_email">
          New Password <span className="asterisk">*</span>
        </Label>
        <Col sm={12}>
          <div className="password-input-wr">
            <CustomInput
              type={showPasswordTo ? "text" : "password"}
              placeholder="New Password"
              id="auth_new_email"
              invalid={!!errors.password}
              {...register("password")}
            />
            <Button
              onClick={togglePasswordVisibilityFirst}
              color="link"
              className="transparent-btn show-pwd-btn"
            >
              {showPasswordTo ? "Hide" : "Show"}
            </Button>
            <FormFeedback>{errors.password?.message}</FormFeedback>
          </div>
        </Col>
      </FormGroup>
      <FormGroup row className="mb-4">
        <Label for="auth_password">
          Password <span className="asterisk">*</span>
        </Label>
        <Col sm={12}>
          <div className="password-input-wr">
            <CustomInput
              type={showPassword ? "text" : "password"}
              id="auth_password"
              placeholder="Password"
              invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            <Button
              onClick={togglePasswordVisibility}
              color="link"
              className="transparent-btn show-pwd-btn"
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
            <FormFeedback>{errors.confirmPassword?.message}</FormFeedback>
          </div>
        </Col>
      </FormGroup>
      <Button type="submit" className="blue-gradient-btn login-btn mb-4">
        {route === "/set-password" ? "Set Password" : "Reset Password"}
      </Button>
      <div className="text-center mt-2">
        <NavLink to="/talent/login" className="forgot-redirect">
          Back to Login
        </NavLink>
      </div>
    </Form>
  );
}

export default ResetPasswordForm;
