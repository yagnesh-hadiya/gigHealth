import * as yup from "yup";

export const ServiceExtensionSchema = yup.object({
  costCenter: yup
    .string()
    .optional()
    .matches(/.{2,}/, {
      excludeEmptyString: true,
      message: "Must be 2 characters",
    })
    .test(
      "is-optional",
      "Cost Center can be of type string.",
      (value: string | undefined): boolean => {
        if (
          value !== null &&
          value !== undefined &&
          typeof value === "string"
        ) {
          return true;
        }
        return false;
      }
    ),
  totalHrsWeekly: yup
    .number()
    .typeError("Total Hours is required and it can be of type number")
    .min(0, "Total Hours must be greater than or equal to 0")
    .test(
      "is-decimal",
      "Invalid Total Hours, enter only number and decimal values",
      (value: number | undefined): boolean => {
        if (
          value !== null &&
          value !== undefined &&
          typeof value === "number"
        ) {
          const stringValue: string = value.toString();
          return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
        }
        return false;
      }
    ),
  regularHrs: yup
    .number()
    .typeError("Regular Hours is required and it can be of type number")
    .min(0, "Regular Hours must be greater than or equal to 0")
    .test(
      "is-decimal",
      "Invalid Regular Hours, enter only number and decimal values",
      (value: number | undefined): boolean => {
        if (
          value !== null &&
          value !== undefined &&
          typeof value === "number"
        ) {
          const stringValue: string = value.toString();
          return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
        }
        return false;
      }
    ),
  overtimeHrs: yup
    .number()
    .typeError("Overtime Hours is required and it can be of type number")
    .min(0, "Overtime Hours must be greater than or equal to 0")
    .test(
      "is-decimal",
      "Invalid Overtime Hours, enter only number and decimal values",
      (value: number | undefined): boolean => {
        if (
          value !== null &&
          value !== undefined &&
          typeof value === "number"
        ) {
          const stringValue: string = value.toString();
          return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
        }
        return false;
      }
    ),
  gauranteedHours: yup
    .number()
    .typeError("Guaranteed Hours is required and it can be of type number")
    .min(0, "Guaranteed Hours must be greater than or equal to 0")
    .test(
      "is-decimal",
      "Invalid Guaranteed Hours, enter only number and decimal values",
      (value: number | undefined): boolean => {
        if (
          value !== null &&
          value !== undefined &&
          typeof value === "number"
        ) {
          const stringValue: string = value.toString();
          return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
        }
        return false;
      }
    ),
  notes: yup
    .string()
    .optional()
    .test(
      "is-optional",
      "Notes can be of type string",
      (value: string | undefined): boolean => {
        if (
          value !== null &&
          value !== undefined &&
          typeof value === "string"
        ) {
          return true;
        }
        return false;
      }
    ),
  totalDaysOnAssignment: yup
    .number()
    .typeError(
      "Total Days On Assignment is required and it can be of type number"
    )
    .min(0, "Total Days On Assignment must be greater than or equal to 0")
    .test(
      "is-decimal",
      "Invalid Total Days On Assignment, enter only number and decimal values",
      (value: number | undefined): boolean => {
        if (
          value !== null &&
          value !== undefined &&
          typeof value === "number"
        ) {
          const stringValue: string = value.toString();
          return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
        }
        return false;
      }
    ),
  payDetails: yup.object({
    regularRate: yup
      .number()
      .typeError("Regular Rate is required and it can be of type number")
      .min(0, "Regular Rate must be greater than or equal to 0")
      .test(
        "is-decimal",
        "Invalid Regular Rate, enter only number and decimal values",
        (value: number | undefined): boolean => {
          if (
            value !== null &&
            value !== undefined &&
            typeof value === "number"
          ) {
            const stringValue: string = value.toString();
            return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
          }
          return false;
        }
      ),
    overTimeRate: yup
      .number()
      .typeError("Overtime Rate is required and it can be of type number")
      .min(0, "Overtime Rate must be greater than or equal to 0")
      .test(
        "is-decimal",
        "Invalid Overtime Rate, enter only number and decimal values",
        (value: number | undefined): boolean => {
          if (
            value !== null &&
            value !== undefined &&
            typeof value === "number"
          ) {
            const stringValue: string = value.toString();
            return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
          }
          return false;
        }
      ),
    doubleTimeRate: yup
      .string()
      .required("Double time rate is required")
      .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values")
      .min(0, "Double time rate must be greater than or equal to 0"),
    holidayRate: yup
      .number()
      .typeError("Holiday Rate is required and it can be of type number")
      .min(0, "Holiday Rate must be greater than or equal to 0")
      .test(
        "is-decimal",
        "Invalid Holiday Rate, enter only number and decimal values",
        (value: number | undefined): boolean => {
          if (
            value !== null &&
            value !== undefined &&
            typeof value === "number"
          ) {
            const stringValue: string = value.toString();
            return /^(?!-)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
          }
          return false;
        }
      ),
    chargeRate: yup
      .number()
      .typeError("Charge Rate is required and it can be of type number")
      .min(0, "Charge Rate must be greater than or equal to 0")
      .test(
        "is-decimal",
        "Invalid Charge Rate, enter only number and decimal values",
        (value: number | undefined): boolean => {
          if (
            value !== null &&
            value !== undefined &&
            typeof value === "number"
          ) {
            const stringValue: string = value.toString();
            return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
          }
          return false;
        }
      ),

    onCallRate: yup
      .number()
      .typeError("On Call Rate is required and it can be of type number")
      .min(0, "On Call Rate must be greater than or equal to 0")
      .test(
        "is-decimal",
        "Invalid On Call Rate, enter only number and decimal values",
        (value: number | undefined): boolean => {
          if (
            value !== null &&
            value !== undefined &&
            typeof value === "number"
          ) {
            const stringValue: string = value.toString();
            return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
          }
          return false;
        }
      ),
    housingStipend: yup
      .number()
      .typeError("Housing Stipend is required and it can be of type number")
      .min(0, "Housing Stipend must be greater than or equal to 0")
      .test(
        "is-decimal",
        "Invalid Housing Stipend, enter only number and decimal values",
        (value: number | undefined): boolean => {
          if (
            value !== null &&
            value !== undefined &&
            typeof value === "number"
          ) {
            const stringValue: string = value.toString();
            return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
          }
          return false;
        }
      ),
    mealsAndIncidentals: yup
      .number()
      .typeError(
        "Meals and Incidentals is required and it can be of type number"
      )
      .min(0, "Meals and Incidentals must be greater than or equal to 0")
      .test(
        "is-decimal",
        "Invalid Meals and Incidentals, enter only number and decimal values",
        (value: number | undefined): boolean => {
          if (
            value !== null &&
            value !== undefined &&
            typeof value === "number"
          ) {
            const stringValue: string = value.toString();
            return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
          }
          return false;
        }
      ),

    callBackRate: yup
      .number()
      .typeError("Call Back Rate is required and it can be of type number")
      .min(0, "Call Back Rate must be greater than or equal to 0")
      .test(
        "is-decimal",
        "Invalid Call Back Rate, enter only number and decimal values",
        (value: number | undefined): boolean => {
          if (
            value !== null &&
            value !== undefined &&
            typeof value === "number"
          ) {
            const stringValue: string = value.toString();
            return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
          }
          return false;
        }
      ),
  }),

  billingDetails: yup.object({
    billRate: yup
      .number()
      .typeError("Bill Rate is required and it can be of type number")
      .min(0, "Bill Rate must be greater than or equal to 0")
      .test(
        "is-decimal",
        "Invalid Bill Rate, enter only number and decimal values",
        (value: number | undefined): boolean => {
          if (
            value !== null &&
            value !== undefined &&
            typeof value === "number"
          ) {
            const stringValue: string = value.toString();
            return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
          }
          return false;
        }
      ),
    overTimeBillRate: yup
      .number()
      .typeError("Overtime Bill Rate is required and it can be of type number")
      .min(0, "Overtime Bill Rate must be greater than or equal to 0")
      .test(
        "is-decimal",
        "Invalid Overtime Bill Rate, enter only number and decimal values",
        (value: number | undefined): boolean => {
          if (
            value !== null &&
            value !== undefined &&
            typeof value === "number"
          ) {
            const stringValue: string = value.toString();
            return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
          }
          return false;
        }
      ),
    doubleTimeBillRate: yup
      .string()
      .required("Double time bill rate is required")
      .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values")
      .min(0, "Double time bill rate must be greater than or equal to 0"),
    holidayBillRate: yup
      .number()
      .typeError("Holiday Bill Rate is required and it can be of type number")
      .min(0, "Holiday Bill Rate must be greater than or equal to 0")
      .test(
        "is-decimal",
        "Invalid Holiday Bill Rate, enter only number and decimal values",
        (value: number | undefined): boolean => {
          if (
            value !== null &&
            value !== undefined &&
            typeof value === "number"
          ) {
            const stringValue: string = value.toString();
            return /^(?!-)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
          }
          return false;
        }
      ),

    chargeBillRate: yup
      .number()
      .typeError("Charge Bill Rate is required and it can be of type number")
      .min(0, "Charge Bill Rate must be greater than or equal to 0")
      .test(
        "is-decimal",
        "Invalid Charge Bill Rate, enter only number and decimal values",
        (value: number | undefined): boolean => {
          if (
            value !== null &&
            value !== undefined &&
            typeof value === "number"
          ) {
            const stringValue: string = value.toString();
            return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
          }
          return false;
        }
      ),

    onCallBillRate: yup
      .number()
      .typeError("On Call Bill Rate is required and it can be of type number")
      .min(0, "On Call Bill Rate must be greater than or equal to 0")
      .test(
        "is-decimal",
        "Invalid On Call Bill Rate, enter only number and decimal values",
        (value: number | undefined): boolean => {
          if (
            value !== null &&
            value !== undefined &&
            typeof value === "number"
          ) {
            const stringValue: string = value.toString();
            return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
          }
          return false;
        }
      ),

    callBackBillRate: yup
      .number()
      .typeError("Call Back Bill Rate is required and it can be of type number")
      .min(0, "Call Back Bill Rate must be greater than or equal to 0")
      .test(
        "is-decimal",
        "Invalid Call Back Bill Rate, enter only number and decimal values",
        (value: number | undefined): boolean => {
          if (
            value !== null &&
            value !== undefined &&
            typeof value === "number"
          ) {
            const stringValue: string = value.toString();
            return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
          }
          return false;
        }
      ),
  }),
});
