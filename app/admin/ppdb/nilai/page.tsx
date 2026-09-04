import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { ScoreList } from "./score-list";

export default async function InputNilaiPage() {
  const students = await prisma.student.findMany({
    orderBy: { fullName: "asc" },
    select: {
      id: true,
      fullName: true,
      kodePendaftaran: true,
      asalSekolah: true,
      testBahasaInggris: true,
      testKarakter: true,
      testAkademik: true,
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/ppdb"><ArrowLeft className="mr-2 h-4 w-4" />Kembali</Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Input Nilai Seleksi</h1>
            <p className="text-muted-foreground">Masukkan nilai tes setiap calon siswa.</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Nilai Tes</CardTitle>
          <CardDescription>Nilai harus berupa bilangan bulat dari 1 sampai 100.</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length ? <ScoreList students={students} /> : <p className="text-muted-foreground">Belum ada pendaftar.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
