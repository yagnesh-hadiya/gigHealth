import { object, ref, string } from "yup";
import { EMAIL_REGEX } from "../config";
import { PASSWORD_REGEX } from "../config";

export let LoginFormSchema = object({
  email: string()
    .required("Email is required")
    .test("email", "Enter a valid email", (value) => {
      if (value === null || value === undefined || value === "") {
        return true;
      } else {
        return EMAIL_REGEX.test(value);
      }
    }),

  password: string()
    .required("Password is required")
    .max(20, "Max. length is 20")
    .min(8, "Min. length is 8")
    .matches(
      PASSWORD_REGEX,
      "Password must contain atleast one upperCase, lowercase, number and special characters"
    ),
});

export let ForgotPasswordFormSchema = object({
  email: string()
    .required("Email is required")
    .matches(EMAIL_REGEX, "Enter a valid email")
    .trim(),
});

export let ResetPasswordSchema = object({
  password: string()
    .required("Password is required")
    .max(20, "Max. length is 20")
    .min(8, "Min. length is 8")
    .matches(
      PASSWORD_REGEX,
      "Password must contain atleast one upperCase, lowercase, number and special characters"
    ),
  confirmPassword: string()
    .required("Password is required")
    .oneOf([ref("password")], `Password doesn't match`),
});

export const changePasswordSchema = object({
  currentPassword: string()
    .required("Current Password is required")
    .max(20, "Max. length is 20")
    .min(8, "Min. length is 8")
    .matches(
      PASSWORD_REGEX,
      "Password must contain atleast one upperCase, lowercase, number and special characters"
    ),
  newPassword: string()
    .required("New Password is required")
    .max(20, "Max. length is 20")
    .min(8, "Min. length is 8")
    .matches(
      PASSWORD_REGEX,
      "Password must contain atleast one upperCase, lowercase, number and special characters"
    )
    .test(
      "not-same-as-current",
      "New Password cannot be the same as the Current Password",
      function (value) {
        return value !== this.parent.currentPassword;
      }
    ),

  confirmNewPassword: string()
    .required("Confirm New Password is required")
    .test(
      "match",
      "New Password and Confirm Password must match.",
      function (value) {
        if (this.parent.newPassword && this.parent.newPassword.length > 0) {
          return value === this.parent.newPassword;
        }
        return true;
      }
    ),
});

export const changeProfessionalPasswordSchema = object({
  currentPassword: string()
    .required("Old Password is required")
    .max(20, "Max. length is 20")
    .min(8, "Min. length is 8")
    .matches(
      PASSWORD_REGEX,
      "Password must contain atleast one upperCase, lowercase, number and special characters"
    ),
  newPassword: string()
    .required("New Password is required")
    .max(20, "Max. length is 20")
    .min(8, "Min. length is 8")
    .matches(
      PASSWORD_REGEX,
      "Password must contain atleast one upperCase, lowercase, number and special characters"
    )
    .test(
      "not-same-as-current",
      "New Password cannot be the same as the Current Password",
      function (value) {
        return value !== this.parent.currentPassword;
      }
    ),

  confirmNewPassword: string()
    .required("Confirm New Password is required")
    .test(
      "match",
      "New Password and Confirm Password must match.",
      function (value) {
        if (this.parent.newPassword && this.parent.newPassword.length > 0) {
          return value === this.parent.newPassword;
        }
        return true;
      }
    ),
});
