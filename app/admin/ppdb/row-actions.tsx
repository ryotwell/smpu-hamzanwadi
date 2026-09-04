"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, FileCheck, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteStudent, verifyStudent } from "./actions";

export function RowActions({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const verify = async () => {
    setBusy(true);
    try {
      await verifyStudent(id);
      toast.success("Pendaftar diverifikasi.");
      router.refresh();
    } catch {
      toast.error("Verifikasi gagal.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm("Hapus pendaftar ini? Data orang tua & dokumen ikut terhapus.")) return;
    setBusy(true);
    try {
      await deleteStudent(id);
      toast.success("Pendaftar berhasil dihapus.");
      router.refresh();
    } catch {
      toast.error("Pendaftar tidak dapat dihapus.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" disabled={busy}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Buka menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/admin/ppdb/${id}`}>
              <Eye className="mr-2 h-4 w-4" />
              Detail
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled={busy} onClick={verify}>
            <FileCheck className="mr-2 h-4 w-4" />
            Verifikasi
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" disabled={busy} onClick={remove}>
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}