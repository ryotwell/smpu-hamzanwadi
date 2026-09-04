import { z } from "zod";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid").refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)), "Tanggal tidak valid").optional().or(z.literal(""));

export const batchSchema = z
  .object({
    name: z.string().trim().min(1, "Nama batch wajib diisi"),
    jalur: z.enum(["UMUM", "PRESTASI"]),
    whatsappGroupLink: z.string().trim().url("Format link WhatsApp tidak valid").optional().or(z.literal("")),
    startDate: dateSchema,
    endDate: dateSchema,
    isActive: z.boolean(),
  })
  .refine(({ startDate, endDate }) => !startDate || !endDate || endDate >= startDate, {
    message: "Tanggal selesai harus setelah tanggal mulai",
    path: ["endDate"],
  });

export type BatchFormValues = z.infer<typeof batchSchema>;
