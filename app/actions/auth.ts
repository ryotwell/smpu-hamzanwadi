"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { SigninSchema, SigninFormState } from "@/lib/validations/auth";

// ─── Signin action ─────────────────────────────────────────────────────────

export async function signinAction(
  state: SigninFormState,
  formData: FormData
): Promise<SigninFormState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validated = SigninSchema.safeParse(raw);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validated.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { message: "Email atau kata sandi salah." };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return { message: "Email atau kata sandi salah." };
  }

  await createSession(user.id);
  redirect("/admin/dashboard");
}

// ─── Signout action ────────────────────────────────────────────────────────

export async function signoutAction() {
  await deleteSession();
  redirect("/auth/signin");
}
