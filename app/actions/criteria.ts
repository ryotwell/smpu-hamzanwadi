"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCriteria() {
  return await prisma.criteria.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createCriteria(data: { name: string; weight: number; type: "BENEFIT" | "COST" }) {
  const result = await prisma.criteria.create({
    data: {
      name: data.name,
      weight: data.weight,
      type: data.type,
    },
  });
  revalidatePath("/admin/criteria");
  return result;
}

export async function updateCriteria(id: number, data: { name: string; weight: number; type: "BENEFIT" | "COST" }) {
  const result = await prisma.criteria.update({
    where: { id },
    data: {
      name: data.name,
      weight: data.weight,
      type: data.type,
    },
  });
  revalidatePath("/admin/criteria");
  return result;
}

export async function deleteCriteria(id: number) {
  const result = await prisma.criteria.delete({
    where: { id },
  });
  revalidatePath("/admin/criteria");
  return result;
}
