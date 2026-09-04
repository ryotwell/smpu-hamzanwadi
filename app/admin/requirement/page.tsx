import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RequirementClient from "./requirement-client";

export default async function RequirementPage() {
  const requirements = await prisma.requirement.findMany({ orderBy: { createdAt: "asc" }, select: { id: true, description: true } });
  return <div className="mx-auto flex w-full max-w-7xl flex-col gap-6"><div><h1 className="text-2xl font-bold tracking-tight">Manajemen Persyaratan</h1><p className="text-muted-foreground">Kelola persyaratan pendaftaran PPDB.</p></div><Card><CardHeader><CardTitle>Daftar Persyaratan</CardTitle><CardDescription>{requirements.length} persyaratan ditemukan.</CardDescription></CardHeader><CardContent><RequirementClient initialData={requirements} /></CardContent></Card></div>;
}
