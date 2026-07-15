import { prisma } from "@/lib/prisma";
import { StudentForm } from "@/components/ppdb/student-form";
import { FileText, GraduationCap } from "lucide-react";

export const metadata = {
    title: "Formulir Pendaftaran PPDB | SMPU Hamzanwadi",
    description: "Isi formulir pendaftaran peserta didik baru SMPU Hamzanwadi secara online.",
};

export default async function PPDBFormPage() {
    const batches = await prisma.batch.findMany({
        where: { isActive: true },
        select: { id: true, name: true, jalur: true },
        orderBy: { createdAt: "asc" },
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
            {/* Header */}
            <div className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shrink-0">
                        <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">SMPU Hamzanwadi</p>
                        <h1 className="text-base font-bold leading-tight">Formulir Pendaftaran PPDB</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {batches.length === 0 ? (
                    /* No active batch */
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                        <div className="p-4 bg-muted rounded-full">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Pendaftaran Belum Dibuka</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Saat ini belum ada gelombang pendaftaran yang aktif.<br />
                                Pantau terus informasi dari sekolah.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border shadow-sm p-6 md:p-8">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold">Data Pendaftaran</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Isi semua kolom bertanda <span className="text-destructive font-medium">*</span> dengan lengkap dan benar.
                            </p>
                        </div>
                        <StudentForm mode="create" batches={batches} />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t bg-white mt-8">
                <div className="max-w-4xl mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} SMPU Hamzanwadi — Sistem Pendaftaran Online
                </div>
            </div>
        </div>
    );
}