import { Button, Form, FormFeedback, FormGroup, Label } from "reactstrap";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ForgotPasswordFormSchema } from "../../helpers/schemas/AuthSchema";
import { ForgotPasswordDataType } from "../../types/AuthTypes";
import Loader from "../../components/custom/CustomSpinner";
import { useState } from "react";
import { forgotPassword } from "../../services/AuthServices";
import { isUserAuthenticated, showToast } from "../../helpers/index";
import CustomInput from "../../components/custom/CustomInput";

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordDataType>({
    resolver: yupResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const isAuthenticated = isUserAuthenticated();
  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  const onSubmit = async (data: ForgotPasswordDataType) => {
    try {
      const { email } = data;
      setLoading(true);
      await forgotPassword(email);
      setLoading(false);
      showToast("success", "Please check your email for reset password link");
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {loading && <Loader />}
      <FormGroup>
        <Label for="email" className="label-input">
          Email address<span className="asterisk">*</span>
        </Label>
        <CustomInput
          type="email"
          id="email"
          placeholder="Email address"
          invalid={!!errors.email}
          {...register("email")}
        />
        <FormFeedback>{errors.email?.message}</FormFeedback>
      </FormGroup>
      <div className="footer-btn-wrap">
        <Button className="login-btn">Send</Button>
        <Link to="/login" className="forgot-pass-btn">
          Back to Login
        </Link>
      </div>
    </Form>
  );
};

export default ForgotPasswordForm;
