"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { facilitySchema, FacilityFormValues } from "./schema";

export async function getFacilities(search: string = "") {
  return await prisma.facility.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
  });
}

export async function getFacilityById(id: number) {
  return await prisma.facility.findUnique({
    where: { id },
  });
}

export async function createFacility(data: FacilityFormValues) {
  const validated = facilitySchema.parse(data);
  await prisma.facility.create({
    data: {
      name: validated.name,
      image: validated.image || null,
      description: validated.description || null,
    },
  });
  revalidatePath("/admin/facility");
}

export async function updateFacility(id: number, data: FacilityFormValues) {
  const validated = facilitySchema.parse(data);
  await prisma.facility.update({
    where: { id },
    data: {
      name: validated.name,
      image: validated.image || null,
      description: validated.description || null,
    },
  });
  revalidatePath("/admin/facility");
}

export async function deleteFacility(id: number) {
  await prisma.facility.delete({
    where: { id },
  });
  revalidatePath("/admin/facility");
}