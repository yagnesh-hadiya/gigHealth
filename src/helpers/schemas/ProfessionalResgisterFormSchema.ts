import { object, string } from "yup";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../config";

export const ProfessionalRegisterFormSchema = object({
  firstName: string()
    .required("First Name is required")
    .max(20, "Max. length is 20")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z']+$/, "Invalid characters in First Name")
    .trim(),
  lastName: string()
    .required("Last Name is required")
    .max(20, "Max. length is 20")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z']+$/, "Invalid characters in Last Name")
    .trim(),
  email: string()
    .required("Email is required")
    .matches(EMAIL_REGEX, "Enter a valid email")
    .trim(),
  phone: string()
    .required("Mobile number is required")
    .matches(
      /^(\d{3}-\d{3}-\d{4}|\d{10})$/,
      "Enter a valid 10-digit mobile number"
    ),
  address: string()
    .required("Address is required")
    .min(2, "Min. length is 2")
    .max(100, "Max. length is 100")
    .trim(),
  experience: string()
    .required("Experience is required")
    .min(0, "Experience cannot be negative"),
  password: string()
    .required("Password is required")
    .max(20, "Max. length is 20")
    .min(8, "Min. length is 8")
    .matches(
      PASSWORD_REGEX,
      "Password must contain atleast one upperCase, lowercase, number and special characters"
    ),
  confirmPassword: string()
    .required("Confirm Password is required")
    .max(20, "Max. length is 20")
    .min(8, "Min. length is 8")
    .matches(
      PASSWORD_REGEX,
      "Password must contain atleast one upperCase, lowercase, number and special characters"
    ),
});
