import { prisma } from "@/lib/prisma";
import { calculateSaw, SAW_CRITERIA, SAW_WEIGHTS } from "@/lib/saw";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusActions } from "./status-actions";

export default async function SawPage() {
  const students = await prisma.student.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      fullName: true,
      kodePendaftaran: true,
      testAkademik: true,
      testBahasaInggris: true,
      testKarakter: true,
      rataRataRaport: true,
      status: true,
    },
  });

  const complete = students.filter((s) => SAW_CRITERIA.every((c) => s[c] !== null));
  const excluded = students.length - complete.length;

  const { ranked } = calculateSaw(
    complete.map((s) => ({
      id: s.id,
      fullName: s.fullName,
      kodePendaftaran: s.kodePendaftaran,
      testAkademik: Number(s.testAkademik),
      testBahasaInggris: Number(s.testBahasaInggris),
      testKarakter: Number(s.testKarakter),
      rataRataRaport: Number(s.rataRataRaport),
      status: s.status,
    })),
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hasil Seleksi SAW</h1>
        <p className="text-muted-foreground">Perankingan calon siswa dengan metode Simple Additive Weighting.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Peringkat</CardTitle>
          <CardDescription>
            Bobot: Akademik {SAW_WEIGHTS.testAkademik} · B. Inggris {SAW_WEIGHTS.testBahasaInggris} · Karakter{" "}
            {SAW_WEIGHTS.testKarakter} · Rata Raport {SAW_WEIGHTS.rataRataRaport} (total{" "}
            {SAW_CRITERIA.reduce((acc, c) => acc + SAW_WEIGHTS[c], 0)}).
            {excluded > 0 && ` ${excluded} pendaftar dikecualikan karena nilai belum lengkap.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Peringkat</TableHead>
                <TableHead>Calon Siswa</TableHead>
                <TableHead>Akademik</TableHead>
                <TableHead>B. Inggris</TableHead>
                <TableHead>Karakter</TableHead>
                <TableHead>Rata Raport</TableHead>
                <TableHead>Skor Akhir</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranked.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    Belum ada pendaftar dengan nilai lengkap.
                  </TableCell>
                </TableRow>
              ) : (
                ranked.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 font-semibold">
                        {r.rank <= 3 && (
                          <Medal
                            className={cn(
                              "size-4",
                              r.rank === 1 ? "text-amber-500" : r.rank === 2 ? "text-slate-400" : "text-orange-700"
                            )}
                          />
                        )}
                        {r.rank}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{r.fullName}</p>
                      <p className="font-mono text-xs text-muted-foreground">{r.kodePendaftaran}</p>
                    </TableCell>
                    <TableCell>{r.testAkademik}</TableCell>
                    <TableCell>{r.testBahasaInggris}</TableCell>
                    <TableCell>{r.testKarakter}</TableCell>
                    <TableCell>{r.rataRataRaport}</TableCell>
                    <TableCell className="font-semibold text-primary tabular-nums">{r.total.toFixed(4)}</TableCell>
                    <TableCell>
                      {r.status === "DITERIMA" ? (
                        <Badge>Diterima di Sekolah</Badge>
                      ) : r.status === "DITOLAK" ? (
                        <Badge variant="destructive">Tidak Diterima</Badge>
                      ) : (
                        <Badge variant="outline">Menunggu</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusActions id={r.id} status={r.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
