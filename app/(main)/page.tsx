import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Navbar } from "@/components/main/navbar";
import { Footer } from "@/components/main/footer";
import {
    GraduationCap, BookOpen, Users, Award, ArrowRight,
    CalendarDays, ChevronDown, CheckCircle, ChevronRight,
} from "lucide-react";

export const metadata = {
    title: "SMP Unggulan Hamzanwadi — Sekolah Unggulan Berkarakter Islami",
    description: "SMP Unggulan Hamzanwadi Lombok Timur NTB — pendidikan berkualitas, berwawasan global, berkarakter islami.",
};

export default async function HomePage() {
    const [posts, facilities, programs, faqs, activeBatch, totalStudents] = await Promise.all([
        prisma.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 3, select: { id: true, title: true, slug: true, thumbnail: true, excerpt: true, publishedAt: true, category: true } }),
        prisma.facility.findMany({ take: 6, select: { id: true, name: true, image: true, description: true } }),
        prisma.curriculum.findMany({ select: { id: true, name: true, category: true, description: true, image: true } }),
        prisma.faq.findMany({ take: 6, select: { id: true, question: true, answer: true } }),
        prisma.batch.findFirst({ where: { isActive: true }, select: { id: true, name: true, jalur: true, startDate: true, endDate: true } }),
        prisma.student.count(),
    ]);

    const extracurriculars = programs.filter(p => p.category === "EXTRACURRICULAR");
    const unggulan = programs.filter(p => p.category === "PROGRAM_UNGGULAN");

    const fmt = (d: Date | null) => d ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(d) : "-";
    const catLabel: Record<string, string> = { BERITA: "Berita", ARTIKEL: "Artikel", INFORMASI: "Informasi" };

    return (
        <div className="bg-[#f8f7f2] text-[#1a1a1a] font-sans">
            <Navbar />

            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section className="relative h-svh flex items-center overflow-hidden">
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" poster="/assets/hero-preview.jpg">
                    <source src="/assets/hero.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a2a1a]/70 via-[#0a2a1a]/50 to-[#0a2a1a]/80" />

                {/* Geometric accent */}
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-10" style={{backgroundImage:"repeating-linear-gradient(60deg,transparent,transparent 30px,#d4a017 30px,#d4a017 31px)"}}>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6 uppercase tracking-wider">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                            NPSN {process.env.NEXT_PUBLIC_SCHOOL_NPSN} · Lombok Timur, NTB
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                            Mencetak Generasi<br />
                            <span className="text-amber-400">Unggul &amp; Berkarakter</span>
                        </h1>
                        <p className="mt-5 text-lg text-white/70 max-w-xl leading-relaxed">
                            SMP Unggulan Hamzanwadi — pendidikan berkualitas di bawah naungan pesantren Hamzanwadi, memadukan ilmu umum dan ilmu agama.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link href="/ppdb/form" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-[#0a2a1a] font-bold text-sm transition-all active:scale-95 shadow-lg shadow-amber-500/30">
                                Daftar PPDB {new Date().getFullYear()} <ArrowRight className="h-4 w-4" />
                            </Link>
                            <a href="#tentang" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:border-white/40 text-white font-semibold text-sm transition-all">
                                Lihat Profil
                            </a>
                        </div>
                    </div>
                </div>

                {/* Scroll cue */}
                <a href="#tentang" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors">
                    <ChevronDown className="h-5 w-5 animate-bounce" />
                </a>
            </section>

            {/* ── STATS ─────────────────────────────────────────────────── */}
            <section id="tentang" className="bg-[#0a2a1a] py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { icon: Users, val: `${totalStudents}+`, label: "Total Pendaftar" },
                        { icon: BookOpen, val: "15+", label: "Program Belajar" },
                        { icon: GraduationCap, val: "100%", label: "Kelulusan" },
                        { icon: Award, val: "50+", label: "Prestasi" },
                    ].map(({ icon: Icon, val, label }) => (
                        <div key={label} className="flex flex-col items-center text-center gap-2 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-colors">
                            <div className="h-10 w-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
                                <Icon className="h-5 w-5" />
                            </div>
                            <p className="text-3xl font-black text-white">{val}</p>
                            <p className="text-xs text-white/50 font-medium">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── PPDB BANNER ───────────────────────────────────────────── */}
            {activeBatch && (
                <section className="bg-gradient-to-r from-amber-500 to-amber-400 py-5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#0a2a1a] animate-pulse inline-block shrink-0" />
                            <p className="text-[#0a2a1a] font-bold text-sm">
                                Pendaftaran {activeBatch.name} Jalur {activeBatch.jalur} Sedang Dibuka
                                {activeBatch.endDate && <span className="font-normal"> · Tutup {fmt(activeBatch.endDate)}</span>}
                            </p>
                        </div>
                        <Link href="/ppdb/form" className="shrink-0 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0a2a1a] text-amber-400 font-bold text-sm hover:bg-[#0d3520] transition-colors">
                            Daftar Sekarang <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                </section>
            )}

            {/* ── PROGRAM UNGGULAN ──────────────────────────────────────── */}
            <section id="program" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHead eyebrow="Keunggulan Kami" title="Program Unggulan Sekolah" />
                {unggulan.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                        {unggulan.map((p, i) => (
                            <div key={p.id} className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white hover:border-[#0a2a1a]/20 hover:shadow-xl transition-all duration-300">
                                {p.image && <img src={p.image} alt={p.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />}
                                {!p.image && (
                                    <div className="w-full h-44 flex items-center justify-center" style={{background:`hsl(${142 + i * 20},30%,${18 + i * 3}%)`}}>
                                        <BookOpen className="h-10 w-10 text-white/30" />
                                    </div>
                                )}
                                <div className="p-5">
                                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Program Unggulan</p>
                                    <h3 className="font-bold text-base text-[#0a2a1a]">{p.name}</h3>
                                    {p.description && <p className="text-sm text-stone-500 mt-1.5 line-clamp-2">{p.description}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <PlaceholderCards n={3} />
                )}

                {/* Extracurricular */}
                {extracurriculars.length > 0 && (
                    <div className="mt-16">
                        <h3 className="text-lg font-bold text-[#0a2a1a] mb-6">Ekstrakurikuler</h3>
                        <div className="flex flex-wrap gap-3">
                            {extracurriculars.map(p => (
                                <span key={p.id} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a2a1a]/5 border border-[#0a2a1a]/10 text-[#0a2a1a] text-sm font-medium hover:bg-amber-50 hover:border-amber-300 transition-colors">
                                    <CheckCircle className="h-3.5 w-3.5 text-amber-500" /> {p.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* ── FASILITAS ─────────────────────────────────────────────── */}
            <section id="fasilitas" className="py-20 bg-[#0a2a1a]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHead eyebrow="Infrastruktur" title="Fasilitas Sekolah" light />
                    {facilities.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
                            {facilities.map((f, i) => (
                                <div key={f.id} className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-amber-500/30 bg-white/5 transition-all">
                                    {f.image
                                        ? <img src={f.image} alt={f.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                                        : <div className="w-full h-48 flex items-center justify-center" style={{background:`hsl(${142+i*20},25%,${15+i*3}%)`}}><BookOpen className="h-8 w-8 text-white/20" /></div>
                                    }
                                    <div className="p-5">
                                        <h3 className="font-bold text-white">{f.name}</h3>
                                        {f.description && <p className="text-sm text-white/50 mt-1 line-clamp-2">{f.description}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-5 mt-10">
                            {Array.from({length:6}).map((_,i)=>(
                                <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── BERITA ────────────────────────────────────────────────── */}
            <section id="berita" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-10">
                    <SectionHead eyebrow="Informasi Terkini" title="Berita & Artikel" />
                    <Link href="/berita" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#0a2a1a] hover:text-amber-600 transition-colors">
                        Lihat semua <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {posts.map((p, i) => (
                            <Link key={p.id} href={`/berita/${p.slug}`} className={`group rounded-2xl overflow-hidden border border-stone-200 bg-white hover:shadow-xl transition-all ${i === 0 ? "md:col-span-2" : ""}`}>
                                {p.thumbnail && <img src={p.thumbnail} alt={p.title} className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${i===0?"h-64":"h-44"}`} />}
                                {!p.thumbnail && <div className={`w-full bg-stone-100 flex items-center justify-center ${i===0?"h-64":"h-44"}`}><BookOpen className="h-8 w-8 text-stone-300"/></div>}
                                <div className="p-5">
                                    {p.category && <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{catLabel[p.category]}</span>}
                                    <h3 className={`font-bold text-[#0a2a1a] mt-1 line-clamp-2 group-hover:text-amber-700 transition-colors ${i===0?"text-lg":"text-base"}`}>{p.title}</h3>
                                    {p.excerpt && <p className="text-sm text-stone-500 mt-1.5 line-clamp-2">{p.excerpt}</p>}
                                    {p.publishedAt && <p className="text-xs text-stone-400 mt-3 flex items-center gap-1"><CalendarDays className="h-3 w-3"/>{fmt(p.publishedAt)}</p>}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border-2 border-dashed border-stone-200 py-16 text-center text-stone-400 text-sm">
                        Belum ada berita yang dipublikasikan.
                    </div>
                )}
            </section>

            {/* ── FAQ ───────────────────────────────────────────────────── */}
            {faqs.length > 0 && (
                <section id="faq" className="py-20 bg-stone-50 border-t border-stone-200">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <SectionHead eyebrow="Pertanyaan Umum" title="FAQ" center />
                        <div className="mt-10 space-y-3">
                            {faqs.map((f) => (
                                <details key={f.id} className="group rounded-xl border border-stone-200 bg-white overflow-hidden">
                                    <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer font-semibold text-[#0a2a1a] text-sm select-none list-none">
                                        {f.question}
                                        <ChevronDown className="h-4 w-4 text-stone-400 shrink-0 group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="px-5 pb-4 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                                        {f.answer}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA PPDB ──────────────────────────────────────────────── */}
            <section className="py-24 bg-[#0a2a1a] relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{backgroundImage:"repeating-linear-gradient(45deg,#d4a017 0,#d4a017 1px,transparent 0,transparent 50%)",backgroundSize:"20px 20px"}} />
                <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-6">
                    <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">Penerimaan Peserta Didik Baru</p>
                    <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                        Daftarkan Putra-Putri Anda<br />Sekarang
                    </h2>
                    <p className="text-white/60 text-base">
                        Jadikan anak Anda bagian dari keluarga besar SMPU Hamzanwadi — unggul di akademik, kuat di karakter.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                        <Link href="/ppdb/form" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-[#0a2a1a] font-bold transition-all active:scale-95 shadow-lg shadow-amber-500/20">
                            Isi Formulir Pendaftaran <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link href="/ppdb/info" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-white font-semibold hover:border-white/40 transition-all text-sm">
                            Info PPDB
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── MAP ───────────────────────────────────────────────────── */}
            {process.env.NEXT_PUBLIC_SCHOOL_CONTACT_MAP && (
                <section className="h-72 relative">
                    <iframe src={process.env.NEXT_PUBLIC_SCHOOL_CONTACT_MAP} className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500" loading="lazy" title="Lokasi SMPU Hamzanwadi" />
                </section>
            )}

            <Footer />
        </div>
    );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SectionHead({ eyebrow, title, light, center }: { eyebrow: string; title: string; light?: boolean; center?: boolean }) {
    return (
        <div className={center ? "text-center" : ""}>
            <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${light ? "text-amber-400" : "text-amber-600"}`}>{eyebrow}</p>
            <h2 className={`text-2xl sm:text-3xl font-black leading-tight ${light ? "text-white" : "text-[#0a2a1a]"}`}>{title}</h2>
        </div>
    );
}

function PlaceholderCards({ n }: { n: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {Array.from({ length: n }).map((_, i) => (
                <div key={i} className="h-52 rounded-2xl bg-stone-100 animate-pulse" />
            ))}
        </div>
    );
}