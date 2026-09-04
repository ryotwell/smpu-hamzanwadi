import { z } from "zod";

export const PostCategoryEnum = z.enum(["BERITA", "ARTIKEL", "INFORMASI"]);

export const postSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh huruf kecil, angka, dan tanda hubung"
    ),
  thumbnail: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  content: z.string().min(1, "Konten wajib diisi"),
  excerpt: z.string().optional().nullable(),
  published: z.boolean(),
  publishedAt: z.string().optional().nullable(),
  category: PostCategoryEnum.optional().nullable(),
});

export type PostFormValues = z.infer<typeof postSchema>;