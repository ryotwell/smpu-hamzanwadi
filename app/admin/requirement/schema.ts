import { z } from "zod";

export const requirementSchema = z.object({
  description: z.string().min(1, "Persyaratan wajib diisi"),
});

export type RequirementFormValues = z.infer<typeof requirementSchema>;
