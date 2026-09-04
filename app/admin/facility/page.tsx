import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FacilityClient from "./facility-client";

export default async function FacilityPage() {
  const facilities = await prisma.facility.findMany({ orderBy: { createdAt: "desc" } });
  return <div className="mx-auto flex w-full max-w-7xl flex-col gap-6"><div><h1 className="text-2xl font-bold tracking-tight">Manajemen Fasilitas</h1><p className="text-muted-foreground">Kelola data fasilitas sekolah.</p></div><Card><CardHeader><CardTitle>Daftar Fasilitas</CardTitle><CardDescription>{facilities.length} fasilitas ditemukan.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><FacilityClient initialData={facilities} /></CardContent></Card></div>;
}