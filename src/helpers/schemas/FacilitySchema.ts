import { object, string } from "yup";

export const addFacilitySchema = object({
  name: string()
    .required("Facility Name is required")
    .max(50, "Max. length is 50")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z' ]+$/, "Invalid characters in Facility Name")
    .trim(),
  totalTalent: string()
    .required("Total Talent is required")
    .matches(/^[0-9]+$/, "Total Talent must contain only positive numbers")
    .min(0, "Total Talent must be greater than or equal to 0"),
  totalBedCount: string()
    .required("Total Bed Count is required")
    .matches(/^[0-9]+$/, "Total Bed Count must contain only positive numbers")
    .min(0, "Total Bed Count must be greater than or equal to 0"),
  hospitalPhone: string()
    .required("Hospital Phone is required")
    .matches(
      /^(\d{3}-\d{3}-\d{4}|\d{10})$/,
      "Enter a valid 10-digit Hospital Phone Number"
    ),
  address: string()
    .required("Address is required")
    .min(2, "Min. Length is 2")
    .max(100, "Max. length is 150")
    .trim(),
  internalNotes: string()
    .optional()
    .nullable()
    .test(
      "internalNotes",
      "Internal Notes must be between 2 and 500 characters and can only contain letters, spaces, number and apostrophes",
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
  requirements: string()
    .optional()
    .nullable()
    .test(
      "requirements",
      "Requirements must be between 2 and 500 characters and can only contain letters, spaces, number and apostrophes",
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
  primaryContact: object({
    firstName: string()
      .optional()
      .nullable()
      .test(
        "firstName",
        "Invalid First Name. Name should be between 2-50 characters",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return (
            value.length >= 2 &&
            value.length <= 50 &&
            /^[a-zA-Z']+$/.test(value)
          );
        }
      )
      .trim(),
    lastName: string()
      .optional()
      .nullable()
      .test(
        "lastName",
        "Invalid Last Name. Name should be between 2-50 characters",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return (
            value.length >= 2 &&
            value.length <= 50 &&
            /^[a-zA-Z']+$/.test(value)
          );
        }
      )
      .trim(),
    title: string()
      .optional()
      .nullable()
      .test(
        "title",
        "Invalid Title. Title should be between 2-50 characters",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return (
            value.length >= 2 &&
            value.length <= 50 &&
            /^[a-zA-Z ']+$/.test(value)
          );
        }
      )
      .trim(),
    email: string()
      .optional()
      .nullable()
      .test(
        "email",
        "Enter a Valid Email",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return (
            value.length >= 2 &&
            /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4}$/.test(value)
          );
        }
      )
      .trim(),
    mobile: string()
      .optional()
      .nullable()
      .test(
        "mobile",
        "Enter a Valid Phone Number",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return /^(\d{3}-\d{3}-\d{4}|\d{10})$/.test(value);
        }
      ),
  }),
  fax: string()
    .optional()
    .nullable()
    .test(
      "fax",
      "Enter a Valid Fax",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        if (value.length >= 10 && value.length <= 15 && /^\d+$/.test(value)) {
          return true;
        }
        return false;
      }
    ),
  secondaryContact: object({
    firstName: string()
      .optional()
      .nullable()
      .test(
        "firstName",
        "Invalid First Name. Name should be between 2-50 characters",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return (
            value.length >= 2 &&
            value.length <= 50 &&
            /^[a-zA-Z']+$/.test(value)
          );
        }
      )
      .trim(),
    lastName: string()
      .optional()
      .nullable()
      .test(
        "lastName",
        "Invalid Last Name. Name should be between 2-50 characters",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return (
            value.length >= 2 &&
            value.length <= 50 &&
            /^[a-zA-Z']+$/.test(value)
          );
        }
      )
      .trim(),
    title: string()
      .optional()
      .nullable()
      .test(
        "title",
        "Invalid Title. Title should be between 2-50 characters",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return (
            value.length >= 2 &&
            value.length <= 50 &&
            /^[a-zA-Z ']+$/.test(value)
          );
        }
      )
      .trim(),
    email: string()
      .optional()
      .nullable()
      .test(
        "email",
        "Enter a Valid Email",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return (
            value.length >= 2 &&
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          );
        }
      )
      .trim(),
    mobile: string()
      .optional()
      .nullable()
      .test(
        "mobile",
        "Enter a Valid Phone Number",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return /^(\d{3}-\d{3}-\d{4}|\d{10})$/.test(value);
        }
      ),
    fax: string()
      .optional()
      .nullable()
      .test(
        "fax",
        "Enter a Valid Fax",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          if (value.length >= 10 && value.length <= 15 && /^\d+$/.test(value)) {
            return true;
          }
          return false;
        }
      ),
  }),
});

