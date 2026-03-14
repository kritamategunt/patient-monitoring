import { z } from "zod";
import { patientSchema } from "@/schemas/patientSchema";

export type PatientFormData = z.infer<typeof patientSchema>;