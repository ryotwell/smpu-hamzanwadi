"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts"
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

type RegistrationData = { month: string; pendaftar: number; lulus: number }[];

const registrationConfig = {
  pendaftar: {
    label: "Total Pendaftar",
    color: "#4f46e5", // indigo-600
  },
  lulus: {
    label: "Lulus Seleksi",
    color: "#e0e7ff", // indigo-100
  },
} satisfies ChartConfig

export function RegistrationChart({ data }: { data: RegistrationData }) {
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
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={registrationConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

const statusConfig = {
  diterima: {
    label: "Diterima",
    color: "#4f46e5",
  },
  menunggu: {
    label: "Menunggu",
    color: "#f59e0b",
  },
  tidakDiterima: {
    label: "Tidak Diterima",
    color: "#ef4444",
  },
} satisfies ChartConfig

export function StatusChart({ diterima, menunggu, ditolak }: { diterima: number; menunggu: number; ditolak: number }) {
  const total = diterima + menunggu + ditolak
  const pct = (v: number) => (total ? Math.round((v / total) * 100) : 0)
  const data = [
    { name: "Diterima", value: diterima, color: "#4f46e5" },
    { name: "Menunggu", value: menunggu, color: "#f59e0b" },
    { name: "Tidak Diterima", value: ditolak, color: "#ef4444" },
  ]

  return (
    <Card className="shadow-sm border-0 ring-1 ring-border/50 flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">Status Pendaftar PPDB</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center pt-4">
        <div className="h-[200px] w-full relative">
          <ChartContainer config={statusConfig} className="h-full w-full">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            </PieChart>
          </ChartContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-bold">{pct(diterima)}%</span>
            <span className="text-xs text-muted-foreground">Diterima</span>
          </div>
        </div>

        <div className="grid gap-y-2 mt-6 w-full text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#4f46e5" }}></div>
            <span className="text-muted-foreground flex-1">{pct(diterima)}% Diterima</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#f59e0b" }}></div>
            <span className="text-muted-foreground flex-1">{pct(menunggu)}% Menunggu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#ef4444" }}></div>
            <span className="text-muted-foreground flex-1">{pct(ditolak)}% Tidak Diterima</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
