import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import FaqClient from "./faq-client";

interface PageProps { searchParams: Promise<{ q?: string }> }

export default async function FaqPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const search = q.trim();
  const faqs = await prisma.faq.findMany({
    where: search ? { OR: [{ question: { contains: search, mode: "insensitive" } }, { answer: { contains: search, mode: "insensitive" } }] } : {},
    orderBy: { createdAt: "desc" },
    select: { id: true, question: true, answer: true },
  });
  return <div className="mx-auto flex w-full max-w-7xl flex-col gap-6"><div><h1 className="text-2xl font-bold tracking-tight">Manajemen FAQ</h1><p className="text-muted-foreground">Kelola pertanyaan dan jawaban yang sering diajukan.</p></div><Card><CardHeader><div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"><div><CardTitle>Daftar FAQ</CardTitle><CardDescription>{faqs.length} pertanyaan ditemukan.</CardDescription></div><form className="relative w-full sm:w-72" method="GET"><Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input type="search" name="q" defaultValue={search} placeholder="Cari pertanyaan atau jawaban..." className="w-full bg-background pl-9" autoComplete="off" /></form></div></CardHeader><CardContent className="flex flex-col gap-4"><FaqClient initialData={faqs} /></CardContent></Card></div>;
}
