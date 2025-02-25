import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup.string().required("Password is required"),
});

// Infer TypeScript type from the schema
export type LoginFormValues = yup.InferType<typeof loginSchema>;
