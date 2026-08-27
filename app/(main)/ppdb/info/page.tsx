import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    GraduationCap, CalendarDays, ChevronRight, CheckCircle,
    FileText, ClipboardList, Users, ArrowRight, BookOpen,
    ChevronDown, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/main/navbar";
import { Footer } from "@/components/main/footer";

export const metadata = {
    title: "Info PPDB | SMP Unggulan Hamzanwadi",
    description: "Informasi lengkap Penerimaan Peserta Didik Baru (PPDB) SMP Unggulan Hamzanwadi — persyaratan, alur pendaftaran, jadwal, dan FAQ.",
};

export default async function PPDBInfoPage() {
    const [activeBatch, requirements, faqs] = await Promise.all([
        prisma.batch.findFirst({
            where: { isActive: true },
            select: { id: true, name: true, jalur: true, startDate: true, endDate: true, whatsappGroupLink: true },
        }),
        prisma.requirement.findMany({ orderBy: { createdAt: "asc" } }),
        prisma.faq.findMany({ take: 8, orderBy: { createdAt: "asc" }, select: { id: true, question: true, answer: true } }),
    ]);

    const fmt = (d: Date | null) => d
        ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(d)
        : "-";

    const steps = [
        { icon: FileText, title: "Isi Formulir", desc: "Lengkapi data diri, pilih gelombang, dan unggah dokumen yang diperlukan secara online." },
        { icon: ClipboardList, title: "Verifikasi", desc: "Panitia memverifikasi kelengkapan dan kebenaran data yang Anda masukkan." },
        { icon: Users, title: "Seleksi", desc: "Proses seleksi dilakukan berdasarkan kriteria dan jalur pendaftaran yang dipilih." },
        { icon: CheckCircle, title: "Pengumuman", desc: "Hasil seleksi diumumkan melalui website dan grup WhatsApp resmi PPDB." },
    ];

    return (
        <div className="bg-muted text-foreground font-sans">
            <Navbar />

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <section className="relative isolate pt-28 pb-16 lg:pt-36 lg:pb-20 bg-secondary overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg,var(--primary) 0,var(--primary) 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }} />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <Badge variant="outline" className="mb-4 border-primary/30 text-primary text-xs tracking-widest uppercase">
                        PPDB {new Date().getFullYear()}
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                        Penerimaan Peserta Didik Baru
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                        Bergabunglah bersama SMP Unggulan Hamzanwadi — sekolah unggulan berkarakter Islami
                        yang mencetak generasi berprestasi, berakhlak mulia, dan berwawasan global.
                    </p>

                    {activeBatch ? (
                        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-medium">
                            <span className="size-2 rounded-full bg-primary animate-pulse" />
                            Pendaftaran {activeBatch.name} — Jalur {activeBatch.jalur} Sedang Dibuka
                        </div>
                    ) : (
                        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm font-medium">
                            <Clock className="size-3.5" />
                            Pendaftaran belum dibuka
                        </div>
                    )}
                </div>
            </section>

            {/* ── ACTIVE BATCH CARD ────────────────────────────────────── */}
            {activeBatch && (
                <section className="relative -mt-10 z-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-card rounded-2xl border border-border shadow-lg p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <GraduationCap className="size-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-secondary">
                                        {activeBatch.name}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Jalur Pendaftaran: <span className="font-semibold text-primary">{activeBatch.jalur}</span>
                                        {activeBatch.endDate && <> · Tutup {fmt(activeBatch.endDate)}</>}
                                    </p>
                                    {activeBatch.startDate && (
                                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                            <CalendarDays className="size-3" />
                                            Dibuka sejak {fmt(activeBatch.startDate)}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Button asChild size="lg" className="shrink-0 w-full sm:w-auto rounded-xl">
                                <Link href="/ppdb/form">
                                    Daftar Sekarang <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* ── PERSYARATAN ──────────────────────────────────────────── */}
            <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHead
                    eyebrow="Persyaratan"
                    title="Syarat Pendaftaran"
                    subtitle="Pastikan Anda memenuhi persyaratan berikut sebelum mendaftar."
                />

                {requirements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                        {requirements.map((req, i) => (
                            <div key={req.id} className="flex items-start gap-3 p-5 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors">
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                                    {i + 1}
                                </span>
                                <p className="text-sm text-secondary leading-relaxed pt-0.5">
                                    {req.description}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-10 rounded-2xl border-2 border-dashed border-border py-16 text-center text-muted-foreground text-sm">
                        Belum ada persyaratan yang ditambahkan.
                    </div>
                )}
            </section>

            {/* ── ALUR PENDAFTARAN ─────────────────────────────────────── */}
            <section className="py-20 bg-secondary">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHead
                        eyebrow="Alur Pendaftaran"
                        title="Langkah Mudah Mendaftar"
                        subtitle="Ikuti langkah-langkah berikut untuk menyelesaikan pendaftaran Anda."
                        light
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
                        {steps.map(({ icon: Icon, title, desc }, i) => (
                            <div key={title} className="relative group">
                                {/* Connector line */}
                                {i < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-8 left-[calc(50%+1.5rem)] w-[calc(100%-3rem)] h-0.5 border-t-2 border-dashed border-primary/20" />
                                )}
                                <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-primary/30 hover:bg-white/[0.07] transition-all group">
                                    <span className="flex size-14 mx-auto items-center justify-center rounded-full bg-primary/15 text-primary mb-4 group-hover:scale-110 transition-transform">
                                        <Icon className="size-6" />
                                    </span>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-secondary text-[10px] font-bold">
                                            {i + 1}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-white text-sm">{title}</h3>
                                    <p className="text-xs text-white/50 mt-1.5 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ──────────────────────────────────────────────────── */}
            {faqs.length > 0 && (
                <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" id="faq">
                    <SectionHead
                        eyebrow="Tanya Jawab"
                        title="Pertanyaan Umum PPDB"
                        subtitle="Temukan jawaban atas pertanyaan yang sering diajukan seputar PPDB."
                    />

                    <div className="flex flex-col gap-3 mt-10">
                        {faqs.map((f) => (
                            <details key={f.id} className="group rounded-xl border border-border bg-card overflow-hidden">
                                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer font-semibold text-secondary text-sm select-none list-none">
                                    {f.question}
                                    <ChevronDown className="size-4 text-muted-foreground shrink-0 group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                                    {f.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>
            )}

            {/* ── CTA ──────────────────────────────────────────────────── */}
            <section className="py-24 bg-secondary relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg,var(--primary) 0,var(--primary) 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }} />
                <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center flex flex-col gap-6">
                    <p className="text-primary text-xs font-bold uppercase tracking-widest">
                        {activeBatch ? "Segera Daftarkan" : "Persiapkan Dirimu"}
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                        {activeBatch
                            ? "Daftarkan Putra-Putri Anda Sekarang"
                            : "Pendaftaran Akan Segera Dibuka"
                        }
                    </h2>
                    <p className="text-white/60 text-base max-w-lg mx-auto">
                        {activeBatch
                            ? `Jadikan anak Anda bagian dari keluarga besar SMPU Hamzanwadi — unggul di akademik, kuat di karakter.`
                            : "Pantau terus informasi dari sekolah untuk mengetahui jadwal pendaftaran PPDB terbaru."
                        }
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                        {activeBatch && (
                            <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/30">
                                <Link href="/ppdb/form">
                                    Isi Formulir Pendaftaran <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        )}
                        <Button
                            variant={activeBatch ? "outline" : "default"}
                            size="lg"
                            className={activeBatch ? "rounded-full border-white/20 text-white hover:border-white/40" : "rounded-full shadow-lg shadow-primary/30"}
                            asChild
                        >
                            <Link href="/">
                                Kembali ke Beranda <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

// ── Sub-components ──────────────────────────────────────────────────────────────

function SectionHead({
    eyebrow, title, subtitle, light, center,
}: {
    eyebrow: string; title: string; subtitle?: string; light?: boolean; center?: boolean;
}) {
    return (
        <div className={center ? "text-center" : ""}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2 text-primary">{eyebrow}</p>
            <h2 className={`text-2xl sm:text-3xl font-black leading-tight ${light ? "text-white" : "text-secondary"}`}>
                {title}
            </h2>
            {subtitle && (
                <p className={`mt-2 text-sm max-w-lg ${light ? "text-white/50" : "text-muted-foreground"}`}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}
