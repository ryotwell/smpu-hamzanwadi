"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { curriculumSchema, type CurriculumFormValues } from "./schema";
import { s3Client } from "@/lib/s3";

async function uploadFile(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const key = `${folder}/${randomUUID()}.${ext}`;
  await s3Client.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET_NAME!, Key: key, Body: Buffer.from(await file.arrayBuffer()), ContentType: file.type }));
  const endpoint = process.env.S3_ENDPOINT!.replace(/\/$/, "");
  return `${endpoint}/${process.env.S3_BUCKET_NAME}/${key}`;
}

export async function uploadCurriculumImage(file: File): Promise<string> { return uploadFile(file, "curriculum"); }
export async function getCurriculums(search = "") { return prisma.curriculum.findMany({ where: search ? { name: { contains: search, mode: "insensitive" } } : {}, orderBy: { createdAt: "desc" } }); }
export async function getCurriculumById(id: number) { return prisma.curriculum.findUnique({ where: { id } }); }
export async function createCurriculum(data: CurriculumFormValues) { const value = curriculumSchema.parse(data); await prisma.curriculum.create({ data: { name: value.name, image: value.image || null, category: value.category, description: value.description || null } }); revalidatePath("/admin/curriculum"); }
export async function updateCurriculum(id: number, data: CurriculumFormValues) { const value = curriculumSchema.parse(data); await prisma.curriculum.update({ where: { id }, data: { name: value.name, image: value.image || null, category: value.category, description: value.description || null } }); revalidatePath("/admin/curriculum"); }
export async function deleteCurriculum(id: number) { await prisma.curriculum.delete({ where: { id } }); revalidatePath("/admin/curriculum"); }