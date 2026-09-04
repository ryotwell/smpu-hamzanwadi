"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createRequirement, deleteRequirement, updateRequirement } from "./actions";
import { requirementSchema, type RequirementFormValues } from "./schema";

type Requirement = { id: number; description: string };
const empty: RequirementFormValues = { description: "" };

export default function RequirementClient({ initialData }: { initialData: Requirement[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Requirement | null>(null);
  const [busy, setBusy] = useState(false);
  const form = useForm<RequirementFormValues>({ resolver: zodResolver(requirementSchema), defaultValues: empty });

  const edit = (item?: Requirement) => {
    setEditing(item ?? null);
    form.reset(item ? { description: item.description } : empty);
    setOpen(true);
  };
  const submit = async (value: RequirementFormValues) => {
    setBusy(true);
    try {
      if (editing) await updateRequirement(editing.id, value);
      else await createRequirement(value);
      toast.success("Persyaratan berhasil disimpan");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Persyaratan tidak dapat disimpan");
    } finally { setBusy(false); }
  };
  const remove = async (id: number) => {
    if (!confirm("Hapus persyaratan ini?")) return;
    try { await deleteRequirement(id); toast.success("Persyaratan berhasil dihapus"); router.refresh(); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Persyaratan tidak dapat dihapus"); }
  };

  return <>
    <div className="flex justify-end"><Button onClick={() => edit()}>Tambah Persyaratan</Button></div>
    <div className="overflow-x-auto rounded-md border"><table className="w-full text-sm"><thead><tr className="border-b bg-muted/50 text-left"><th className="w-16 p-3">#</th><th className="p-3">Persyaratan</th><th className="p-3 text-right">Aksi</th></tr></thead><tbody>{initialData.length ? initialData.map((item, index) => <tr className="border-b" key={item.id}><td className="p-3 text-muted-foreground">{index + 1}</td><td className="p-3"><div className="line-clamp-2">{item.description}</div></td><td className="whitespace-nowrap p-3 text-right"><Button variant="outline" size="sm" onClick={() => edit(item)}>Edit</Button>{" "}<Button variant="destructive" size="sm" onClick={() => remove(item.id)}>Hapus</Button></td></tr>) : <tr><td colSpan={3} className="h-24 text-center text-muted-foreground">Belum ada persyaratan.</td></tr>}</tbody></table></div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? "Edit Persyaratan" : "Tambah Persyaratan"}</DialogTitle></DialogHeader><Form {...form}><form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-4"><FormField control={form.control} name="description" render={({ field }) => <FormItem><FormLabel>Deskripsi Persyaratan</FormLabel><FormControl><Textarea {...field} placeholder="Masukkan persyaratan" className="min-h-32" /></FormControl><FormMessage /></FormItem>} /><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button><Button type="submit" disabled={busy}>{busy ? "Menyimpan..." : "Simpan"}</Button></div></form></Form></DialogContent></Dialog>
  </>;
}
