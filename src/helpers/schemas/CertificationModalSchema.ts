import * as yup from 'yup';

export const CertificationModalSchema = yup.object({
    name: yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be at most 100 characters')
        .transform((value) => (value ? value.toLowerCase().trim() : value))
        .test('is-string', 'Invalid Name enter only string ', (value) => {
            if (value !== null && value !== undefined && typeof value === 'string') {
                const stringValue = value.toString();
                return /^[a-zA-Z ]+$/.test(stringValue);
            }
            return false;
        })
});