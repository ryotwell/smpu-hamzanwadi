"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const scoreSchema = z.object({
  studentId: z.string().uuid(),
  testBahasaInggris: z.coerce.number().int().min(1).max(100),
  testKarakter: z.coerce.number().int().min(1).max(100),
  testAkademik: z.coerce.number().int().min(1).max(100),
});

export async function updateStudentScores(_previousState: { success: boolean; message: string }, formData: FormData) {
  const result = scoreSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return { success: false, message: "Nilai harus berupa bilangan bulat antara 1 dan 100." };
  }

  await prisma.student.update({
    where: { id: result.data.studentId },
    data: {
      testBahasaInggris: result.data.testBahasaInggris,
      testKarakter: result.data.testKarakter,
      testAkademik: result.data.testAkademik,
    },
  });

  revalidatePath("/admin/ppdb");
  revalidatePath(`/admin/ppdb/${result.data.studentId}`);
  return { success: true, message: "Nilai berhasil disimpan." };
}

export async function verifyStudent(id: string) {
  await prisma.student.update({ where: { id }, data: { status: "DITERIMA" } });
  revalidatePath("/admin/ppdb");
  revalidatePath("/admin/saw");
  revalidatePath(`/admin/ppdb/${id}`);
}

export async function rejectStudent(id: string) {
  await prisma.student.update({ where: { id }, data: { status: "DITOLAK" } });
  revalidatePath("/admin/ppdb");
  revalidatePath("/admin/saw");
  revalidatePath(`/admin/ppdb/${id}`);
}

export async function deleteStudent(id: string) {
  await prisma.$transaction(async (tx) => {
    const student = await tx.student.delete({ where: { id } });
    await tx.parent.delete({ where: { id: student.parentId } });
    await tx.file.delete({ where: { id: student.fileId } });
  });
  revalidatePath("/admin/ppdb");
}
