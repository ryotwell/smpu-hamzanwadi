import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, UserPlus, UserCheck, Clock } from "lucide-react";
import { RegistrationChart, StatusChart } from "@/components/dashboard-charts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

// ponytail: agregasi bulanan di memori — pindah ke groupBy/raw SQL jika data >10rb siswa.
export default async function DashboardPage() {
    const students = await prisma.student.findMany({
        select: { createdAt: true, isAccepted: true },
    });

    const [activeBatch, recent] = await Promise.all([
        prisma.batch.findFirst({ where: { isActive: true }, orderBy: { startDate: "desc" } }),
        prisma.student.findMany({
            orderBy: { createdAt: "desc" },
            take: 6,
            select: { id: true, fullName: true, asalSekolah: true, rataRataRaport: true },
        }),
    ]);

    const diterima = students.filter((s) => s.isAccepted).length;
    const menunggu = students.length - diterima;

    const now = new Date();
    const windowStart = new Date(now.getFullYear(), now.getMonth() - 11).getTime();
    const thisMonth = new Date(now.getFullYear(), now.getMonth()).getTime();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1).getTime();
    let bulanIni = 0;
    let bulanLalu = 0;

    const registrationData = MONTHS.map((month) => ({ month, pendaftar: 0, lulus: 0 }));
    for (const s of students) {
        const t = s.createdAt.getTime();
        if (t < windowStart) continue;
        const m = s.createdAt.getMonth();
        registrationData[m].pendaftar++;
        if (s.isAccepted) registrationData[m].lulus++;
        if (t >= thisMonth) bulanIni++;
        else if (t >= lastMonth) bulanLalu++;
    }
    const trend = bulanLalu
        ? `${(((bulanIni - bulanLalu) / bulanLalu) * 100).toFixed(1)}%`
        : null;

    const stats = [
        {
            label: "Pendaftar PPDB",
            value: students.length,
            sub: activeBatch ? activeBatch.name : "Semua Gelombang",
            trend,
            icon: UserPlus,
            iconBg: "bg-amber-100 text-amber-600",
        },
        {
            label: "Siswa Diterima",
            value: diterima,
            sub: "Lulus seleksi PPDB",
            trend: null,
            icon: UserCheck,
            iconBg: "bg-indigo-100 text-indigo-600",
        },
        {
            label: "Menunggu Verifikasi",
            value: menunggu,
            sub: "Perlu ditinjau",
            trend: null,
            icon: Clock,
            iconBg: "bg-teal-100 text-teal-600",
        },
    ];

    return (
        <div className="flex flex-col gap-4 md:gap-6 w-full max-w-7xl mx-auto">

            {/* ── Stat Cards ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                {stats.map((stat, i) => (
                    <Card
                        key={stat.label}
                        className={`shadow-sm border-0 ring-1 ring-border/50 ${i === 2 ? "col-span-2 md:col-span-1" : ""}`}
                    >
                        <CardContent className="p-4 md:p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-1 min-w-0 mr-2">
                                    <span className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight">
                                        {stat.label}
                                    </span>
                                    <span className="text-2xl sm:text-3xl font-bold tracking-tight">
                                        {stat.value}
                                    </span>
                                </div>
                                <div className={`shrink-0 p-2 sm:p-3 rounded-lg ${stat.iconBg}`}>
                                    <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                </div>
                            </div>
                            <div className="mt-3 md:mt-4 flex items-center justify-between">
                                <span className="text-muted-foreground font-medium text-xs truncate mr-2">
                                    {stat.sub}
                                </span>
                                {stat.trend && (
                                    <div className="flex shrink-0 items-center text-emerald-500 font-medium text-xs">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        {stat.trend}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── Main Content ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                {/* Left — Charts */}
                <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6 min-w-0">
                    <RegistrationChart data={registrationData} />
                </div>

                {/* Right — Categories + Candidates */}
                <div className="flex flex-col gap-4 md:gap-6 min-w-0">
                    <StatusChart diterima={diterima} menunggu={menunggu} />

                    <Card className="shadow-sm border-0 ring-1 ring-border/50">
                        <CardContent className="p-4 md:p-6">
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h3 className="text-base md:text-lg font-bold">Calon Siswa Terbaru</h3>
                                <Link
                                    href="/admin/ppdb"
                                    className="text-xs md:text-sm text-muted-foreground hover:text-foreground shrink-0 ml-2"
                                >
                                    Lihat Semua
                                </Link>
                            </div>
                            <div className="flex flex-col gap-4 md:gap-5">
                                {recent.map((c) => (
                                    <Link
                                        key={c.id}
                                        href={`/admin/ppdb/${c.id}`}
                                        className="flex items-center justify-between gap-2 min-w-0"
                                    >
                                        <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                            <Avatar className="h-8 w-8 md:h-10 md:w-10 shrink-0 border bg-muted">
                                                <AvatarFallback>{c.fullName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-semibold text-xs md:text-sm truncate">{c.fullName}</span>
                                                <span className="text-xs text-muted-foreground truncate">{c.asalSekolah}</span>
                                            </div>
                                        </div>
                                        <span className="text-xs md:text-sm font-semibold text-indigo-600 shrink-0 tabular-nums">
                                            {c.rataRataRaport != null ? c.rataRataRaport.toFixed(1) : "—"}
                                        </span>
                                    </Link>
                                ))}
                                {recent.length === 0 && (
                                    <p className="text-sm text-muted-foreground">Belum ada pendaftar.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
