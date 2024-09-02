import { object, string } from "yup";
import { EMAIL_REGEX } from "../config";

export const createReferenceSchema = object({
  facilityName: string()
    .required("Facility Name is required")
    .min(2, "Min. length is 2")
    .max(50, "Max. length is 50")
    .matches(/^[a-zA-Z ']+$/, "Enter only characters in facility name")
    .trim(),
  referenceName: string()
    .required("Reference Name is required")
    .min(2, "Min. length is 2")
    .max(50, "Max. length is 50")
    .matches(/^[a-zA-Z ']+$/, "Enter only characters in reference name")
    .trim(),
  title: string()
    .required("Title is required")
    .min(2, "Min. length is 2")
    .max(50, "Max. length is 50")
    .matches(/^[a-zA-Z ']+$/, "Enter only characters in title")
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
  addionalFeedback: string().trim(),
});

export const professionalReferenceSchema = object({
  FacilityName: string()
    .required("Facility Name is required")
    .min(2, "Min. length is 2")
    .max(50, "Max. length is 50")
    .matches(/^[a-zA-Z ']+$/, "Enter only characters in facility name")
    .trim(),
  ReferenceName: string()
    .required("Reference Name is required")
    .min(2, "Min. length is 2")
    .max(50, "Max. length is 50")
    .matches(/^[a-zA-Z ']+$/, "Enter only characters in reference name")
    .trim(),
  Title: string()
    .required("Title is required")
    .min(2, "Min. length is 2")
    .max(50, "Max. length is 50")
    .matches(/^[a-zA-Z ']+$/, "Enter only characters in title")
    .trim(),
  Email: string()
    .required("Email is required")
    .matches(EMAIL_REGEX, "Enter a valid email")
    .trim(),
  Phone: string()
    .required("Mobile number is required")
    .matches(
      /^(\d{3}-\d{3}-\d{4}|\d{10})$/,
      "Enter a valid 10-digit mobile number"
    ),
});
