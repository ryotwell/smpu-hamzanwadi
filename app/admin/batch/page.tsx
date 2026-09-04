import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BatchClient from "./batch-client";

export default async function BatchPage() {
  const batches = await prisma.batch.findMany({
    orderBy: [{ isActive: "desc" }, { startDate: "desc" }, { createdAt: "desc" }],
    include: { _count: { select: { students: true } } },
  });

  return <div className="mx-auto flex w-full max-w-7xl flex-col gap-6"><div><h1 className="text-2xl font-bold tracking-tight">Manajemen Batch</h1><p className="text-muted-foreground">Kelola periode dan jalur pendaftaran siswa.</p></div><Card><CardHeader><CardTitle>Daftar Batch</CardTitle><CardDescription>{batches.length} batch ditemukan.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><BatchClient initialData={batches} /></CardContent></Card></div>;
}
