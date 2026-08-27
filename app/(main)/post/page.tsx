import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Navbar } from "@/components/main/navbar";
import { Footer } from "@/components/main/footer";
import { CalendarDays, BookOpen, ArrowRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
    title: "Berita & Artikel | SMP Unggulan Hamzanwadi",
    description: "Informasi terkini, berita, dan artikel dari SMP Unggulan Hamzanwadi Lombok Timur.",
};

const catLabel: Record<string, string> = {
    BERITA: "Berita",
    ARTIKEL: "Artikel",
    INFORMASI: "Informasi",
};

export default async function PostListPage() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            excerpt: true,
            publishedAt: true,
            category: true,
        },
    });

    const fmt = (d: Date | null) =>
        d
            ? new Intl.DateTimeFormat("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
              }).format(d)
            : "-";

    return (
        <div className="bg-muted text-foreground font-sans">
            <Navbar />

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <section className="relative isolate pt-28 pb-16 lg:pt-36 lg:pb-20 bg-secondary overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(45deg,var(--primary) 0,var(--primary) 1px,transparent 0,transparent 50%)",
                        backgroundSize: "20px 20px",
                    }}
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">
                        Informasi Terkini
                    </p>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                        Berita & Artikel
                    </h1>
                    <p className="mt-3 text-base text-white/60 max-w-xl mx-auto">
                        Simak informasi terbaru seputar kegiatan sekolah, prestasi siswa, dan pengumuman penting
                        dari SMP Unggulan Hamzanwadi.
                    </p>
                </div>
            </section>

            {/* ── POSTS ────────────────────────────────────────────────── */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {posts.length > 0 ? (
                    <>
                        {/* Featured — first post as hero card */}
                        {posts.length > 0 && (
                            <Link
                                href={`/post/${posts[0].slug}`}
                                className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:shadow-xl transition-all block mb-10"
                            >
                                <div className="md:flex">
                                    {posts[0].thumbnail ? (
                                        <img
                                            src={posts[0].thumbnail}
                                            alt={posts[0].title}
                                            className="w-full md:w-1/2 h-56 md:h-80 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full md:w-1/2 h-56 md:h-80 bg-secondary flex items-center justify-center">
                                            <BookOpen className="size-12 text-white/20" />
                                        </div>
                                    )}
                                    <div className="p-6 md:p-10 flex flex-col justify-center flex-1">
                                        {posts[0].category && (
                                            <Badge variant="outline" className="w-fit mb-3 uppercase text-xs tracking-wider">
                                                {catLabel[posts[0].category]}
                                            </Badge>
                                        )}
                                        <h2 className="text-xl md:text-2xl font-bold text-secondary group-hover:text-primary transition-colors">
                                            {posts[0].title}
                                        </h2>
                                        {posts[0].excerpt && (
                                            <p className="text-sm text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                                                {posts[0].excerpt}
                                            </p>
                                        )}
                                        {posts[0].publishedAt && (
                                            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
                                                <CalendarDays className="size-3.5" />
                                                {fmt(posts[0].publishedAt)}
                                            </p>
                                        )}
                                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                                            Baca selengkapnya <ArrowRight className="size-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Remaining posts */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.slice(1).map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/post/${p.slug}`}
                                    className="group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all"
                                >
                                    {p.thumbnail ? (
                                        <img
                                            src={p.thumbnail}
                                            alt={p.title}
                                            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-44 bg-muted flex items-center justify-center">
                                            <BookOpen className="size-8 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="p-5">
                                        {p.category && (
                                            <Badge variant="outline" className="mb-2 uppercase text-xs tracking-wider">
                                                {catLabel[p.category]}
                                            </Badge>
                                        )}
                                        <h3 className="font-bold text-secondary group-hover:text-primary transition-colors line-clamp-2">
                                            {p.title}
                                        </h3>
                                        {p.excerpt && (
                                            <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                                                {p.excerpt}
                                            </p>
                                        )}
                                        {p.publishedAt && (
                                            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                                                <CalendarDays className="size-3" />
                                                {fmt(p.publishedAt)}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="rounded-2xl border-2 border-dashed border-border py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                                <BookOpen className="size-7 text-muted-foreground" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-secondary">Belum Ada Konten</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Belum ada berita atau artikel yang dipublikasikan. Pantau terus informasi dari sekolah.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── BACK LINK ────────────────────────────────────────── */}
                <div className="mt-12 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors"
                    >
                        <ArrowRight className="size-4 rotate-180" />
                        Kembali ke Beranda
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
