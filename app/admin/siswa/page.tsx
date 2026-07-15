import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const students = [
  { id: "1001", name: "Ahmad Fauzi", class: "VII A", status: "Aktif" },
  { id: "1002", name: "Budi Santoso", class: "VII B", status: "Aktif" },
  { id: "1003", name: "Citra Kirana", class: "VIII A", status: "Aktif" },
  { id: "1004", name: "Dewi Lestari", class: "VIII B", status: "Aktif" },
  { id: "1005", name: "Eko Prasetyo", class: "IX A", status: "Aktif" },
];

export default function SiswaPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Data Siswa</h2>
          <p className="text-muted-foreground">Kelola daftar siswa aktif di SMPU Hamzanwadi.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Tambah Siswa
        </Button>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari nama atau NIS..."
              className="w-full bg-background pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-3 font-medium">Siswa</th>
                  <th className="px-6 py-3 font-medium">NIS</th>
                  <th className="px-6 py-3 font-medium">Kelas</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.map((student) => (
                  <tr key={student.id} className="bg-background hover:bg-muted/50">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${student.id}`} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {student.name}
                    </td>
                    <td className="px-6 py-4">{student.id}</td>
                    <td className="px-6 py-4">{student.class}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        {student.status}
                      </span>
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
