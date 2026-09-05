"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rejectStudent, verifyStudent } from "../ppdb/actions";

export function StatusActions({
  id,
  status,
}: {
  id: string;
  status: "DITERIMA" | "DITOLAK" | "MENUNGGU";
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const run = async (action: (id: string) => Promise<void>, successMsg: string) => {
    setBusy(true);
    try {
      await action(id);
      toast.success(successMsg);
      router.refresh();
    } catch {
      toast.error("Gagal memperbarui status.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="outline"
        size="sm"
        className="h-7 px-2.5 text-xs"
        disabled={busy || status === "DITERIMA"}
        onClick={() => run(verifyStudent, "Pendaftar diterima di sekolah.")}
      >
        <FileCheck className="mr-1 h-3.5 w-3.5" />
        Terima
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-destructive hover:bg-destructive/10 h-7 px-2.5 text-xs"
        disabled={busy || status === "DITOLAK"}
        onClick={() => run(rejectStudent, "Pendaftar ditolak.")}
      >
        <XCircle className="mr-1 h-3.5 w-3.5" />
        Tolak
      </Button>
    </div>
  );
}
