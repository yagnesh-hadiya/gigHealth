import { object, string } from "yup";

export let DocumentFormSchema = object({
    name: string()
        .required('Document Name is required')
        .typeError('Document Name must be of type String')
        .min(2, 'Document Name must be at least 2 characters')
        .max(100, 'Document Name must be at most 100 characters')
        .test('is-string', 'Document Name should only be a string', (value: string | undefined) => {
            if (value) {
                return /^[A-Za-z ]+$/.test(value);
            }
            return false;
        }),
    description: string()
        .optional()
        .nullable()
        .test('description', 'Description must be between 2 to 255 characters', (value: string | null | undefined) => {
            if (value === undefined || value === null || value === '') {
                return true;
            }
            return value.length >= 2 && value.length <= 255 && /^[a-zA-Z ']+$/.test(value);
        }),
});
