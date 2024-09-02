import { object, string } from "yup";

export const FacilityDocument = object({
    name: string()
        .required('Name is required')
        .typeError('Name must be of type String')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be at most 100 characters')
        .test('is-string', 'Name should only be a string', (value: string | undefined) => {
            if (value) {
                return /^[A-Za-z ]+$/.test(value);
            }
            return false;
        }),
    description: string()
        .nullable()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .test('description', 'Description must be between 2 to 255 characters and only contain letters, spaces, and apostrophes and comma', (value: string | null | undefined) => {
            if (value === undefined || value === null) {
                return true;
            }
            return /^[a-zA-Z ',]+$/.test(value) && value.length >= 2 && value.length <= 255;
        }),

});
