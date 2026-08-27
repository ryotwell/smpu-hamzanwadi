import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  FileCheck,
  XCircle,
  Clock,
  MoreHorizontal,
  Download,
  Eye,
  Trash2,
} from "lucide-react";

const statusConfig = {
  diterima: { label: "Diterima", variant: "default" as const, icon: FileCheck },
  menunggu: { label: "Menunggu", variant: "outline" as const, icon: Clock },
  ditolak: { label: "Ditolak", variant: "destructive" as const, icon: XCircle },
} as const;

type StatusKey = keyof typeof statusConfig;

interface PPDBPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function PPDBPage({ searchParams }: PPDBPageProps) {
  const { q = "" } = await searchParams;
  const search = q.trim();

  const students = await prisma.student.findMany({
    where: search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { kodePendaftaran: { contains: search, mode: "insensitive" } },
            { asalSekolah: { contains: search, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      kodePendaftaran: true,
      fullName: true,
      asalSekolah: true,
      isAccepted: true,
    },
  });

  // Mapping status – hanya dua kemungkinan karena isAccepted boolean
  const applicants = students.map((s) => ({
    ...s,
    status: (s.isAccepted ? "diterima" : "menunggu") as StatusKey,
  }));

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Pendaftar PPDB</h1>
          <p className="text-muted-foreground">Kelola daftar calon siswa baru.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>Proses Seleksi (SAW)</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Pendaftar</CardTitle>
              <CardDescription>
                {search
                  ? `Menemukan ${applicants.length} hasil untuk "${search}"`
                  : `${applicants.length} calon siswa terdaftar.`}
                {search && (
                  <a
                    href="/admin/ppdb"
                    className="ml-2 text-xs text-primary hover:underline"
                  >
                    Hapus filter
                  </a>
                )}
              </CardDescription>
            </div>
            {/* PERBAIKAN: value → defaultValue */}
            <form className="relative w-full sm:w-72" method="GET">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="search"
                name="q"
                defaultValue={search}
                placeholder="Cari nama atau nomor pendaftaran..."
                className="w-full bg-background pl-9"
                autoComplete="off"
              />
            </form>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">Calon Siswa</TableHead>
                <TableHead>No. Daftar</TableHead>
                <TableHead>Asal Sekolah</TableHead>
                <TableHead>Skor SAW</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right w-[60px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Belum ada data pendaftar.
                  </TableCell>
                </TableRow>
              ) : (
                applicants.map((applicant) => {
                  const status = statusConfig[applicant.status];
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={applicant.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback>
                              {applicant.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium truncate">
                            {applicant.fullName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {applicant.kodePendaftaran}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {applicant.asalSekolah}
                      </TableCell>
                      <TableCell className="font-semibold text-primary">
                        —
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Buka menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Detail
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileCheck className="mr-2 h-4 w-4" />
                                Verifikasi
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}