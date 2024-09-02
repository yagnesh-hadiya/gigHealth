import { Form, useNavigate } from "react-router-dom";
import { Button, Col, FormFeedback, FormGroup, Label, Row } from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ChangePasswordDataType } from "../../../types/AuthTypes";
import { yupResolver } from "@hookform/resolvers/yup";
import { changeProfessionalPasswordSchema } from "../../../helpers/schemas/AuthSchema";
import { showToast } from "../../../helpers";
import Loader from "../../../components/custom/CustomSpinner";
import {
  changeProfessionalPassword,
  clearCookies,
  getLoggedInStatus,
} from "../../../services/ProfessionalAuth";
import { useDispatch } from "react-redux";
import { setIsloggedIn } from "../../../store/ProfessionalAuthStore";

const ChangePasswordForm = () => {
  const isLoggedIn = getLoggedInStatus();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!(isLoggedIn === "1")) {
      clearCookies();
      localStorage.removeItem("isLoggedIn");
      dispatch(setIsloggedIn(false));
      navigate("/talent/login");
    }
  }, [isLoggedIn]);

  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState<boolean>(false);

  const togglePasswordVisibility = (field: string) => {
    switch (field) {
      case "currentPassword":
        setShowCurrentPassword((prevValue) => !prevValue);
        break;
      case "newPassword":
        setShowNewPassword((prevValue) => !prevValue);
        break;
      case "confirmNewPassword":
        setShowConfirmNewPassword((prevValue) => !prevValue);
        break;
      default:
        break;
    }
  };

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm<ChangePasswordDataType>({
    resolver: yupResolver(changeProfessionalPasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordDataType) => {
    try {
      const password = data.currentPassword;
      const newPassword = data.newPassword;
      setLoading("loading");
      const response = await changeProfessionalPassword(password, newPassword);

      setValue("currentPassword", "");
      setValue("newPassword", "");
      setValue("confirmNewPassword", "");
      showToast("success", "Password changed successfully");
      setLoading("idle");
      if (response.status === 200) {
        setTimeout(() => {
          navigate("/talent/login");
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
      <Row>
        <Col md={4} sm={6}>
          <FormGroup>
            <Label for="cp_old_pass">
              Old Password <span className="asterisk">*</span>
            </Label>
            <div className="password-input-wr">
              <CustomInput
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Old Password"
                id="cp_old_pass"
                invalid={!!errors.currentPassword}
                {...register("currentPassword")}
              />
              <Button
                color="link"
                onClick={() => togglePasswordVisibility("currentPassword")}
                className="transparent-btn show-pwd-btn"
              >
                {showCurrentPassword ? "Hide" : "Show"}
              </Button>
              <FormFeedback>{errors.currentPassword?.message}</FormFeedback>
            </div>
          </FormGroup>
        </Col>
        <Col md={4} sm={6}>
          <FormGroup>
            <Label for="cp_new_pass">
              New Password <span className="asterisk">*</span>
            </Label>
            <div className="password-input-wr">
              <CustomInput
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                id="cp_new_pass"
                invalid={!!errors.newPassword}
                {...register("newPassword")}
              />
              <Button
                color="link"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="transparent-btn show-pwd-btn"
              >
                {showNewPassword ? "Hide" : "Show"}
              </Button>
              <FormFeedback>{errors.newPassword?.message}</FormFeedback>
            </div>
          </FormGroup>
        </Col>
        <Col md={4} sm={6}>
          <FormGroup>
            <Label for="cp_confirm_new_pass">
              Confirm New Password <span className="asterisk">*</span>
            </Label>
            <div className="password-input-wr">
              <CustomInput
                type={showConfirmNewPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                id="cp_confirm_new_pass"
                invalid={!!errors.confirmNewPassword}
                {...register("confirmNewPassword")}
              />
              <Button
                color="link"
                onClick={() => togglePasswordVisibility("confirmNewPassword")}
                className="transparent-btn show-pwd-btn"
              >
                {showConfirmNewPassword ? "Hide" : "Show"}
              </Button>
              <FormFeedback>{errors.confirmNewPassword?.message}</FormFeedback>
            </div>
          </FormGroup>
        </Col>
        <Col md={12}>
          <div className="pt-1">
            <Button className="blue-gradient-btn mb-0">Save & Update</Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default ChangePasswordForm;
