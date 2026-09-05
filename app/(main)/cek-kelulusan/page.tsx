import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/main/navbar";
import { Footer } from "@/components/main/footer";
import { FileCheck, XCircle, Clock, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Cek Status Kelulusan | SMP Unggulan Hamzanwadi",
    description: "Cek status kelulusan PPDB SMP Unggulan Hamzanwadi dengan memasukkan NISN.",
};

interface PageProps {
    searchParams: Promise<{ nisn?: string }>;
}

export default async function CekKelulusanPage({ searchParams }: PageProps) {
    const { nisn: raw = "" } = await searchParams;
    const nisn = raw.trim();
    const searched = nisn.length > 0;
    const valid = /^\d{10}$/.test(nisn);

    const student = searched && valid
        ? await prisma.student.findFirst({
              where: { nisn },
              select: { fullName: true, kodePendaftaran: true, status: true },
          })
        : null;

    return (
        <div className="bg-muted text-foreground font-sans">
            <Navbar />

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <section className="relative isolate pt-28 pb-14 lg:pt-36 bg-secondary overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg,var(--primary) 0,var(--primary) 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }} />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                        Cek Status Kelulusan
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                        Masukkan NISN Anda untuk melihat hasil seleksi PPDB SMP Unggulan Hamzanwadi.
                    </p>
                </div>
            </section>

            {/* ── FORM & HASIL ─────────────────────────────────────────── */}
            <section className="py-16 max-w-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                <form method="GET" className="bg-card rounded-2xl border border-border shadow-lg p-6 sm:p-8 space-y-4">
                    <div>
                        <label htmlFor="nisn" className="text-sm font-semibold text-secondary">
                            NISN
                        </label>
                        <p className="text-xs text-muted-foreground mt-0.5 mb-3">
                            Nomor Induk Siswa Nasional (10 digit angka).
                        </p>
                        <Input
                            id="nisn"
                            name="nisn"
                            inputMode="numeric"
                            maxLength={10}
                            defaultValue={nisn}
                            placeholder="Contoh: 0061234567"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full rounded-xl">
                        <Search className="size-4" />
                        Cek Status
                    </Button>
                </form>

                {searched && (
                    !valid ? (
                        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
                            <p className="text-sm font-medium text-destructive">
                                NISN harus 10 digit angka. Periksa kembali masukan Anda.
                            </p>
                        </div>
                    ) : !student ? (
                        <div className="rounded-2xl border border-border bg-card p-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                NISN <span className="font-mono font-semibold text-secondary">{nisn}</span> tidak
                                ditemukan. Pastikan NISN benar atau hubungi panitia PPDB.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-border bg-card shadow-lg p-6 sm:p-8">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-primary">Hasil Seleksi</p>
                                    <h2 className="text-lg font-bold text-secondary mt-1">{student.fullName}</h2>
                                    <p className="text-xs font-mono text-muted-foreground mt-0.5">
                                        No. Daftar: {student.kodePendaftaran} · NISN: {nisn}
                                    </p>
                                </div>
                                {student.status === "DITERIMA" ? (
                                    <Badge>
                                        <FileCheck className="mr-1 h-3 w-3" />
                                        Diterima di Sekolah
                                    </Badge>
                                ) : student.status === "DITOLAK" ? (
                                    <Badge variant="destructive">
                                        <XCircle className="mr-1 h-3 w-3" />
                                        Tidak Diterima
                                    </Badge>
                                ) : (
                                    <Badge variant="outline">
                                        <Clock className="mr-1 h-3 w-3" />
                                        Menunggu
                                    </Badge>
                                )}
                            </div>
                            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                                {student.status === "DITERIMA"
                                    ? "Selamat! Anda dinyatakan diterima di SMP Unggulan Hamzanwadi. Informasi selanjutnya akan disampaikan melalui grup WhatsApp resmi PPDB."
                                    : student.status === "DITOLAK"
                                      ? "Mohon maaf, berdasarkan hasil seleksi Anda belum diterima di SMP Unggulan Hamzanwadi. Tetap semangat dan jangan berhenti berusaha!"
                                      : "Proses seleksi masih berlangsung. Silakan cek kembali secara berkala."}
                            </p>
                        </div>
                    )
                )}
            </section>

            <Footer />
        </div>
    );
}
