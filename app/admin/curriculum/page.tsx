// app/admin/curriculum/page.tsx
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
import { Search, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteCurriculum } from "./actions";

// Warna badge berdasarkan kategori
const categoryColors = {
  EXTRACURRICULAR: "bg-blue-100 text-blue-800",
  PROGRAM_UNGGULAN: "bg-green-100 text-green-800",
  KO_CULLICULAR: "bg-purple-100 text-purple-800",
} as const;

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function CurriculumPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const search = q.trim();

  const curriculums = await prisma.curriculum.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            // kategori tidak dicari string karena enum
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Kurikulum</h1>
          <p className="text-muted-foreground">
            Kelola data kurikulum, program unggulan, dan ekstrakurikuler.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/curriculum/create">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kurikulum
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Daftar Kurikulum</CardTitle>
              <CardDescription>
                {curriculums.length} item ditemukan.
              </CardDescription>
            </div>
            <form className="relative w-full sm:w-72" method="GET">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="search"
                name="q"
                defaultValue={search}
                placeholder="Cari nama..."
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
                <TableHead>Nama</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Gambar</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {curriculums.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Belum ada data kurikulum.
                  </TableCell>
                </TableRow>
              ) : (
                curriculums.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge className={categoryColors[item.category]}>
                        {item.category.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.description || "-"}
                    </TableCell>
                    <TableCell>
                      {item.image ? (
                        <span className="text-xs text-muted-foreground">Ada</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
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
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/curriculum/${item.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={async () => {
                                "use server";
                                await deleteCurriculum(item.id);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
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