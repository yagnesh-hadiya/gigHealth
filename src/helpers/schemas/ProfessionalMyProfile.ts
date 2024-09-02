import * as yup from "yup";

export const ProfessionalAdditionalDetailsSchema = yup.object({
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
  referral: yup
    .string()
    .optional()
    .nullable()
    .test(
      "referral",
      "Referral field must contain only positive number with value greater than 0",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        return value.length > 0 && /^\d+$/.test(value);
      }
    )
    .trim(),
  other: yup
    .string()
    .optional()
    .nullable()
    .test(
      "other",
      "Other field must be between 2 and 100 characters and can only contain letters, spaces, number and apostrophes",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        return (
          value.length >= 2 &&
          value.length <= 100 &&
          /^[a-zA-Z0-9\s,'-]+$/.test(value)
        );
      }
    )
    .trim(),
});
