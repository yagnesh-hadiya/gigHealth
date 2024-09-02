import { object, string } from "yup";
import { EMAIL_REGEX } from "../config";

export const ProfessionalSchema = object({
  firstName: string()
    .required("First Name is required")
    .max(20, "Max. length is 20")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z ']+$/, "Enter only characters in First Name")
    .trim(),
  lastName: string()
    .required("Last Name is required")
    .max(20, "Max. length is 20")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z ']+$/, "Enter only characters in Last Name")
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
  // zipCodeId: string()
  //   .required("Zip code is required")
  //   .test("is-zip", "Invalid Zip Code", (value) => {
  //     if (value === undefined || value === null || value === "") {
  //       return true;
  //     }
  //     return (
  //       (value.length === 5 || value.length === 9) && /^[0-9]+$/.test(value)
  //     );
  //   })
  //   .trim(),
  address: string()
    .required("Address is required")
    .min(2, "Min. length is 2")
    .max(100, "Max. length is 100")
    .trim(),
});
