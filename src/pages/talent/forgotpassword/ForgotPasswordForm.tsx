import { Form } from "react-router-dom";
import { Button, Col, FormFeedback, FormGroup, Label } from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ForgotPasswordDataType } from "../../../types/AuthTypes";
import { yupResolver } from "@hookform/resolvers/yup";
import { ForgotPasswordFormSchema } from "../../../helpers/schemas/AuthSchema";
import Loader from "../../../components/custom/CustomSpinner";
import { showToast } from "../../../helpers";
import { forgotProfessionalPassword } from "../../../services/ProfessionalAuth";

const ForgotPasswordForm = () => {
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
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");

  const onSubmit = async (data: ForgotPasswordDataType) => {
    try {
      const { email } = data;
      setLoading("loading");
      await forgotProfessionalPassword(email);
      showToast("success", "Please check your email for reset password link");
      setLoading("idle");
    } catch (error: any) {
      setLoading("error");
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {loading === "loading" && <Loader />}
      <FormGroup row className="mb-4 mt-1">
        <Label for="auth_email">
          Email Address <span className="asterisk">*</span>
        </Label>
        <Col sm={12}>
          <CustomInput
            type="text"
            placeholder="Email Address"
            id="auth_email"
            invalid={!!errors.email}
            {...register("email")}
          />
          <FormFeedback>{errors.email?.message}</FormFeedback>
        </Col>
      </FormGroup>
      <Button className="blue-gradient-btn login-btn mb-4">Send</Button>
      <div className="text-center mt-1">
        <NavLink to="/talent/login" className="forgot-redirect">
          Back to Login
        </NavLink>
      </div>
    </Form>
  );
};

export default ForgotPasswordForm;
