"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Area, AreaChart, Pie, PieChart, Cell } from "recharts"
import { MoreHorizontal } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const salesData = [
  { month: "Jan", lulus: 10, pendaftar: 20 },
  { month: "Feb", lulus: 15, pendaftar: 25 },
  { month: "Mar", lulus: 20, pendaftar: 30 },
  { month: "Apr", lulus: 25, pendaftar: 40 },
  { month: "May", lulus: 50, pendaftar: 80 },
  { month: "Jun", lulus: 120, pendaftar: 150 }, // Highlighted PPDB peak
  { month: "Jul", lulus: 80, pendaftar: 100 },
  { month: "Aug", lulus: 5, pendaftar: 10 },
  { month: "Sep", lulus: 5, pendaftar: 8 },
  { month: "Oct", lulus: 2, pendaftar: 5 },
  { month: "Nov", lulus: 0, pendaftar: 2 },
]

const salesConfig = {
  lulus: {
    label: "Lulus Seleksi",
    color: "#e0e7ff", // indigo-100
  },
  pendaftar: {
    label: "Total Pendaftar",
    color: "#4f46e5", // indigo-600
  },
} satisfies ChartConfig

export function SalesChart() {
  return (
    <Card className="shadow-sm border-0 ring-1 ring-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">Statistik Pendaftaran PPDB</CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-100"></div>
            Lulus Seleksi
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
            Total Pendaftar
          </div>
          <select className="border rounded-md px-2 py-1 text-xs bg-transparent outline-none">
            <option>Bulanan</option>
            <option>Mingguan</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={salesConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 12 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar dataKey="lulus" fill="var(--color-lulus)" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="pendaftar" fill="var(--color-pendaftar)" radius={[4, 4, 0, 0]} barSize={16} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const customerData = [
  { month: "Jan", hadir: 440, izin: 12 },
  { month: "Feb", hadir: 435, izin: 17 },
  { month: "Mar", hadir: 442, izin: 10 },
  { month: "Apr", hadir: 420, izin: 32 },
  { month: "May", hadir: 445, izin: 7 },
  { month: "Jun", hadir: 448, izin: 4 },
  { month: "Jul", hadir: 450, izin: 2 }, // Highlighted in design
  { month: "Aug", hadir: 430, izin: 22 },
  { month: "Sep", hadir: 445, izin: 7 },
  { month: "Oct", hadir: 440, izin: 12 },
  { month: "Nov", hadir: 442, izin: 10 },
  { month: "Dec", hadir: 438, izin: 14 },
]

const attendanceConfig = {
  hadir: {
    label: "Hadir",
    color: "#4f46e5", // indigo-600
  },
  izin: {
    label: "Izin/Sakit",
    color: "#e0e7ff", // indigo-100
  },
} satisfies ChartConfig

export function ActiveCustomersChart() {
  return (
    <Card className="shadow-sm border-0 ring-1 ring-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">Tingkat Kehadiran Siswa</CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
           <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-100"></div>
            Izin/Sakit
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
            Hadir
          </div>
          <select className="border rounded-md px-2 py-1 text-xs bg-transparent outline-none">
            <option>Bulanan</option>
            <option>Mingguan</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={attendanceConfig} className="h-[250px] w-full">
          <AreaChart accessibilityLayer data={customerData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 12 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area
              type="monotone"
              dataKey="izin"
              stroke="var(--color-izin)"
              fill="var(--color-izin)"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="hadir"
              stroke="var(--color-hadir)"
              fill="var(--color-hadir)"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const categoryData = [
  { name: "Diterima", value: 45, color: "#4f46e5" }, // indigo-600
  { name: "Menunggu", value: 35, color: "#f59e0b" }, // amber-500
  { name: "Ditolak", value: 15, color: "#ef4444" }, // red-500
  { name: "Berkas Tidak Valid", value: 5, color: "#9ca3af" }, // gray-400
]

const categoryConfig = {
  Diterima: { label: "Diterima", color: "#4f46e5" },
  Menunggu: { label: "Menunggu Seleksi", color: "#f59e0b" },
  Ditolak: { label: "Ditolak", color: "#ef4444" },
  BerkasTidakValid: { label: "Berkas Tidak Valid", color: "#9ca3af" },
} satisfies ChartConfig

export function PopularCategoriesChart() {
  return (
    <Card className="shadow-sm border-0 ring-1 ring-border/50 flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">Status Pendaftar PPDB</CardTitle>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center pt-4">
        <div className="h-[200px] w-full relative">
          <ChartContainer config={categoryConfig} className="h-full w-full">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            </PieChart>
          </ChartContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-bold">45%</span>
            <span className="text-xs text-muted-foreground">Diterima</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-6 w-full text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#4f46e5" }}></div>
            <span className="text-muted-foreground flex-1">45% Diterima</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#f59e0b" }}></div>
            <span className="text-muted-foreground flex-1">35% Menunggu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#ef4444" }}></div>
            <span className="text-muted-foreground flex-1">15% Ditolak</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#9ca3af" }}></div>
            <span className="text-muted-foreground flex-1">5% Tdk Valid</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
