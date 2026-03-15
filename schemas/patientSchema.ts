import { z } from "zod";

export const patientSchema = z.object({
  firstName: z.string().min(1, "First name required"),

  middleName: z.string().optional(),

  lastName: z.string().min(1, "Last name required"),

  dateOfBirth: z.string(),

  gender: z.string().refine((val) => ["Male", "Female", "Prefer not to say"].includes(val), {
    message: "Invalid gender",
  }),


  phoneNumber: z
    .string()
    .min(10, "Invalid phone number"),

  email: z
    .string()
    .email("Invalid email"),

  address: z.string().min(1, "Address required"),

  preferredLanguage: z.string().min(1, "Preferred language required"),

  nationality: z.string().min(1, "Nationality required"),

  religion: z.string().optional(),

  emergencyContacts: z
    .array(
      z.object({
        name: z.string().min(1, "Contact name required"),
        relationship: z.string().min(1, "Relationship required"),
      })
    )
    .optional(),
});