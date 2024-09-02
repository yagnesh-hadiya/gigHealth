import * as yup from 'yup';

export const EducationModalSchema = yup.object({
    degree: yup.string()
        .required('Degree is required')
        .min(2, 'Degree must be at least 2 characters')
        .max(100, 'Degree must be at most 100 characters')
        .transform((value) => (value ? value.toLowerCase().trim() : value))
        .test('is-string', 'Invalid Degree enter only string ', (value) => {
            if (value !== null && value !== undefined && typeof value === 'string') {
                const stringValue = value.toString();
                return /^[a-zA-Z. ]+$/.test(stringValue);
            }
            return false;
        }),
    school: yup.string()
        .required('School is required')
        .min(2, 'School must be at least 2 characters')
        .max(100, 'School must be at most 100 characters')
        .transform((value) => (value ? value.toLowerCase().trim() : value))
        .test('is-string', 'Invalid School enter only string ', (value) => {
            if (value !== null && value !== undefined && typeof value === 'string') {
                const stringValue = value.toString();
                return /^[a-zA-Z. ]+$/.test(stringValue);
            }
            return false;
        }),
    location: yup.string()
        .required('Location is required')
        .min(2, 'Location must be at least 2 characters')
        .max(100, 'Location must be at most 100 characters')
        .transform((value) => (value ? value.toLowerCase().trim() : value))
        .test('is-string', 'Invalid Location enter only string ', (value) => {
            if (value !== null && value !== undefined && typeof value === 'string') {
                const stringValue = value.toString();
                return /^[a-zA-Z ]+$/.test(stringValue);
            }
            return false;
        }),
});