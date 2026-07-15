import { z } from "zod";

export const SigninSchema = z.object({
  email: z.string().email("Email tidak valid.").trim(),
  password: z.string().min(1, "Kata sandi tidak boleh kosong.").trim(),
});

export type SigninValues = z.infer<typeof SigninSchema>;

export type SigninFormState =
  | {
    errors?: {
      email?: string[];
      password?: string[];
    };
    message?: string;
    success?: boolean;
  }
  | undefined;
