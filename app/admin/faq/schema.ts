import { z } from "zod";

export const faqSchema = z.object({
  question: z.string().min(1, "Pertanyaan wajib diisi"),
  answer: z.string().min(1, "Jawaban wajib diisi"),
});

export type FaqFormValues = z.infer<typeof faqSchema>;