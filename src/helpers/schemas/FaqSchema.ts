import { object, string } from "yup";

export const FaqSchema = object({
  question: string()
    .nullable(),
    // .min(2, 'Question must be at least 2 characters')
    // .max(100, 'Question must be at most 100 characters'),
   

answer: string().nullable(),
    // .test('answer', 'Answer must be between 2 to 255 characters', (value) => {
    //   if (!value) {
    //     return true;
    //   }
    //   return value.length >= 2 && value.length <= 255 && /^[a-zA-Z ']+$/.test(value);
    // }),
});


//import { array, object, string } from "yup";

// export const FaqSchema = object({
//   type: string().required('Please select a type'),
//   questions: array().of(
//     object({
//       question: string().required('Question is required')
//         .min(2, 'Question must be at least 2 characters')
//         .max(100, 'Question must be at most 100 characters'),

//       answer: string().required('Answer is required')
//         .test('answer', 'Answer must be between 2 to 255 characters and includes characters only', (value) => {
//           if (!value) {
//             return true;
//           }
//           return value.length >= 2 && value.length <= 255 && /^[a-zA-Z ']+$/.test(value);
//         })
//         .max(255, 'Answer must be at most 255 characters'),
//     })
//   ),
// });


