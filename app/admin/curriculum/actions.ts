"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { curriculumSchema, CurriculumFormValues } from "./schema";
import { s3Client } from "@/lib/s3";

// ── Upload helper ───────────────────────────────────────────────────────────

async function uploadFile(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const key = `${folder}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  const endpoint = process.env.S3_ENDPOINT!.replace(/\/$/, "");
  return `${endpoint}/${process.env.S3_BUCKET_NAME}/${key}`;
}

export async function uploadCurriculumImage(file: File): Promise<string> {
  return uploadFile(file, "curriculum");
}

export async function getCurriculums(search: string = "") {
  const where = search
    ? {
        name: { contains: search, mode: "insensitive" as const },
      }
    : {};

  return await prisma.curriculum.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function getCurriculumById(id: number) {
  return await prisma.curriculum.findUnique({
    where: { id },
  });
}

export async function createCurriculum(data: CurriculumFormValues) {
  const validated = curriculumSchema.parse(data);
  await prisma.curriculum.create({
    data: {
      name: validated.name,
      image: validated.image || null,
      category: validated.category,
      description: validated.description || null,
    },
  });
  revalidatePath("/admin/curriculum");
  redirect("/admin/curriculum");
}

export async function updateCurriculum(id: number, data: CurriculumFormValues) {
  const validated = curriculumSchema.parse(data);
  await prisma.curriculum.update({
    where: { id },
    data: {
      name: validated.name,
      image: validated.image || null,
      category: validated.category,
      description: validated.description || null,
    },
  });
  revalidatePath("/admin/curriculum");
  redirect("/admin/curriculum");
}

export async function deleteCurriculum(id: number) {
  await prisma.curriculum.delete({
    where: { id },
  });
  revalidatePath("/admin/curriculum");
  // tidak redirect di sini, biarkan tombol menghandle
}