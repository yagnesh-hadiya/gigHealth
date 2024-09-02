import { useState } from "react";
import { Button, Form, FormFeedback, FormGroup, Label } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResetPasswordSchema } from "../../helpers/schemas/AuthSchema";
import { useForm } from "react-hook-form";
import { ResetPasswordDataType } from "../../types/AuthTypes";
import { showToast } from "../../helpers";
import { resetPassword, setPassword } from "../../services/AuthServices";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/custom/CustomSpinner";
import CustomInput from "../../components/custom/CustomInput";

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathArray = location.pathname.split("/");
  const route: string = `/${pathArray[1]}`;
  const queryParam = new URLSearchParams(location?.search);
  const token: string | null = queryParam.get("token");

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ResetPasswordDataType>({
    resolver: yupResolver(ResetPasswordSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: ResetPasswordDataType) => {
    const password = data.password;
    try {
      if (!token) {
        showToast("error", "Invalid Token");
        return;
      }
      setLoading(true);
      if (route === "/set-password") {
        await setPassword(token, password);
      } else if (route === "/reset-password") {
        await resetPassword(token, password);
      }
      setLoading(false);
      showToast("success", "Password Reset Successfully");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {loading && <Loader />}
      <FormGroup className="pass-wrap">
        <Label for="password" className="label-input">
          New Password<span className="asterisk"> *</span>
        </Label>

        <CustomInput
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder="New Password"
          invalid={!!errors.password}
          {...register("password")}
        />

        <FormFeedback>{errors.password?.message}</FormFeedback>
      </FormGroup>
      <FormGroup className="pass-wrap">
        <Label for="password" className="label-input">
          Confirm New Password<span className="asterisk"> *</span>
        </Label>

        <CustomInput
          type={showPassword ? "text" : "password"}
          id="confirmpassword"
          placeholder="Confirm New Password"
          invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />

        <FormFeedback>{errors.confirmPassword?.message}</FormFeedback>
        <Button
          type="button"
          onClick={togglePasswordVisibility}
          className="pass-visible"
        >
          {showPassword ? "Show" : "Hide"}
        </Button>
      </FormGroup>
      <div className="footer-btn-wrap">
        <Button className="login-btn">
          {" "}
          {route === "/set-password" ? "Set Password" : "Reset Password"}
        </Button>
        <Link to="/login" className="forgot-pass-btn">
          Back to Login
        </Link>
      </div>
    </Form>
  );
};

export default ResetPasswordForm;
