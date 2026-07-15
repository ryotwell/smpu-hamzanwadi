import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GraduationCap, CheckCircle2, Clock, MessageCircle, FileText, CalendarDays } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Pendaftaran Berhasil | PPDB SMPU Hamzanwadi",
    description: "Formulir pendaftaran peserta didik baru Anda telah berhasil dikirim. Silakan bergabung ke grup WhatsApp untuk informasi selanjutnya.",
};

interface PageProps {
    searchParams: Promise<{ id?: string }>;
}

export default async function PPDBSuccessPage({ searchParams }: PageProps) {
    const { id } = await searchParams;

    if (!id) notFound();

    const student = await prisma.student.findUnique({
        where: { id },
        select: {
            id: true,
            kodePendaftaran: true,
            noUrutPendaftaran: true,
            fullName: true,
            asalSekolah: true,
            createdAt: true,
            batch: {
                select: {
                    name: true,
                    jalur: true,
                    whatsappGroupLink: true,
                    endDate: true,
                },
            },
        },
    });

    if (!student) notFound();

    const submittedAt = new Intl.DateTimeFormat("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "Asia/Makassar",
    }).format(student.createdAt);

    const endDateFormatted = student.batch.endDate
        ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Makassar" }).format(
              student.batch.endDate
          )
        : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-indigo-50">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shrink-0">
                        <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">SMPU Hamzanwadi</p>
                        <h1 className="text-base font-bold leading-tight">Formulir Pendaftaran PPDB</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

                {/* ── Success Banner ─────────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                    {/* Green top accent */}
                    <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />

                    <div className="px-6 py-8 flex flex-col items-center text-center gap-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50">
                            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Pendaftaran Berhasil!</h2>
                            <p className="text-muted-foreground mt-1 text-sm max-w-sm">
                                Formulir Anda telah kami terima. Simpan kode pendaftaran di bawah ini sebagai bukti.
                            </p>
                        </div>

                        {/* Kode Pendaftaran */}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-8 py-4 w-full max-w-sm">
                            <p className="text-xs text-emerald-700 font-medium mb-1.5 uppercase tracking-widest">
                                Kode Pendaftaran
                            </p>
                            <p className="text-xl font-mono font-bold text-emerald-700 tracking-wider break-all">
                                {student.kodePendaftaran}
                            </p>
                            <p className="text-xs text-emerald-600 mt-1.5">
                                No. Urut Pendaftar: <span className="font-semibold">#{String(student.noUrutPendaftaran).padStart(5, "0")}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Student Summary ────────────────────────────────────── */}
                <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-indigo-600" />
                        <h3 className="font-semibold text-sm text-gray-700">Ringkasan Pendaftaran</h3>
                    </div>
                    <div className="divide-y text-sm">
                        <Row label="Nama Lengkap" value={student.fullName} />
                        <Row label="Asal Sekolah" value={student.asalSekolah} />
                        <Row label="Gelombang" value={`${student.batch.name} — Jalur ${student.batch.jalur}`} />
                        <Row label="Tanggal Daftar" value={submittedAt} />
                    </div>
                </div>

                {/* ── Waiting Notice ─────────────────────────────────────── */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <div className="flex gap-3">
                        <div className="shrink-0">
                            <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="font-semibold text-amber-800">Menunggu Proses Seleksi</h3>
                            <p className="text-sm text-amber-700 leading-relaxed">
                                Data Anda sedang dalam proses verifikasi dan seleksi oleh panitia PPDB SMPU Hamzanwadi.
                                Harap bersabar dan pantau informasi melalui grup WhatsApp resmi di bawah.
                            </p>
                            {endDateFormatted && (
                                <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-700 font-medium">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    Batas akhir pendaftaran gelombang ini:{" "}
                                    <span className="font-bold">{endDateFormatted}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── WhatsApp Group ─────────────────────────────────────── */}
                {student.batch.whatsappGroupLink ? (
                    <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                <MessageCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Bergabung ke Grup WhatsApp</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            Bergabunglah ke grup WhatsApp resmi PPDB kami untuk mendapatkan informasi terbaru,
                            pengumuman seleksi, dan panduan langkah selanjutnya secara real-time.
                        </p>
                        <a
                            href={student.batch.whatsappGroupLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] transition-all text-white font-semibold py-3 px-6 text-sm shadow-sm shadow-green-200"
                        >
                            <MessageCircle className="h-4 w-4" />
                            Bergabung Grup WhatsApp Sekarang
                        </a>
                        <p className="text-xs text-muted-foreground text-center mt-3">
                            Pastikan nomor WhatsApp Anda aktif untuk menerima notifikasi penting.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                <MessageCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Grup WhatsApp</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Link grup WhatsApp akan segera tersedia. Pantau halaman ini atau hubungi pihak sekolah.
                        </p>
                    </div>
                )}

                {/* ── Next Steps ─────────────────────────────────────────── */}
                <div className="bg-white rounded-2xl border shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Langkah Selanjutnya</h3>
                    <ol className="space-y-3">
                        {[
                            { step: "1", text: "Simpan kode pendaftaran Anda sebagai bukti registrasi." },
                            { step: "2", text: "Bergabung ke grup WhatsApp resmi PPDB untuk mendapatkan informasi seleksi." },
                            { step: "3", text: "Pantau pengumuman hasil seleksi melalui grup WhatsApp atau website sekolah." },
                            { step: "4", text: "Jika dinyatakan lolos, ikuti proses daftar ulang sesuai jadwal yang ditentukan." },
                        ].map(({ step, text }) => (
                            <li key={step} className="flex gap-3 text-sm text-gray-600">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
                                    {step}
                                </span>
                                <span className="leading-relaxed pt-0.5">{text}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* ── Back link ──────────────────────────────────────────── */}
                <p className="text-center text-xs text-muted-foreground pb-4">
                    Punya pertanyaan?{" "}
                    <Link href="/" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800 transition-colors">
                        Kunjungi website kami
                    </Link>{" "}
                    atau hubungi panitia melalui grup WhatsApp.
                </p>
            </div>

            {/* Footer */}
            <div className="border-t bg-white">
                <div className="max-w-2xl mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} SMPU Hamzanwadi — Sistem Pendaftaran Online
                </div>
            </div>
        </div>
    );
}

// ── Helper component ──────────────────────────────────────────────────────────

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-start gap-4 py-2.5">
            <span className="text-muted-foreground shrink-0">{label}</span>
            <span className="font-medium text-right text-gray-800">{value}</span>
        </div>
    );
}
