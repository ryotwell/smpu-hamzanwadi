"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { faqSchema, type FaqFormValues } from "./schema";

export async function createFaq(data: FaqFormValues) {
  const validated = faqSchema.parse(data);
  await prisma.faq.create({ data: validated });
  revalidatePath("/admin/faq");
}

export async function updateFaq(id: number, data: FaqFormValues) {
  const validated = faqSchema.parse(data);
  await prisma.faq.update({ where: { id }, data: validated });
  revalidatePath("/admin/faq");
}

export async function deleteFaq(id: number) {
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/faq");
}
