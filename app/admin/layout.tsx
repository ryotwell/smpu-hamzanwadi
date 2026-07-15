import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Moon, Search, Settings, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { signoutAction } from "@/app/actions/auth";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // Ambil data user dari session
    const session = await getSession();
    const user = session?.userId
        ? await prisma.user.findUnique({ where: { id: session.userId }, select: { name: true, email: true } })
        : null;

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "AD";

    return (
        <TooltipProvider>
            <SidebarProvider>
                <div className="flex h-screen w-full overflow-hidden bg-muted/20">
                    <AppSidebar />
                    <div className="flex flex-col flex-1 min-w-0">
                        {/* Header */}
                        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-6">
                            <SidebarTrigger className="-ml-1" />
                            <div className="w-full flex items-center justify-between">
                                <div className="flex items-center text-xl font-bold">
                                    Dashboard
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-64 max-w-sm hidden sm:block">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Search..."
                                            className="w-full rounded-full bg-muted/50 pl-9 focus-visible:ring-indigo-500"
                                        />
                                    </div>
                                    <button className="rounded-full w-9 h-9 flex items-center justify-center hover:bg-muted text-muted-foreground">
                                        <Moon className="h-5 w-5" />
                                    </button>
                                    <button className="rounded-full w-9 h-9 flex items-center justify-center hover:bg-muted text-muted-foreground relative">
                                        <Bell className="h-5 w-5" />
                                        <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                    </button>

                                    {/* Avatar dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Avatar className="h-9 w-9 border-2 border-background cursor-pointer">
                                                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                                                <AvatarFallback>{initials}</AvatarFallback>
                                            </Avatar>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuLabel className="font-normal">
                                                <div className="flex flex-col gap-0.5">
                                                    <p className="text-sm font-semibold leading-none">{user?.name ?? "Admin"}</p>
                                                    <p className="text-xs leading-none text-muted-foreground">{user?.email ?? ""}</p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="cursor-pointer gap-2">
                                                <User className="h-4 w-4" />
                                                Profil
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer gap-2">
                                                <Settings className="h-4 w-4" />
                                                Pengaturan
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            {/* Signout via server action form */}
                                            <form action={signoutAction}>
                                                <DropdownMenuItem asChild>
                                                    <button
                                                        id="signout-btn"
                                                        type="submit"
                                                        className="w-full cursor-pointer gap-2 text-destructive focus:text-destructive"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Keluar
                                                    </button>
                                                </DropdownMenuItem>
                                            </form>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </header>
                        <main className="flex-1 overflow-auto bg-muted/30">
                            <div className="p-6 h-full">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    );
}