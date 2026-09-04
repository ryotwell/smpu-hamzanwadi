"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createFaq, deleteFaq, updateFaq } from "./actions";
import { faqSchema, type FaqFormValues } from "./schema";

type Faq = { id: number; question: string; answer: string };
const empty: FaqFormValues = { question: "", answer: "" };

export default function FaqClient({ initialData }: { initialData: Faq[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [busy, setBusy] = useState(false);
  const form = useForm<FaqFormValues>({ resolver: zodResolver(faqSchema), defaultValues: empty });

  const edit = (faq?: Faq) => {
    setEditing(faq ?? null);
    form.reset(faq ? { question: faq.question, answer: faq.answer } : empty);
    setOpen(true);
  };
  const submit = async (value: FaqFormValues) => {
    setBusy(true);
    try {
      if (editing) await updateFaq(editing.id, value);
      else await createFaq(value);
      toast.success("FAQ berhasil disimpan");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "FAQ tidak dapat disimpan");
    } finally { setBusy(false); }
  };
  const remove = async (id: number) => {
    if (!confirm("Hapus FAQ ini?")) return;
    try { await deleteFaq(id); toast.success("FAQ berhasil dihapus"); router.refresh(); }
    catch (error) { toast.error(error instanceof Error ? error.message : "FAQ tidak dapat dihapus"); }
  };

  return <>
    <div className="flex justify-end"><Button onClick={() => edit()}>Tambah FAQ</Button></div>
    <div className="overflow-x-auto rounded-md border"><table className="w-full text-sm"><thead><tr className="border-b bg-muted/50 text-left"><th className="p-3">Pertanyaan</th><th className="p-3">Jawaban</th><th className="p-3 text-right">Aksi</th></tr></thead><tbody>{initialData.length ? initialData.map(faq => <tr className="border-b" key={faq.id}><td className="p-3 font-medium"><div className="flex items-start gap-2"><HelpCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><span>{faq.question}</span></div></td><td className="max-w-xl p-3 text-muted-foreground"><div className="line-clamp-2">{faq.answer}</div></td><td className="whitespace-nowrap p-3 text-right"><Button variant="outline" size="sm" onClick={() => edit(faq)}>Edit</Button>{" "}<Button variant="destructive" size="sm" onClick={() => remove(faq.id)}>Hapus</Button></td></tr>) : <tr><td colSpan={3} className="h-24 text-center text-muted-foreground">Belum ada data FAQ.</td></tr>}</tbody></table></div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? "Edit FAQ" : "Tambah FAQ"}</DialogTitle></DialogHeader><Form {...form}><form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-4"><FormField control={form.control} name="question" render={({ field }) => <FormItem><FormLabel>Pertanyaan</FormLabel><FormControl><Textarea {...field} placeholder="Masukkan pertanyaan" /></FormControl><FormMessage /></FormItem>} /><FormField control={form.control} name="answer" render={({ field }) => <FormItem><FormLabel>Jawaban</FormLabel><FormControl><Textarea {...field} placeholder="Masukkan jawaban" className="min-h-32" /></FormControl><FormMessage /></FormItem>} /><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button><Button type="submit" disabled={busy}>{busy ? "Menyimpan..." : "Simpan"}</Button></div></form></Form></DialogContent></Dialog>
  </>;
}
