"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
    { href: "/tentang-sekolah", label: "Tentang" },
    { href: "#program", label: "Program" },
    { href: "#fasilitas", label: "Fasilitas" },
    { href: "#berita", label: "Berita" },
    { href: "#faq", label: "FAQ" },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    return (
        <header className={cn(
            "fixed top-0 inset-x-0 z-50 transition-all duration-300",
            scrolled ? "bg-secondary/95 backdrop-blur-md shadow-lg shadow-black/20" : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                <Link href="/" className="flex items-center gap-2.5 shrink-0">
                    <Image src="/assets/smpuhamzanwadi-panjang.png" alt="SMPU Hamzanwadi" width={140} height={36} className="h-8 w-auto object-contain" />
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-7">
                    {NAV_LINKS.map((l) => (
                        <a key={l.href} href={l.href} className="text-sm font-medium text-white/80 hover:text-primary transition-colors">
                            {l.label}
                        </a>
                    ))}
                </nav>

                <Link href="/ppdb/form" className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold transition-all active:scale-95">
                    Daftar PPDB
                </Link>

                {/* Mobile toggle */}
                <button onClick={() => setOpen(!open)} className="md:hidden text-white p-1">
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile drawer */}
            {open && (
                <div className="md:hidden bg-secondary/98 backdrop-blur-md border-t border-white/10 px-4 pt-4 pb-6 space-y-3">
                    {NAV_LINKS.map((l) => (
                        <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-2 text-white/80 hover:text-primary font-medium transition-colors">
                            {l.label}
                        </a>
                    ))}
                    <Link href="/ppdb/form" onClick={() => setOpen(false)} className="mt-2 flex items-center justify-center px-4 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        Daftar PPDB Sekarang
                    </Link>
                </div>
            )}
        </header>
    );
}
