import { z } from "zod";

export const facilitySchema = z.object({
  name: z.string().min(1, "Nama fasilitas wajib diisi"),
  image: z.string().url("Format URL tidak valid").optional().nullable(),
  description: z.string().optional().nullable(),
});

export type FacilityFormValues = z.infer<typeof facilitySchema>;