export const editFacilitySchema = object({
  name: string()
    .required("Facility Name is required")
    .max(50, "Max. length is 50")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z' ]+$/, "Invalid characters in Facility Name")
    .trim(),
  totalTalent: string()
    .required("Total Talent is required")
    .matches(/^[0-9]+$/, "Total Talent must contain only positive numbers")
    .min(0, "Total Talent must be greater than or equal to 0"),
  totalBedCount: string()
    .required("Total Bed Count is required")
    .matches(/^[0-9]+$/, "Total Bed Count must contain only positive numbers")
    .min(0, "Total Bed Count must be greater than or equal to 0"),
  hospitalPhone: string()
    .required("Hospital Phone is required")
    .matches(
      /^(\d{3}-\d{3}-\d{4}|\d{10})$/,
      "Enter a valid 10-digit Hospital Phone Number"
    ),
  address: string()
    .required("Address is required")
    .min(2, "Min. Length is 2")
    .max(100, "Max. length is 150")
    .trim(),
  internalNotes: string()
    .optional()
    .nullable()
    .test(
      "internalNotes",
      "Internal Notes must be between 2 and 500 characters and can only contain letters, spaces, number and apostrophes",
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
  requirements: string()
    .optional()
    .nullable()
    .test(
      "requirements",
      "Requirements must be between 2 and 500 characters and can only contain letters, spaces, number and apostrophes",
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
  primaryContact: object({
    firstName: string()
      .optional()
      .nullable()
      .test(
        "firstName",
        "Invalid First Name. Name should be between 2-50 characters",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return (
            value.length >= 2 &&
            value.length <= 50 &&
            /^[a-zA-Z']+$/.test(value)
          );
        }
      )
      .trim(),
    lastName: string()
      .optional()
      .nullable()
      .test(
        "lastName",
        "Invalid Last Name. Name should be between 2-50 characters",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return (
            value.length >= 2 &&
            value.length <= 50 &&
            /^[a-zA-Z']+$/.test(value)
          );
        }
      )
      .trim(),
    title: string()
      .optional()
      .nullable()
      .test(
        "title",
        "Invalid Title. Title should be between 2-50 characters",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return (
            value.length >= 2 &&
            value.length <= 50 &&
            /^[a-zA-Z ']+$/.test(value)
          );
        }
      )
      .trim(),
    email: string()
      .optional()
      .nullable()
      .test(
        "email",
        "Enter a Valid Email",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return (
            value.length >= 2 &&
            /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4}$/.test(value)
          );
        }
      )
      .trim(),
    mobile: string()
      .optional()
      .nullable()
      .test(
        "mobile",
        "Enter a Valid Phone Number",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return /^(\d{3}-\d{3}-\d{4}|\d{10})$/.test(value);
        }
      ),
    fax: string()
      .optional()
      .nullable()
      .test(
        "fax",
        "Enter a Valid Fax",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          if (value.length >= 10 && value.length <= 15 && /^\d+$/.test(value)) {
            return true;
          }
          return false;
        }
      ),
  }),
  secondaryContact: object({
    firstName: string()
      .optional()
      .nullable()
      .test(
        "firstName",
        "Invalid First Name. Name should be between 2-50 characters",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return (
            value.length >= 2 &&
            value.length <= 50 &&
            /^[a-zA-Z']+$/.test(value)
          );
        }
      )
      .trim(),
    lastName: string()
      .optional()
      .nullable()
      .test(
        "lastName",
        "Invalid Last Name. Name should be between 2-50 characters",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return (
            value.length >= 2 &&
            value.length <= 50 &&
            /^[a-zA-Z']+$/.test(value)
          );
        }
      )
      .trim(),
    title: string()
      .optional()
      .nullable()
      .test(
        "title",
        "Invalid Title. Title should be between 2-50 characters",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return (
            value.length >= 2 &&
            value.length <= 50 &&
            /^[a-zA-Z ']+$/.test(value)
          );
        }
      )
      .trim(),
    email: string()
      .optional()
      .nullable()
      .test(
        "email",
        "Enter a Valid Email",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return (
            value.length >= 2 &&
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          );
        }
      )
      .trim(),
    mobile: string()
      .optional()
      .nullable()
      .test(
        "mobile",
        "Enter a Valid Phone Number",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return /^(\d{3}-\d{3}-\d{4}|\d{10})$/.test(value);
        }
      ),
    fax: string()
      .optional()
      .nullable()
      .test(
        "fax",
        "Enter a Valid Fax",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          if (value.length >= 10 && value.length <= 15 && /^\d+$/.test(value)) {
            return true;
          }
          return false;
        }
      ),
  }),
});
