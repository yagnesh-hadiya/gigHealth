import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { Button, Col, FormFeedback, Label, Row } from "reactstrap";
import CustomInput from "../../components/custom/CustomInput";
import CustomButton from "../../components/custom/CustomBtn";
import { useForm } from "react-hook-form";
import { ChangePasswordDataType } from "../../types/AuthTypes";
import { changePasswordSchema } from "../../helpers/schemas/AuthSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../../components/custom/CustomSpinner";
import { changePassword } from "../../services/AuthServices";
import { showToast } from "../../helpers";

const ChangePasswordForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const togglePasswordVisibility = (field: string) => {
    switch (field) {
      case "currentPassword":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "newPassword":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirmNewPassword":
        setShowConfirmNewPassword(!showConfirmNewPassword);
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
    resolver: yupResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordDataType) => {
    try {
      const password = data.currentPassword;
      const newPassword = data.newPassword;
      setLoading(true);
      await changePassword(password, newPassword);
      setLoading(false);
      setValue("currentPassword", "");
      setValue("newPassword", "");
      setValue("confirmNewPassword", "");
      showToast("success", "Password changed successfully");
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {loading && <Loader />}
      <Row>
        <Col className="col-group profile-col-group">
          <Label className="">
            Current Password <span className="asterisk">*</span>
          </Label>

          <CustomInput
            placeholder="Current Password"
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            invalid={!!errors.currentPassword}
            {...register("currentPassword")}
          />
          <FormFeedback>{errors.currentPassword?.message}</FormFeedback>
          <Button
            type="button"
            onClick={() => togglePasswordVisibility("currentPassword")}
            className="pass-visible"
          >
            {showCurrentPassword ? "Hide" : "Show"}
          </Button>
        </Col>
        <Col className="col-group  profile-col-group">
          <Label>
            New Password <span className="asterisk">*</span>
          </Label>
          <CustomInput
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            id="newPassword"
            invalid={!!errors.newPassword}
            {...register("newPassword")}
          />
          <FormFeedback>{errors.newPassword?.message}</FormFeedback>
          <Button
            type="button"
            onClick={() => togglePasswordVisibility("newPassword")}
            className="pass-visible"
          >
            {showNewPassword ? "Hide" : "Show"}
          </Button>
        </Col>
        <Col className="col-group  profile-col-group">
          <Label>
            Confirm New Password <span className="asterisk">*</span>
          </Label>
          <CustomInput
            type={showConfirmNewPassword ? "text" : "password"}
            placeholder="Confirm New Password "
            id="confirmNewPassword"
            invalid={!!errors.confirmNewPassword}
            {...register("confirmNewPassword")}
          />
          <FormFeedback>{errors.confirmNewPassword?.message}</FormFeedback>
          <Button
            type="button"
            onClick={() => togglePasswordVisibility("confirmNewPassword")}
            className="pass-visible"
          >
            {showConfirmNewPassword ? "Hide" : "Show"}
          </Button>
        </Col>
      </Row>
      <div className="btn-wrapper">
        <CustomButton className="primary-btn">Update</CustomButton>
        <CustomButton className="secondary-btn" onClick={handleCancel}>
          Cancel
        </CustomButton>
      </div>
    </Form>
  );
};

export default ChangePasswordForm;
