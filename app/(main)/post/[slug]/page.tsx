import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/main/navbar";
import { Footer } from "@/components/main/footer";
import { CalendarDays, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const catLabel: Record<string, string> = {
    BERITA: "Berita",
    ARTIKEL: "Artikel",
    INFORMASI: "Informasi",
};

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
        where: { slug },
        select: { title: true, description: true },
    });
    if (!post) return { title: "Post Tidak Ditemukan" };
    return {
        title: `${post.title} | SMP Unggulan Hamzanwadi`,
        description: post.description || post.title,
    };
}

export default async function PostDetailPage({ params }: PageProps) {
    const { slug } = await params;

    const [post, recentPosts] = await Promise.all([
        prisma.post.findUnique({
            where: { slug, published: true },
            select: {
                id: true,
                title: true,
                thumbnail: true,
                description: true,
                content: true,
                publishedAt: true,
                category: true,
                createdAt: true,
            },
        }),
        prisma.post.findMany({
            where: { published: true, slug: { not: slug } },
            orderBy: { publishedAt: "desc" },
            take: 4,
            select: { id: true, title: true, slug: true, thumbnail: true, publishedAt: true, category: true },
        }),
    ]);

    if (!post) notFound();

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
            <section className="relative isolate pt-28 pb-12 lg:pt-36 lg:pb-16 bg-secondary overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(45deg,var(--primary) 0,var(--primary) 1px,transparent 0,transparent 50%)",
                        backgroundSize: "20px 20px",
                    }}
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <Link
                        href="/post"
                        className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft className="size-4" />
                        Kembali ke daftar
                    </Link>

                    <div className="flex items-center gap-2 mb-3">
                        {post.category && (
                            <Badge variant="outline" className="uppercase text-xs tracking-wider border-primary/30 text-primary">
                                {catLabel[post.category]}
                            </Badge>
                        )}
                        {post.publishedAt && (
                            <span className="flex items-center gap-1 text-xs text-white/40">
                                <CalendarDays className="size-3" />
                                {fmt(post.publishedAt)}
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                        {post.title}
                    </h1>

                    {post.description && (
                        <p className="mt-3 text-base text-white/60 max-w-2xl leading-relaxed">
                            {post.description}
                        </p>
                    )}
                </div>
            </section>

            {/* ── CONTENT ─────────────────────────────────────────────── */}
            <section className="py-12 lg:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
                        {/* Main content */}
                        <article className="min-w-0">
                            {post.thumbnail && (
                                <img
                                    src={post.thumbnail}
                                    alt={post.title}
                                    className="w-full aspect-video object-cover rounded-2xl border border-border shadow-sm mb-8"
                                />
                            )}

                            <div
                                className="prose prose-sm sm:prose-base prose-headings:text-secondary prose-a:text-primary prose-img:rounded-xl prose-img:border prose-img:border-border max-w-none leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
                                <Link
                                    href="/post"
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors"
                                >
                                    <ArrowLeft className="size-4" />
                                    Daftar Post
                                </Link>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors"
                                >
                                    Beranda
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </article>

                        {/* ── Sidebar ──────────────────────────────────────── */}
                        {recentPosts.length > 0 && (
                            <aside className="mt-10 lg:mt-0">
                                <div className="sticky top-28 space-y-4">
                                    <h3 className="font-bold text-secondary text-sm uppercase tracking-wider">
                                        Post Terbaru
                                    </h3>
                                    <div className="flex flex-col gap-3">
                                        {recentPosts.map((p) => (
                                            <Link
                                                key={p.id}
                                                href={`/post/${p.slug}`}
                                                className="group rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-sm transition-all overflow-hidden"
                                            >
                                                {p.thumbnail ? (
                                                    <img
                                                        src={p.thumbnail}
                                                        alt={p.title}
                                                        className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center">
                                                        <BookOpen className="size-6 text-muted-foreground" />
                                                    </div>
                                                )}
                                                <div className="p-3">
                                                    <h4 className="text-xs font-semibold text-secondary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                        {p.title}
                                                    </h4>
                                                    {p.publishedAt && (
                                                        <p className="text-[10px] text-muted-foreground mt-1.5">
                                                            {fmt(p.publishedAt)}
                                                        </p>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </aside>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
