"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { batchSchema, type BatchFormValues } from "./schema";

const toDate = (value?: string) => value ? new Date(`${value}T00:00:00.000Z`) : null;

export async function createBatch(data: BatchFormValues) {
  const validated = batchSchema.parse(data);
  await prisma.batch.create({
    data: {
      name: validated.name,
      jalur: validated.jalur,
      whatsappGroupLink: validated.whatsappGroupLink || null,
      startDate: toDate(validated.startDate),
      endDate: toDate(validated.endDate),
      isActive: validated.isActive,
    },
  });
  revalidatePath("/admin/batch");
}

export async function updateBatch(id: number, data: BatchFormValues) {
  const validated = batchSchema.parse(data);
  await prisma.batch.update({
    where: { id },
    data: {
      name: validated.name,
      jalur: validated.jalur,
      whatsappGroupLink: validated.whatsappGroupLink || null,
      startDate: toDate(validated.startDate),
      endDate: toDate(validated.endDate),
      isActive: validated.isActive,
    },
  });
  revalidatePath("/admin/batch");
}

export async function deleteBatch(id: number) {
  const students = await prisma.student.count({ where: { batchId: id } });
  if (students > 0) throw new Error("Batch yang memiliki pendaftar tidak dapat dihapus");
  await prisma.batch.delete({ where: { id } });
  revalidatePath("/admin/batch");
}

export async function toggleBatch(id: number, isActive: boolean) {
  await prisma.batch.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/batch");
}
