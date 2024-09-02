import * as yup from "yup";

export const ActivityModalSchema = yup.object({
  notes: yup
    .string()
    .required("Notes is required")
    .min(2, "Min length is 2")
    .max(2000, "Max length is 2000")
    .matches(/^[a-zA-Z0-9\s,'-]+$/, "Pleasa enter only Alpha numeric values")
    .trim(),
});

export const EmailModalSchema = yup.object({
  toEmail: yup
    .string()
    .required("Email is required")
    .min(2, "Min length is 2")
    .max(50, "Max length is 50")
    .matches(
      /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4}$/,
      "Please enter a proper email"
    )
    .trim(),

  subject: yup
    .string()
    .required("Subject is required")
    .min(2, "Min length is 2")
    .max(100, "Max length is 100")
    .matches(
      /^[a-zA-Z0-9 ]+$/,
      "Only letters and numbers are allowed in the Subject"
    )
    .trim(),
});
