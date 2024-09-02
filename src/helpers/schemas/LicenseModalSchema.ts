import * as yup from "yup";

export const LicenseModalSchema = yup.object({
  name: yup
    .string()
    .required("License name is required")
    .min(2, "License name must be at least 2 characters")
    .max(100, "License name must be at most 100 characters")
    .transform((value) => (value ? value.toLowerCase().trim() : value))
    .test("is-string", "Invalid License name enter only string ", (value) => {
      if (value !== null && value !== undefined && typeof value === "string") {
        const stringValue = value.toString();
        return /^[a-zA-Z ]+$/.test(stringValue);
      }
      return false;
    }),
  licenseNumber: yup
    .string()
    .required("License number is required")
    .min(2, "License number must be at least 2 characters long")
    .max(100, "License number cannot be longer than 100 characters")
    // .matches(
    //   /^[a-zA-Z]*[1-9][0-9]*$/,
    //   "Please enter only alphabets and positive numbers"
    // )
    .trim(),
});
