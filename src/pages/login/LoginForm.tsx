import { useContext, useState } from "react";
import { Button, Form, FormFeedback, FormGroup, Label } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoginFormSchema } from "../../helpers/schemas/AuthSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginFormDataType } from "../../types/AuthTypes";
import { login } from "../../services/AuthServices";
import Loader from "../../components/custom/CustomSpinner";
import { showToast } from "../../helpers/index";
import CustomInput from "../../components/custom/CustomInput";
import { SelectedMenuContext } from "../../helpers/context/SelectedSidebar";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const { setSelectedMenu } = useContext(SelectedMenuContext);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormDataType>({
    resolver: yupResolver(LoginFormSchema),
  });

  const togglePasswordVisibility = () =>
    setShowPassword((prevPassword) => !prevPassword);

  const onSubmit = async (data: LoginFormDataType) => {
    try {
      const { email, password } = data;
      setLoading(true);
      await login(email, password);
      setSelectedMenu(true);
      setLoading(false);
      showToast("success", "User Logged in successfully!");
      navigate("/");
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
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {loading && <Loader />}
        <FormGroup>
          <Label for="email" className="label-input">
            Email address<span className="asterisk"> *</span>
          </Label>

          <CustomInput
            type="email"
            id="email"
            placeholder="Email Address"
            invalid={!!errors.email}
            {...register("email")}
          />
          <FormFeedback>{errors.email?.message}</FormFeedback>
        </FormGroup>
        <FormGroup className="pass-wrap">
          <Label for="password" className="label-input">
            Password<span className="asterisk"> *</span>
          </Label>

          <CustomInput
            type={showPassword ? "password" : "text"}
            placeholder="Password"
            invalid={!!errors.password}
            {...register("password")}
          />
          <FormFeedback>{errors.password?.message}</FormFeedback>
          <Button
            type="button"
            onClick={togglePasswordVisibility}
            className="pass-visible"
          >
           
            {showPassword ? "Show" : "Hide"}
       
            
          </Button>
        </FormGroup>
        <div className="footer-btn-wrap">
          <Button className="login-btn" type="submit">
            Login
          </Button>
          <Link to="/forgot-password" className="forgot-pass-btn">
            Forgot Password
          </Link>
        </div>
      </Form>
    </>
  );
};

export default LoginForm;
