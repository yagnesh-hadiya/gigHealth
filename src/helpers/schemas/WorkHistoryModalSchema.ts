import * as yup from "yup";

export const WorkHistoryModalSchema = yup.object({
  facilityName: yup
    .string()
    .required("Facility name is required")
    .max(50, "Max. length is 50")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z ']+$/, "Enter only characters in facility name")
    .trim(),
  categoryProfession: yup.string().required("Profession is required").trim(),
  startDate: yup.string().required("Start Date is required").trim(),
  facilityType: yup
    .string()
    .required("Facility type is required")
    .max(50, "Max. length is 50")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z ']+$/, "Enter only characters in facility type")
    .trim(),
  nurseToPatientRatio: yup
    .string()
    .optional()
    .nullable()
    .test(
      "requirements",
      "Nurse to patient ratio must be between 2 to 50 characters and can only contain letters,colons,number",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        return (
          value.length >= 2 &&
          value.length <= 50 &&
          /^[a-zA-Z0-9\s,:]+$/.test(value)
        );
      }
    )
    .trim(),
  facilityBeds: yup
    .string()
    .nullable()
    .test(
      "requirements",
      "Facility beds must be a number between 0 and 1000",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        const numericValue = parseInt(value);
        if (isNaN(numericValue)) {
          return false;
        }
        return numericValue >= 0 && numericValue <= 1000;
      }
    )
    .trim(),
  bedsInUnit: yup
    .string()
    .nullable()
    .test(
      "requirements",
      "Beds in unit must be a number between 0 and 1000",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        const numericValue = parseInt(value);
        if (isNaN(numericValue)) {
          return false;
        }
        return numericValue >= 0 && numericValue <= 1000;
      }
    )
    .trim(),
  additionalInfo: yup
    .string()
    .optional()
    .nullable()
    .test(
      "requirements",
      "Additional Info must be between 2 and 500 characters and can only contain letters, spaces, number and apostrophes",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        return (
          value.length >= 2 &&
          value.length <= 500 &&
          /^[a-zA-Z0-9\s,'-]+$/.test(value)
        );
      }
    )
    .trim(),
  positionHeld: yup
    .string()
    .required("Position held is required")
    .max(100, "Max. length is 100")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z0-9\s,]+$/, "Enter only characters and numbers")
    .trim(),
  agencyName: yup
    .string()
    .optional()
    .nullable()
    .test(
      "requirements",
      "Agency name must be between 2 to 50 characters and can only contain letters",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        return (
          value.length >= 2 && value.length <= 50 && /^[a-zA-Z']+$/.test(value)
        );
      }
    )
    .trim(),
  reasonForLeaving: yup
    .string()
    .optional()
    .nullable()
    .test(
      "requirements",
      "Reason for leaving must be between 2 and 500 characters and can only contain letters, spaces, number and apostrophes",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        return (
          value.length >= 2 &&
          value.length <= 500 &&
          /^[a-zA-Z0-9\s,'-]+$/.test(value)
        );
      }
    )
    .trim(),
});

export const ProfessionalWorkHistoryModalSchema = yup.object({
  facilityName: yup
    .string()
    .required("Facility name is required")
    .max(50, "Max. length is 50")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z ']+$/, "Enter only characters in facility name")
    .trim(),
  facilityType: yup
    .string()
    .required("Facility type is required")
    .max(50, "Max. length is 50")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z ']+$/, "Enter only characters in facility type")
    .trim(),
  nurseToPatientRatio: yup
    .string()
    .optional()
    .nullable()
    .test(
      "requirements",
      "Nurse to patient ratio must be between 2 to 50 characters and can only contain letters,colons,number",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        return (
          value.length >= 2 &&
          value.length <= 50 &&
          /^[a-zA-Z0-9\s,:]+$/.test(value)
        );
      }
    )
    .trim(),
  facilityBeds: yup
    .string()
    .nullable()
    .test(
      "requirements",
      "Facility beds must be a number between 0 and 1000",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        const numericValue = parseInt(value);
        if (isNaN(numericValue)) {
          return false;
        }
        return numericValue >= 0 && numericValue <= 1000;
      }
    )
    .trim(),
  bedsInUnit: yup
    .string()
    .nullable()
    .test(
      "requirements",
      "Beds in unit must be a number between 0 and 1000",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        const numericValue = parseInt(value);
        if (isNaN(numericValue)) {
          return false;
        }
        return numericValue >= 0 && numericValue <= 1000;
      }
    )
    .trim(),
  additionalInfo: yup
    .string()
    .optional()
    .nullable()
    .test(
      "requirements",
      "Additional Info must be between 2 and 500 characters and can only contain letters, spaces, number and apostrophes",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        return (
          value.length >= 2 &&
          value.length <= 500 &&
          /^[a-zA-Z0-9\s,'-]+$/.test(value)
        );
      }
    )
    .trim(),
  positionHeld: yup
    .string()
    .required("Position held is required")
    .max(100, "Max. length is 100")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z0-9\s,]+$/, "Enter only characters and numbers")
    .trim(),
  agencyName: yup
    .string()
    .optional()
    .nullable()
    .test(
      "requirements",
      "Agency name must be between 2 to 50 characters and can only contain letters",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        return (
          value.length >= 2 && value.length <= 50 && /^[a-zA-Z']+$/.test(value)
        );
      }
    )
    .trim(),
  reasonForLeaving: yup
    .string()
    .optional()
    .nullable()
    .test(
      "requirements",
      "Reason for leaving must be between 2 and 500 characters and can only contain letters, spaces, number and apostrophes",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        return (
          value.length >= 2 &&
          value.length <= 500 &&
          /^[a-zA-Z0-9\s,'-]+$/.test(value)
        );
      }
    )
    .trim(),
});
