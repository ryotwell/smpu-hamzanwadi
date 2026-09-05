"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Building2,
  CalendarRange,
  ClipboardCheck,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Newspaper,
  School,
  Settings,
  Trophy,
  type LucideIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const items: { title: string; url: string; icon: LucideIcon; badge?: string }[] = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "PPDB Online", url: "/admin/ppdb", icon: GraduationCap },
  { title: "Hasil Seleksi SAW", url: "/admin/saw", icon: Trophy },
  { title: "Batch", url: "/admin/batch", icon: CalendarRange },
  { title: "Kurikulum", url: "/admin/curriculum", icon: ClipboardCheck },
  { title: "Fasilitas", url: "/admin/facility", icon: Building2 },
  { title: "Persyaratan", url: "/admin/requirement", icon: ClipboardCheck },
  { title: "Pertanyaan", url: "/admin/faq", icon: HelpCircle },
  { title: "Berita & Artikel", url: "/admin/posts", icon: Newspaper },
  { title: "Pengaturan", url: "#", icon: Settings },
]


export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="h-16 px-6 flex items-center justify-start flex-row gap-3">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <School className="size-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-bold leading-tight">SMPU Hamzanwadi</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Sistem Informasi</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 mt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase font-medium text-muted-foreground tracking-wider mb-2">Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(item.url + '/');

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title} className={isActive ? "bg-indigo-600 hover:bg-indigo-600/90 text-white hover:text-white data-[active=true]:bg-indigo-600 data-[active=true]:text-white" : "text-muted-foreground hover:text-foreground"}>
                      <Link href={item.url} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <item.icon className="size-5" />
                          <span className="font-medium text-[15px]">{item.title}</span>
                        </div>
                        {item.badge && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-medium text-white">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3 w-full p-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm leading-tight">
            <span className="font-semibold">Admin Sekolah</span>
            <span className="text-muted-foreground text-[10px]">admin@smpuhamzanwadi</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
