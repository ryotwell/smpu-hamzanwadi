"use client";

"use client";

/* Facility dialog CRUD */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadImage } from "@/components/upload-image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createFacility, deleteFacility, updateFacility } from "./actions";
import { facilitySchema, type FacilityFormValues } from "./schema";

type Facility = { id: number; name: string; image: string | null; description: string | null };

const empty: FacilityFormValues = { name: "", image: null, description: "" };

export default function FacilityClient({ initialData }: { initialData: Facility[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Facility | null>(null);
  const [busy, setBusy] = useState(false);
  const form = useForm<FacilityFormValues>({ resolver: zodResolver(facilitySchema), defaultValues: empty });
  const edit = (item?: Facility) => { setEditing(item ?? null); form.reset(item ? { name: item.name, image: item.image, description: item.description ?? "" } : empty); setOpen(true); };
  const submit = async (value: FacilityFormValues) => { setBusy(true); try { if (editing) await updateFacility(editing.id, value); else await createFacility(value); toast.success("Fasilitas berhasil disimpan"); setOpen(false); router.refresh(); } catch (error) { toast.error(error instanceof Error ? error.message : "Terjadi kesalahan"); } finally { setBusy(false); } };
  const remove = async (id: number) => { if (!confirm("Hapus fasilitas ini?")) return; try { await deleteFacility(id); toast.success("Fasilitas berhasil dihapus"); router.refresh(); } catch (error) { toast.error(error instanceof Error ? error.message : "Fasilitas tidak dapat dihapus"); } };
  return <>
    <div className="flex justify-end"><Button onClick={() => edit()}>Tambah Fasilitas</Button></div>
    <div className="overflow-x-auto rounded-md border"><table className="w-full text-sm"><thead><tr className="border-b bg-muted/50 text-left"><th className="p-3">Nama</th><th className="p-3">Deskripsi</th><th className="p-3">Gambar</th><th className="p-3 text-right">Aksi</th></tr></thead><tbody>{initialData.length ? initialData.map(item => <tr className="border-b" key={item.id}><td className="p-3 font-medium">{item.name}</td><td className="max-w-xs truncate p-3">{item.description || "-"}</td><td className="p-3">{item.image ? "Ada" : "-"}</td><td className="p-3 text-right"><Button variant="outline" size="sm" onClick={() => edit(item)}>Edit</Button>{" "}<Button variant="destructive" size="sm" onClick={() => remove(item.id)}>Hapus</Button></td></tr>) : <tr><td colSpan={4} className="h-24 text-center text-muted-foreground">Belum ada data fasilitas.</td></tr>}</tbody></table></div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? "Edit Fasilitas" : "Tambah Fasilitas"}</DialogTitle></DialogHeader><Form {...form}><form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-4"><FormField control={form.control} name="name" render={({ field }) => <FormItem><FormLabel>Nama</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /><FormField control={form.control} name="image" render={({ field }) => <FormItem><FormLabel>Gambar (opsional)</FormLabel><FormControl><UploadImage value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>} /><FormField control={form.control} name="description" render={({ field }) => <FormItem><FormLabel>Deskripsi (opsional)</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>} /><Button type="submit" disabled={busy}>{busy ? "Menyimpan..." : "Simpan"}</Button></form></Form></DialogContent></Dialog>
  </>;
}
