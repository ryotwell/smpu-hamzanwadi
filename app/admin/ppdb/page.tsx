import { FC } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MoreHorizontal, FileCheck, XCircle, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const applicants = [
  { id: "P-26001", name: "Faisal Rahman", school: "SDN 1 Selong", score: 85.5, status: "Menunggu" },
  { id: "P-26002", name: "Gita Savitri", school: "SDN 2 Pancor", score: 92.0, status: "Diterima" },
  { id: "P-26003", name: "Hasan Basri", school: "MI NW Pancor", score: 78.5, status: "Ditolak" },
  { id: "P-26004", name: "Indah Permatasari", school: "SDN 3 Selong", score: 88.0, status: "Diterima" },
  { id: "P-26005", name: "Joko Anwar", school: "SDN 1 Masbagik", score: 75.0, status: "Menunggu" },
];

export default function PPDBPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Data Pendaftar PPDB</h2>
          <p className="text-muted-foreground">Kelola daftar calon siswa baru Gelombang 1.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
               Export Data
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Proses Seleksi (SAW)
            </Button>
        </div>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari nama atau nomor pendaftaran..."
              className="w-full bg-background pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-3 font-medium">Calon Siswa</th>
                  <th className="px-6 py-3 font-medium">No. Daftar</th>
                  <th className="px-6 py-3 font-medium">Asal Sekolah</th>
                  <th className="px-6 py-3 font-medium">Skor SAW</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {applicants.map((applicant) => (
                  <tr key={applicant.id} className="bg-background hover:bg-muted/50">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${applicant.id}`} />
                        <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {applicant.name}
                    </td>
                    <td className="px-6 py-4">{applicant.id}</td>
                    <td className="px-6 py-4">{applicant.school}</td>
                    <td className="px-6 py-4 font-semibold text-indigo-600">{applicant.score}</td>
                    <td className="px-6 py-4">
                      {applicant.status === "Diterima" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <FileCheck className="w-3 h-3 mr-1" /> Diterima
                        </span>
                      )}
                      {applicant.status === "Menunggu" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          <Clock className="w-3 h-3 mr-1" /> Menunggu
                        </span>
                      )}
                      {applicant.status === "Ditolak" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
                          <XCircle className="w-3 h-3 mr-1" /> Ditolak
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
