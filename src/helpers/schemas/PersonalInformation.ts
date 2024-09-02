import * as yup from "yup";
import { EMAIL_REGEX } from "../config";

export const PersonalInformationSchema = yup.object({
  ssn: yup
    .string()
    .optional()
    .nullable()
    .test(
      "ssn",
      "Invalid SSN it should be between 2-50 characters",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        return value.length >= 2 && value.length <= 50;
      }
    )
    .trim(),
});

export const EmergencyContactSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .max(50, "Max. length is 50")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z ']+$/, "Enter only characters in Name")
    .trim(),
  email: yup
    .string()
    .required("Email is required")
    .matches(EMAIL_REGEX, "Enter a valid email")
    .trim(),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^(\d{3}-\d{3}-\d{4}|\d{10})$/,
      "Enter a valid 10-digit mobile number"
    ),
  address: yup
    .string()
    .required("Address is required")
    .min(2, "Min. length is 2")
    .max(100, "Max. length is 100")
    .trim(),
});
