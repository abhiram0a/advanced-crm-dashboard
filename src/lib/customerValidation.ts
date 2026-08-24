import { z } from "zod";

export const customerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be 100 characters or less."),

  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .regex(
      /^\+?[0-9\s().-]{7,20}$/,
      "Please enter a valid phone number.",
    ),

  company: z
    .string()
    .trim()
    .min(1, "Company is required.")
    .max(
      100,
      "Company must be 100 characters or less.",
    ),

  status: z.enum([
    "Active",
    "Inactive",
    "Lead",
  ]),

  lastContactDate: z
    .string()
    .min(1, "Last contact date is required."),

  notes: z
    .string()
    .max(
      1000,
      "Notes must be 1000 characters or less.",
    ),
});

export type CustomerFormValues = z.infer<
  typeof customerFormSchema
>;