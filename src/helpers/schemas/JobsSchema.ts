import * as yup from "yup";

export const JobsSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be at most 100 characters")
    .transform((value) => (value ? value.toLowerCase().trim() : value))
    .test(
      "is-string",
      "Invalid Title enter only string ",
      (value: string): boolean => {
        if (
          value !== null &&
          value !== undefined &&
          typeof value === "string"
        ) {
          const stringValue: string = value.toString();
          return /^[a-zA-Z ]+$/.test(stringValue);
        }
        return false;
      }
    ),
  billRate: yup
    .string()
    .required("Bill Rate is required")
    // .typeError("BillRate is required")
    .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values")
    .min(0, "BillRate must be greater than or equal to 0"),
  // .transform((value) => {
  //     return typeof value === 'string' ? parsenumber(value) : value;
  // })
  // .test(
  //   "is-decimal",
  //   "Invalid Bill rate enter only number and decimal values",
  //   (value: number | undefined): boolean => {
  //     if (
  //       value !== null &&
  //       value !== undefined &&
  //       typeof value === "number"
  //     ) {
  //       const stringValue: string = value.toString();
  //       return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
  //     }
  //     return false;
  //   }
  // ),
  minYearsOfExperience: yup
    .string()
    .required("Min Years Of Experience is required")
    // .typeError("Min Years Of Experience is required")
    .matches(/^\d+$/, "Enter only positive numbers")
    .min(0, "Min Years Of Experience must be greater than or equal to 0"),
  // .test(
  //   "is-decimal",
  //   "Invalid MinYearsOfExperience enter only number and decimal values",
  //   (value: number | undefined): boolean => {
  //     if (
  //       value !== null &&
  //       value !== undefined &&
  //       typeof value === "number"
  //     ) {
  //       const stringValue = value.toString();
  //       return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
  //     }
  //     return false;
  //   }
  // ),
  // contract: yup
  //   .string()
  //   .required("Contract is required")
  //   .min(2, "Contract must be at least 2 characters")
  //   .max(100, "Contract must be at most 100 characters")
  //   .transform((value) => (value ? value.toLowerCase().trim() : value))
  //   .test(
  //     "is-alphabetic",
  //     "Contract must contain only alphabetic characters",
  //     (value: string): boolean => {
  //       if (
  //         value !== null &&
  //         value !== undefined &&
  //         typeof value === "string"
  //       ) {
  //         const stringValue: string = value.toString();
  //         return /^[a-zA-Z ]+$/.test(stringValue);
  //       }
  //       return false;
  //     }
  //   ),
  jobType: yup
    .string()
    .required("Job Type is required")
    .min(2, "Job Type must be at least 2 characters")
    .max(100, "Job Type must be at most 100 characters")
    .transform((value) => (value ? value.toLowerCase().trim() : value))
    .test(
      "is-alphabetic",
      "Job Type must contain only alphabetic characters",
      (value: string): boolean => {
        if (
          value !== null &&
          value !== undefined &&
          typeof value === "string"
        ) {
          const stringValue = value.toString();
          return /^[a-zA-Z ]+$/.test(stringValue);
        }
        return false;
      }
    ),
  noOfOpenings: yup
    .string()
    .required("Number of Openings is required")
    // .typeError("Number of Openings is required and it should be of type number")
    .matches(/^\d+$/, "Enter only positive numbers")
    .test(
      "is-not-zero",
      "Number of Openings must be greater than 0",
      (value) => {
        return parseInt(value) !== 0;
      }
    )
    .min(1, "Number of Openings must be greater than or equal to 1"),
  location: yup
    .string()
    .required("Location is required")
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be at most 100 characters")
    .transform((value) => (value ? value.toLowerCase().trim() : value))
    .test(
      "is-alphabetic",
      "Location must contain only alphabetic characters",
      (value: string): boolean => {
        if (
          value !== null &&
          value !== undefined &&
          typeof value === "string"
        ) {
          const stringValue: string = value.toString();
          return /^[a-zA-Z ]+$/.test(stringValue);
        }
        return false;
      }
    ),
  deptUnit: yup
    .string()
    .required("Department Unit is required")
    .matches(
      /^[a-zA-Z ]+$/,
      "Department Unit must contain only letters and spaces"
    )
    .min(2, "Department Unit must be greater than or equal to 2")
    .max(255, "Department Unit must be at most 255 characters"),
  // description: yup.string()
  //     .required('Description is required')
  //     .min(2, 'Description must be at least 2 characters')
  //     .max(10000, 'Description must be at most 10000 characters')
  //     .transform((value) => (value ? value.trim() : value))
  //     .test('is-alphabetic', 'Description must contain only alphabetic characters', (value) => {
  //         if (value !== null && value !== undefined && typeof value === 'string') {
  //             const stringValue = value.toString();
  //             return /^[a-zA-Z]+$/.test(stringValue);
  //         }
  //         return false;
  //     }),
  // internalJobNotes: yup
  //   .string()
  //   .optional()
  //   .nullable()
  //   .test(
  //     "internalNotes",
  //     "Internal Notes must be between 2 and 500 characters and can only contain letters, spaces, number and apostrophes",
  //     (value: string | null | undefined) => {
  //       if (value === undefined || value === null || value === "") {
  //         return true;
  //       }
  //       return (
  //         value.length >= 2 &&
  //         value.length <= 500 &&
  //         /^[a-zA-Z0-9\s,'-]+$/.test(value)
  //       );
  //     }
  //   )
  //   .trim(),
  contractDetails: yup.object({
    noOfShifts: yup
      .string()
      .required("Number of Shifts is required")
      // .typeError("Number of Shifts is required")
      .matches(/^\d+$/, "Enter only positive numbers")
      .min(1, "Number of Shifts must be greater than or equal to 1"),
    contractLength: yup
      .string()
      .required("Contract Length is required")
      .matches(/^\d+$/, "Enter only positive numbers")
      .min(1, "Contract Length must be greater than or equal to 1"),
    hrsPerWeek: yup
      .string()
      .required("Reqular Hours is required")
      .matches(/^\d+$/, "Enter only positive numbers")
      .min(1, "Reqular Hours must be greater than or equal to 1"),
    // shiftTime: yup.string()
    //     .required('Shift Time is required')
    //     .min(3, 'Shift Time must be at least 3 characters')
    //     .transform((value) => (value ? value.toLowerCase().trim() : value))
    //     .test('is-valid-shift', 'Invalid Shift Time, enter only "day," "mid," or "night"', (value) => {
    //         if (value !== null && value !== undefined && typeof value === 'string') {
    //             const stringValue: string = value.trim().toLowerCase();
    //             return ['day', 'night', 'mid'].includes(stringValue);
    //         }
    //         return false;
    //     }),
    overtimeHrsPerWeek: yup
      .string()
      .optional()
      .nullable()
      .test(
        "mobile",
        "Enter only positive numbers",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return /^\d+$/.test(value);
        }
      ),
    daysOnAssignment: yup
      .string()
      .required("Days on Assignment is required")
      // .integer("Days on Assignment must be an integer")
      // .typeError("Days on Assignment is required")
      .matches(/^\d+$/, "Enter only positive numbers")
      .min(1, "Days on Assignment must be greater than or equal to 1"),
  }),

  pay: yup.object({
    hourlyRate: yup
      .string()
      .required("Hourly Rate is required")
      .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values")
      .min(0, "Hourly Rate must be greater than or equal to 0"),
    // .test(
    //   "is-decimal",
    //   "Invalid Hourly Rate, enter only number and decimal values",
    //   (value: number | undefined): boolean => {
    //     if (
    //       value !== null &&
    //       value !== undefined &&
    //       typeof value === "number"
    //     ) {
    //       const stringValue: string = value.toString();
    //       return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
    //     }
    //     return false;
    //   }
    // ),
    housingStipend: yup
      .string()
      .required("Housing Stipend is required")
      .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values")
      .min(0, "Housing Stipend must be greater than or equal to 0"),
    // .test(
    //   "is-decimal",
    //   "Invalid Housing Stipend, enter only number and decimal values",
    //   (value: number | undefined): boolean => {
    //     if (
    //       value !== null &&
    //       value !== undefined &&
    //       typeof value === "number"
    //     ) {
    //       const stringValue: string = value.toString();
    //       return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
    //     }
    //     return false;
    //   }
    // ),
    mealsAndIncidentals: yup
      .string()
      .required("Meals and Incidentals is required")
      .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values")
      .min(0, "Meals and Incidentals must be greater than or equal to 0"),

    // .test(
    //   "is-decimal",
    //   "Invalid Meals and Incidentals, enter only number and decimal values",
    //   (value: number | undefined): boolean => {
    //     if (
    //       value !== null &&
    //       value !== undefined &&
    //       typeof value === "number"
    //     ) {
    //       const stringValue: string = value.toString();
    //       return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
    //     }
    //     return false;
    //   }
    // ),
    overtimeRate: yup
      .string()
      .required("Overtime Rate is required")
      .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values")
      .min(0, "Overtime Rate must be greater than or equal to 0"),
    // .test(
    //   "is-decimal",
    //   "Invalid Overtime Rate, enter only number and decimal values",
    //   (value: number | undefined): boolean => {
    //     if (
    //       value !== null &&
    //       value !== undefined &&
    //       typeof value === "number"
    //     ) {
    //       const stringValue: string = value.toString();
    //       return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
    //     }
    //     return false;
    //   }
    // ),
    onCallRate: yup
      .string()
      .required("On Call Rate is required")
      .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values")
      .min(0, "On Call Rate must be greater than or equal to 0"),
    // .test(
    //   "is-decimal",
    //   "Invalid On Call Rate, enter only number and decimal values",
    //   (value: number | undefined): boolean => {
    //     if (
    //       value !== null &&
    //       value !== undefined &&
    //       typeof value === "number"
    //     ) {
    //       const stringValue: string = value.toString();
    //       return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
    //     }
    //     return false;
    //   }
    // ),
    holidayRate: yup
      .string()
      .required("Holiday Rate is required")
      .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values")
      .min(0, "Holiday Rate must be greater than or equal to 0"),
    // .test(
    //   "is-decimal",
    //   "Invalid Holiday Rate, enter only number and decimal values",
    //   (value: number | undefined): boolean => {
    //     if (
    //       value !== null &&
    //       value !== undefined &&
    //       typeof value === "number"
    //     ) {
    //       const stringValue: string = value.toString();
    //       return /^(?!-)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
    //     }
    //     return false;
    //   }
    // ),
    callBackRate: yup
      .string()
      .required("Call Back Rate is required")
      .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values")
      .min(0, "Call Back Rate must be greater than or equal to 0"),
    // .test(
    //   "is-decimal",
    //   "Invalid Call Back Rate, enter only number and decimal values",
    //   (value: number | undefined): boolean => {
    //     if (
    //       value !== null &&
    //       value !== undefined &&
    //       typeof value === "number"
    //     ) {
    //       const stringValue: string = value.toString();
    //       return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
    //     }
    //     return false;
    //   }
    // ),
    travelReimbursement: yup
      .string()
      .required("Travel Reimbursment is required")
      .matches(/^\d+(\.\d+)?$/, "Enter only number and decimal values")
      .min(0, "Travel Reimbursment must be greater than or equal to 0"),
    // .test(
    //   "is-decimal",
    //   "Invalid Travel Reimbursment, enter only number and decimal values",
    //   (value: number | undefined): boolean => {
    //     if (
    //       value !== null &&
    //       value !== undefined &&
    //       typeof value === "number"
    //     ) {
    //       const stringValue: string = value.toString();
    //       return /^(?!^\+)[0-9]+(?:\.[0-9]+)?$/.test(stringValue);
    //     }
    //     return false;
    //   }
    // ),
    compensationComments: yup
      .string()
      .optional()
      .nullable()
      .test(
        "address",
        "Invalid Compensation should be between 2 to 255 characters",
        (value: string | null | undefined): boolean => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return (
            value.length >= 2 &&
            value.length <= 255 &&
            /^[a-zA-Z ]+$/.test(value)
          );
        }
      ),
    doubleTimeRate: yup
      .string()
      .optional()
      .nullable()
      .test(
        "mobile",
        "Enter only number and decimal values",
        (value: string | null | undefined) => {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          return /^\d+(\.\d+)?$/.test(value);
        }
      ),
  }),
});
