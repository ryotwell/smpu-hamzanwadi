"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requirementSchema, type RequirementFormValues } from "./schema";

export async function createRequirement(data: RequirementFormValues) {
  const validated = requirementSchema.parse(data);
  await prisma.requirement.create({ data: validated });
  revalidatePath("/admin/requirement");
}

export async function updateRequirement(id: number, data: RequirementFormValues) {
  const validated = requirementSchema.parse(data);
  await prisma.requirement.update({ where: { id }, data: validated });
  revalidatePath("/admin/requirement");
}

export async function deleteRequirement(id: number) {
  await prisma.requirement.delete({ where: { id } });
  revalidatePath("/admin/requirement");
}
