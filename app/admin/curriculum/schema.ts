// app/admin/curriculum/schema.ts
import { z } from "zod";

export const CurriculumCategoryEnum = z.enum([
  "EXTRACURRICULAR",
  "PROGRAM_UNGGULAN",
  "KO_CULLICULAR",
]);

export const curriculumSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  image: z.string().optional().nullable(),
  category: CurriculumCategoryEnum,
  description: z.string().optional().nullable(),
});

export type CurriculumFormValues = z.infer<typeof curriculumSchema>;