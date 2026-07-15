import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, UserPlus, GraduationCap } from "lucide-react";
import { SalesChart, ActiveCustomersChart, PopularCategoriesChart } from "@/components/dashboard-charts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface IDashboardPageProps {}

const candidates = [
    { name: "Ahmad Fauzi", brand: "SDN 1 Selong", score: "85.5", icon: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
    { name: "Budi Santoso", brand: "SDN 2 Pancor", score: "92.0", icon: "https://i.pravatar.cc/150?u=a042581f4e29026024e" },
    { name: "Citra Kirana", brand: "MI NW Pancor", score: "78.5", icon: "https://i.pravatar.cc/150?u=a042581f4e29026024f" },
    { name: "Dewi Lestari", brand: "SDN 3 Selong", score: "88.0", icon: "https://i.pravatar.cc/150?u=a042581f4e29026024g" },
    { name: "Eko Prasetyo", brand: "SDN 1 Masbagik", score: "75.0", icon: "https://i.pravatar.cc/150?u=a042581f4e29026024h" },
    { name: "Fatimah Azzahra", brand: "MI Muhammadiyah", score: "90.5", icon: "https://i.pravatar.cc/150?u=a042581f4e29026024i" },
];

const stats = [
    {
        label: "Total Siswa Aktif",
        value: "452",
        sub: "Tahun Ajaran 2026/2027",
        trend: "5.2%",
        icon: Users,
        iconBg: "bg-indigo-100 text-indigo-600",
    },
    {
        label: "Pendaftar PPDB",
        value: "128",
        sub: "Gelombang 1",
        trend: "12.5%",
        icon: UserPlus,
        iconBg: "bg-amber-100 text-amber-600",
    },
    {
        label: "Guru & Staf",
        value: "45",
        sub: "Tetap & Honorer",
        trend: null,
        icon: GraduationCap,
        iconBg: "bg-teal-100 text-teal-600",
    },
];

export const DashboardPage: FC<IDashboardPageProps> = () => {
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
                    <SalesChart />
                    <ActiveCustomersChart />
                </div>

                {/* Right — Categories + Candidates */}
                <div className="flex flex-col gap-4 md:gap-6 min-w-0">
                    <PopularCategoriesChart />

                    <Card className="shadow-sm border-0 ring-1 ring-border/50">
                        <CardContent className="p-4 md:p-6">
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h3 className="text-base md:text-lg font-bold">Calon Siswa Terbaru</h3>
                                <button className="text-xs md:text-sm text-muted-foreground hover:text-foreground shrink-0 ml-2">
                                    Lihat Semua
                                </button>
                            </div>
                            <div className="flex flex-col gap-4 md:gap-5">
                                {candidates.map((c, index) => (
                                    <div key={index} className="flex items-center justify-between gap-2 min-w-0">
                                        <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                            <Avatar className="h-8 w-8 md:h-10 md:w-10 shrink-0 border bg-muted">
                                                <AvatarImage src={c.icon} />
                                                <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-semibold text-xs md:text-sm truncate">{c.name}</span>
                                                <span className="text-xs text-muted-foreground truncate">{c.brand}</span>
                                            </div>
                                        </div>
                                        <span className="text-xs md:text-sm font-semibold text-indigo-600 shrink-0 tabular-nums">
                                            {c.score}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
