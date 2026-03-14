import { z } from "zod";

export const patientSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name required"),

  dateOfBirth: z.string(),

  gender: z.string(),

  phoneNumber: z
    .string()
    .min(10, "Invalid phone number"),

  email: z
    .string()
    .email("Invalid email"),

  address: z.string().min(1),

  preferredLanguage: z.string(),

  nationality: z.string(),

  emergencyContactName: z.string().optional(),

  emergencyContactRelationship: z.string().optional(),

  religion: z.string().optional()
});