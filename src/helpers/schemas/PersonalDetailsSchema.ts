import * as yup from "yup";

export const PersonalDetailsSchema = yup.object({
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
