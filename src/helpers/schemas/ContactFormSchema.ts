import { object, string } from "yup";
import { EMAIL_REGEX } from "../config";

export let ContactFormSchema = object({
    FirstName: string()
        .required('First Name is required')
        .max(20, 'Max. length is 20')
        .min(2, 'Min. length is 2')
        .matches(/^[a-zA-Z']+$/, 'Invalid characters in First Name')
        .trim(),

    LastName: string()
        .required('Last Name is required')
        .max(20, 'Max. length is 20')
        .min(2, 'Min. length is 2')
        .matches(/^[a-zA-Z']+$/, 'Invalid characters in Last Name')
        .trim(),
    Title: string()
        .required('Title is required')
        .max(20, 'Max. length is 20')
        .min(2, 'Min. length is 2')
        .matches(/^[a-zA-Z' ]+$/, 'Invalid characters in Title')
        .trim(),

    Email: string()
        .required('Email is required')
        .matches(EMAIL_REGEX, 'Enter a valid email')
        .trim(),

    Phone: string()
        .required('Mobile number is required')
        .matches(/^(\d{3}-\d{3}-\d{4}|\d{10})$/, 'Enter a valid 10-digit mobile number'),
    Fax: string()
        .optional()
        .nullable()
        .test(
            "Fax",
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
});
