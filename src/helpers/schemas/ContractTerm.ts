import * as yup from "yup";

const contractSchema = yup.object().shape({
  contactName: yup
    .string()
    .required("Contact Name is required")
    .max(100, "Max. length is 100")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z' ]+$/, "Invalid characters in Contact Name")
    .trim(),

  contactNumber: yup
    .string()
    .required("Contact number is required")
    .matches(
      /^(\d{3}-\d{3}-\d{4}|\d{10})$/,
      "Enter a valid 10-digit mobile number"
    ),

  paymentTermId: yup.number().positive().integer(),

  workWeek: yup
    .string()
    .required("Work Week is required")
    .max(255, "Max. length is 255")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z, ' ]+$/, "Invalid characters in Work Week"),

  superAdminFee: yup
    .string()
    .required("Super Admin Fee is required")
    .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values")
    .min(0, "Super Admin Fee must be greater than or equal to 0"),

  nonBillableOrientation: yup
    .string()
    .required("Non Billable Orientation is required.")
    .max(255, "Max. length is 255")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z' ]+$/, "Invalid characters in Non Billable Orientation"),

  holidayMultiplier: yup
    .string()
    .required("Holiday Multiplier is required.")
    .typeError("Holiday Multiplier is required")
    // .positive("Holiday Multiplier must be a positive number.")
    .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values"),
  // .test(
  //   "is-number",
  //   "HolidayMultiplier must be an integer or a decimal number.",
  //   (value) => value !== null && !isNaN(value)
  // ),

  includedHolidays: yup
    .string()
    .required("Included Holidays is required")
    .max(255, "Max. length is 255")
    .min(2, "Min. length is 2")
    .matches(/^[a-zA-Z, ' ]+$/, "Invalid characters in Included Holidays"),

  holidayBillingRules: yup
    .string()
    .required(" Holiday Billing Rules is required.")
    .max(255, "Max. length is 255")
    .min(2, "Min. length is 2")
    .matches(
      /^[a-zA-Z' ]+$/,
      "Invalid characters in Included Holiday Billing Rules"
    ),

  overtimeMultiplier: yup
    .string()
    .typeError("Overtime Multiplier is required")
    // .positive("Overtime Multiplier must be a positive number")
    .required("Overtime Multiplier is required")
    .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values"),
  // .test(
  //   "is-number",
  //   "Overtime Multiplier must be an integer or a decimal number.",
  //   (value) => value !== null && !isNaN(value)
  // ),

  overtimeThreshold: yup
    .string()
    // .positive()
    .required("Overtime Threshold is required")
    // .integer("Overtime Threshold must be  Integer")
    .typeError("Overtime Threshold is required")
    .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values")
    .min(0, "Overtime Threshold must be greater than or equal to 0"),

  onCallRate: yup
    .string()
    .typeError("On-CallRate is required")
    // .positive("On-CallRate must be a positive number.")
    .required("On-CallRate is required.")
    .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values")
    .min(0, "On-CallRate must be greater than or equal to 0"),
  // .test(
  //   "is-number",
  //   "On-Call Rate must be an integer or a decimal number.",
  //   (value) => value !== null && !isNaN(value)
  // ),

  doubletimeMultiplier: yup
    .string()
    .required("Double Time Multiplier is required.")
    .typeError("Double Time Multiplier is required")
    .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values")
    .min(0, "Double Time Multiplier must be greater than or equal to 0"),
  // .positive("Double Time Multiplier must be a positive number.")
  // .test(
  //   "is-number",
  //   "Double Time Multiplier must be an integer or a decimal number.",
  //   (value) => value !== null && !isNaN(value)
  // ),

  callBackMultiplier: yup
    .string()
    .typeError("Call Back Multiplier is required")
    // .positive("Call Back Multiplier must be a positive number.")
    .required("Call Back Multiplier is required.")
    .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values")
    .min(0, "Call Back Multiplier must be greater than or equal to 0"),
  // .test(
  //   "is-number",
  //   " Call Back Multiplier must be an integer or a decimal number.",
  //   (value) => value !== null && !isNaN(value)
  // ),

  timeRoundingGuidelines: yup
    .string()
    .required(" Time Rounding Guidelines is required")
    .max(255, "Max. length is 255")
    .min(2, "Min. length is 2")
    .matches(
      /^[a-zA-Z' ]+$/,
      "Invalid characters in Included Time Rounding Guidelines"
    ),

  specialBillingDetails: yup
    .string()
    .required(" Special Billing Details is required")
    .max(255, "Max. length is 255")
    .min(2, "Min. length is 2")
    .matches(
      /^[a-zA-Z' ]+$/,
      "Invalid characters in Included Special Billing Details"
    ),

  gauranteedHrs: yup
    .string()
    .required("Guaranteed Hours is required")
    // .integer("Guaranteed Hours must be  Integer")
    .typeError("Guaranteed Hours is required")
    .matches(/^[0-9]+$/, "Guaranteed Hours must contain only positive numbers")
    .min(0, "Guaranteed Hours must be greater than or equal to 0"),

  timekeepingProcess: yup
    .string()
    .required(" Time Keeping Process are required.")
    .max(255, "Max. length is 255")
    .min(2, "Min. length is 2")
    .matches(
      /^[a-zA-Z' ]+$/,
      "Invalid characters in Included Time Keeping Process"
    ),

  missedPunchPayrollProcess: yup
    .string()
    .max(255, "Max. length is 255")
    .min(2, "Min. length is 2"),

  costCenters: yup
    .string()
    .max(255, "Max. length is 255")
    .min(2, "Min. length is 2"),

  kronosTimeCodes: yup
    .string()
    .max(255, "Max. length is 255")
    .min(2, "Min. length is 2"),
});

export default contractSchema;
