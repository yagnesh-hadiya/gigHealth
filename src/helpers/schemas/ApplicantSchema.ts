import { number, object, string } from "yup";

export const SubmitApplicantSchema = object({
  unit: string()
    .required("Unit is required")
    .min(2, "Unit must be greater than or equal to 2")
    .max(255, "Unit must be at most 255 characters")
    .typeError("Unit is required"),
  totalYearsOfExperience: number()
    .required("Total years of experience is required")
    .typeError("Total years of experience is required"),
  totalYearsOfExperienceInUnit: number()
    .required("Total years of experience in unit is required")
    .typeError("Total years of experience in unit is required"),
});

export const OfferFormSchema = object({
  unit: string()
    .required("Unit is required")
    .min(2, "Unit must be greater than or equal to 2")
    .max(255, "Unit must be at most 255 characters")
    .typeError("Unit is required"),
  regularHrs: number()
    .required("Regular hours is required")
    .typeError("Regular hours is required"),
  overtimeHrs: number()
    .required("Overtime hours is required")
    .typeError("Overtime hours is required"),
  totalHrsWeekly: number()
    .required("Total hours weekly is required")
    .typeError("Total hours weekly is required"),
  totalDaysOnAssignment: number()
    .required("Total days on assignment is required")
    .typeError("Total days on assignment is required"),
  gauranteedHours: number()
    .required("Guaranteed hours is required")
    .typeError("Guaranteed hours is required"),
  notes: string(),
  costCenter: string()
    .optional()
    .nullable()
    .test(
      "costCenter",
      "Invalid Cost Center.Cost Center should be between 2-255 characters",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        return (
          value.length >= 2 &&
          value.length <= 255 &&
          /^[a-zA-Z0-9 ']+$/.test(value)
        );
      }
    ),
  reqId: string()
    .optional()
    .nullable()
    .test(
      "costCenter",
      "Invalid Req Id. Req Id should be between 2-255 characters",
      (value: string | null | undefined) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        return (
          value.length >= 2 &&
          value.length <= 255 &&
          /^[a-zA-Z0-9 ']+$/.test(value)
        );
      }
    ),
  payDetails: object({
    regularRate: number()
      .required("Regular rate is required")
      .typeError("Regular rate is required"),
    overTimeRate: number()
      .required("Overtime rate is required")
      .typeError("Overtime rate is required"),
    doubleTimeRate: number()
      .required("Double time rate is required")
      .typeError("Double time rate is required"),
    holidayRate: number()
      .required("Holiday rate is required")
      .typeError("Holiday rate is required"),
    chargeRate: number()
      .required("Charge is required")
      .typeError("Charge is required"),
    onCallRate: number()
      .required("On call rate is required")
      .typeError("On call rate is required"),
    callBackRate: number()
      .required("Call back rate is required")
      .typeError("Call back rate is required"),
    travelReimbursement: number()
      .required("TravelReimbursement rate is required")
      .typeError("TravelReimbursement rate is required"),
    mealsAndIncidentals: number()
      .required("Meals and incidentals is required")
      .typeError("Meals and incidentals is required"),
    housingStipend: number()
      .required("Housing stipend is required")
      .typeError("Housing stipend is required"),
  }),
  billingDetails: object({
    billRate: number()
      .required("Bill rate is required")
      .typeError("Bill rate is required"),
    overTimeBillRate: number()
      .required("Overtime bill rate is required")
      .typeError("Overtime bill rate is required"),
    doubleTimeBillRate: number()
      .required("Double time bill rate is required")
      .typeError("Double time bill rate is required"),
    holidayBillRate: number()
      .required("Holiday bill rate is required")
      .typeError("Holiday bill rate is required"),
    chargeBillRate: number()
      .required("Charge bill rate is required")
      .typeError("Charge bill rate is required"),
    onCallBillRate: number()
      .required("On call bill rate is required")
      .typeError("On call bill rate is required"),
    callBackBillRate: number()
      .required("Call back bill rate is required")
      .typeError("Call back bill rate is required"),
  }),
});
