"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { UploadImage } from "@/components/upload-image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createCurriculum, deleteCurriculum, updateCurriculum } from "./actions";
import { curriculumSchema, type CurriculumFormValues } from "./schema";

type Curriculum = { id: number; name: string; category: CurriculumFormValues["category"]; image: string | null; description: string | null };
const empty: CurriculumFormValues = { name: "", category: "EXTRACURRICULAR", image: null, description: "" };
const categoryLabel = { EXTRACURRICULAR: "Ekstrakurikuler", PROGRAM_UNGGULAN: "Program Unggulan", KO_CULLICULAR: "Ko-Kurikuler" } as const;

export default function CurriculumClient({ initialData }: { initialData: Curriculum[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Curriculum | null>(null);
  const [busy, setBusy] = useState(false);
  const form = useForm<CurriculumFormValues>({ resolver: zodResolver(curriculumSchema), defaultValues: empty });
  const edit = (item?: Curriculum) => { setEditing(item ?? null); form.reset(item ? { name: item.name, category: item.category, image: item.image, description: item.description ?? "" } : empty); setOpen(true); };
  const submit = async (value: CurriculumFormValues) => { setBusy(true); try { if (editing) await updateCurriculum(editing.id, value); else await createCurriculum(value); toast.success("Kurikulum berhasil disimpan"); setOpen(false); router.refresh(); } catch (error) { toast.error(error instanceof Error ? error.message : "Terjadi kesalahan"); } finally { setBusy(false); } };
  const remove = async (id: number) => { if (!confirm("Hapus kurikulum ini?")) return; try { await deleteCurriculum(id); toast.success("Kurikulum berhasil dihapus"); router.refresh(); } catch (error) { toast.error(error instanceof Error ? error.message : "Kurikulum tidak dapat dihapus"); } };
  return <>
    <div className="flex justify-end"><Button onClick={() => edit()}>Tambah Kurikulum</Button></div>
    <div className="overflow-x-auto rounded-md border"><table className="w-full text-sm"><thead><tr className="border-b bg-muted/50 text-left"><th className="p-3">Nama</th><th className="p-3">Kategori</th><th className="p-3">Deskripsi</th><th className="p-3">Gambar</th><th className="p-3 text-right">Aksi</th></tr></thead><tbody>{initialData.length ? initialData.map(item => <tr className="border-b" key={item.id}><td className="p-3 font-medium">{item.name}</td><td className="p-3"><Badge variant="secondary">{categoryLabel[item.category]}</Badge></td><td className="max-w-xs truncate p-3">{item.description || "-"}</td><td className="p-3">{item.image ? "Ada" : "-"}</td><td className="p-3 text-right"><Button variant="outline" size="sm" onClick={() => edit(item)}>Edit</Button>{" "}<Button variant="destructive" size="sm" onClick={() => remove(item.id)}>Hapus</Button></td></tr>) : <tr><td colSpan={5} className="h-24 text-center text-muted-foreground">Belum ada data kurikulum.</td></tr>}</tbody></table></div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? "Edit Kurikulum" : "Tambah Kurikulum"}</DialogTitle></DialogHeader><Form {...form}><form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-4"><FormField control={form.control} name="name" render={({ field }) => <FormItem><FormLabel>Nama</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /><FormField control={form.control} name="category" render={({ field }) => <FormItem><FormLabel>Kategori</FormLabel><Select value={field.value} onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="EXTRACURRICULAR">Ekstrakurikuler</SelectItem><SelectItem value="PROGRAM_UNGGULAN">Program Unggulan</SelectItem><SelectItem value="KO_CULLICULAR">Ko-Kurikuler</SelectItem></SelectContent></Select><FormMessage /></FormItem>} /><FormField control={form.control} name="image" render={({ field }) => <FormItem><FormLabel>Gambar (opsional)</FormLabel><FormControl><UploadImage value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>} /><FormField control={form.control} name="description" render={({ field }) => <FormItem><FormLabel>Deskripsi (opsional)</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>} /><Button type="submit" disabled={busy}>{busy ? "Menyimpan..." : "Simpan"}</Button></form></Form></DialogContent></Dialog>
  </>;
}
