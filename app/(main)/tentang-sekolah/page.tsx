import { Target, ListChecks, GraduationCap, HeartHandshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/main/navbar";
import { Footer } from "@/components/main/footer";

export const metadata = {
    title: "Tentang Sekolah | SMP Unggulan Hamzanwadi",
    description: "Profil, visi, dan misi SMP Unggulan Hamzanwadi — sekolah menengah pertama yang memadukan kurikulum nasional dengan nilai-nilai keislaman.",
};

const misi = [
    "Menanamkan nilai-nilai Al-Qur’an dan As-Sunnah dalam kehidupan sehari-hari.",
    "Melaksanakan pembelajaran yang aktif, inovatif, kreatif, efektif, dan menyenangkan.",
    "Mengembangkan potensi akademik dan non-akademik siswa.",
    "Mewujudkan lingkungan sekolah yang bersih, sehat, dan asri.",
];

export default function TentangSekolahPage() {
    return (
        <div className="bg-muted text-foreground font-sans">
            <Navbar />

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <section className="relative isolate pt-28 pb-16 lg:pt-36 lg:pb-20 bg-secondary overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg,var(--primary) 0,var(--primary) 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }} />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <Badge variant="outline" className="mb-4 border-primary/30 text-primary text-xs tracking-widest uppercase">
                        Profil Sekolah
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                        Tentang Sekolah
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                        Mengenal lebih dekat SMP Unggulan Hamzanwadi — sekolah menengah pertama
                        berkarakter Islami di bawah naungan Yayasan Pendidikan Hamzanwadi.
                    </p>
                </div>
            </section>

            {/* ── PROFIL ───────────────────────────────────────────────── */}
            <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-xs font-bold uppercase tracking-widest mb-2 text-primary">Tentang Kami</p>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight text-secondary">Profil Sekolah</h2>
                <div className="mt-8 grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-8 items-start">
                    <div className="hidden sm:flex size-14 rounded-2xl bg-primary/10 items-center justify-center text-primary shrink-0">
                        <GraduationCap className="size-7" />
                    </div>
                    <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                        <p>
                            SMP Unggulan Hamzanwadi adalah lembaga pendidikan menengah pertama yang berdedikasi
                            untuk mencetak generasi muda yang beriman, berilmu, dan berakhlak mulia. Berdiri di
                            bawah naungan Yayasan Pendidikan Hamzanwadi, sekolah kami memadukan kurikulum nasional
                            dengan nilai-nilai keislaman yang kuat.
                        </p>
                        <p>
                            Kami percaya bahwa setiap siswa memiliki potensi unik yang perlu digali dan
                            dikembangkan. Oleh karena itu, kami menyediakan lingkungan belajar yang kondusif,
                            fasilitas modern, dan tenaga pengajar yang profesional untuk mendukung tumbuh kembang
                            siswa secara holistik.
                        </p>
                    </div>
                </div>
            </section>
            {/* ── VISI ─────────────────────────────────────────────────── */}
            <section className="relative isolate py-20 bg-secondary overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg,var(--primary) 0,var(--primary) 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }} />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <p className="text-xs font-bold uppercase tracking-widest mb-4 text-primary">Visi</p>
                    <div className="inline-flex flex-col items-center gap-4">
                        <div className="size-14 rounded-2xl bg-primary/15 flex items-center justify-center text-primary">
                            <Target className="size-7" />
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-white leading-snug max-w-2xl">
                            “Terwujudnya Generasi Qur’ani, Berprestasi, Berbudaya, dan Berwawasan Global.”
                        </p>
                    </div>
                </div>
            </section>

            {/* ── MISI ─────────────────────────────────────────────────── */}
            <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <ListChecks className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-primary">Tujuan Kami</p>
                        <h2 className="text-2xl sm:text-3xl font-black leading-tight text-secondary">Misi</h2>
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 mt-8">
                    {misi.map((m, i) => (
                        <div key={i} className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card">
                            <span className="flex size-8 rounded-full bg-primary/10 text-primary font-bold text-sm items-center justify-center shrink-0">
                                {i + 1}
                            </span>
                            <p className="text-sm leading-relaxed text-muted-foreground">{m}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <HeartHandshake className="size-4 text-primary" />
                    Mau tahu persyaratan &amp; alur pendaftaran?{" "}
                    <a href="/ppdb/info" className="font-semibold text-primary hover:underline">Lihat Info PPDB</a>
                </div>
            </section>

            <Footer />
        </div>
    );
}
