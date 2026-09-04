import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CurriculumClient from "./curriculum-client";

export default async function CurriculumPage() {
  const curriculums = await prisma.curriculum.findMany({ orderBy: { createdAt: "desc" } });
  return <div className="mx-auto flex w-full max-w-7xl flex-col gap-6"><div><h1 className="text-2xl font-bold tracking-tight">Manajemen Kurikulum</h1><p className="text-muted-foreground">Kelola data kurikulum, program unggulan, dan ekstrakurikuler.</p></div><Card><CardHeader><CardTitle>Daftar Kurikulum</CardTitle><CardDescription>{curriculums.length} item ditemukan.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><CurriculumClient initialData={curriculums} /></CardContent></Card></div>;
}
