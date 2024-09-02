import { object, string } from "yup";

export let createRoleSchema = object({
  title: string().required("Role Type is required"),
  description: string().required(" Description is required"),
});
