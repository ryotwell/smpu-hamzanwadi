"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createBatch, deleteBatch, toggleBatch, updateBatch } from "./actions";
import { batchSchema, type BatchFormValues } from "./schema";

type Batch = { id:number; name:string; jalur:"UMUM"|"PRESTASI"; whatsappGroupLink:string|null; isActive:boolean|null; startDate:Date|null; endDate:Date|null; _count:{students:number} };
const dateValue = (d:Date|null) => d ? new Date(d).toISOString().slice(0,10) : "";
const empty = { name:"", jalur:"UMUM" as const, whatsappGroupLink:"", startDate:"", endDate:"", isActive:false };

export default function BatchClient({ initialData }:{initialData:Batch[]}) {
 const router=useRouter(); const [open,setOpen]=useState(false); const [editing,setEditing]=useState<Batch|null>(null); const [busy,setBusy]=useState(false);
 const form=useForm<BatchFormValues>({resolver:zodResolver(batchSchema),defaultValues:empty});
 const edit=(b?:Batch)=>{setEditing(b??null);form.reset(b?{name:b.name,jalur:b.jalur,whatsappGroupLink:b.whatsappGroupLink??"",startDate:dateValue(b.startDate),endDate:dateValue(b.endDate),isActive:b.isActive??false}:empty);setOpen(true)};
 const submit=async(v:BatchFormValues)=>{setBusy(true);try{if(editing)await updateBatch(editing.id,v);else await createBatch(v);toast.success("Batch berhasil disimpan");setOpen(false);router.refresh()}catch(e){toast.error(e instanceof Error?e.message:"Terjadi kesalahan")}finally{setBusy(false)}};
 const remove=async(id:number)=>{if(!confirm("Hapus batch ini?"))return;try{await deleteBatch(id);toast.success("Batch berhasil dihapus");router.refresh()}catch(e){toast.error(e instanceof Error?e.message:"Batch tidak dapat dihapus")}};
 const toggle=async(b:Batch)=>{try{await toggleBatch(b.id,!b.isActive);router.refresh()}catch{toast.error("Status gagal diubah")}};
 return <><div className="flex justify-end"><Button onClick={()=>edit()} >Tambah Batch</Button></div><div className="overflow-x-auto rounded-md border"><table className="w-full text-sm"><thead><tr className="border-b bg-muted/50 text-left"><th className="p-3">Nama</th><th className="p-3">Jalur</th><th className="p-3">Periode</th><th className="p-3">Pendaftar</th><th className="p-3">Status</th><th className="p-3 text-right">Aksi</th></tr></thead><tbody>{initialData.length?initialData.map(b=><tr className="border-b" key={b.id}><td className="p-3 font-medium">{b.name}</td><td className="p-3">{b.jalur}</td><td className="p-3">{dateValue(b.startDate)||"-"} – {dateValue(b.endDate)||"-"}</td><td className="p-3">{b._count.students}</td><td className="p-3"><div className="flex items-center gap-2"><Switch checked={b.isActive??false} onCheckedChange={()=>toggle(b)} /><Badge variant={b.isActive?"default":"secondary"}>{b.isActive?"Aktif":"Tidak aktif"}</Badge></div></td><td className="p-3 text-right"><Button variant="outline" size="sm" onClick={()=>edit(b)}>Edit</Button> <Button variant="destructive" size="sm" disabled={b._count.students>0} onClick={()=>remove(b.id)}>Hapus</Button></td></tr>):<tr><td colSpan={6} className="h-24 text-center text-muted-foreground">Belum ada data batch.</td></tr>}</tbody></table></div>
 <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{editing?"Edit Batch":"Tambah Batch"}</DialogTitle></DialogHeader><Form {...form}><form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-4"><FormField control={form.control} name="name" render={({field})=><FormItem><FormLabel>Nama Batch</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>}/><FormField control={form.control} name="jalur" render={({field})=><FormItem><FormLabel>Jalur</FormLabel><Select value={field.value} onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="UMUM">Umum</SelectItem><SelectItem value="PRESTASI">Prestasi</SelectItem></SelectContent></Select><FormMessage/></FormItem>}/><FormField control={form.control} name="whatsappGroupLink" render={({field})=><FormItem><FormLabel>Link Grup WhatsApp</FormLabel><FormControl><Input type="url" {...field}/></FormControl><FormMessage/></FormItem>}/><div className="grid gap-4 sm:grid-cols-2"><FormField control={form.control} name="startDate" render={({field})=><FormItem><FormLabel>Mulai</FormLabel><FormControl><Input type="date" {...field}/></FormControl><FormMessage/></FormItem>}/><FormField control={form.control} name="endDate" render={({field})=><FormItem><FormLabel>Selesai</FormLabel><FormControl><Input type="date" {...field}/></FormControl><FormMessage/></FormItem>}/></div><FormField control={form.control} name="isActive" render={({field})=><FormItem className="flex items-center justify-between rounded-md border p-3"><FormLabel>Batch aktif</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl></FormItem>}/><Button type="submit" disabled={busy}>Simpan</Button></form></Form></DialogContent></Dialog></>;
}
