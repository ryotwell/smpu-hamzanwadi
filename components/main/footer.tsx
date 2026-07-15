import Link from "next/link";
import { GraduationCap, MapPin, Phone, Mail, Share2, Play } from "lucide-react";

export function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-secondary text-white/70 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Brand */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm leading-tight">SMP Unggulan</p>
                            <p className="text-primary font-bold text-sm leading-tight">Hamzanwadi</p>
                        </div>
                    </div>
                    <p className="text-sm leading-relaxed">
                        Mencetak generasi unggul berwawasan global dan berkarakter islami di bawah naungan Yayasan Pondok Pesantren Hamzanwadi.
                    </p>
                    <div className="flex gap-3 pt-1">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors">
                            <Share2 className="h-4 w-4" />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors">
                            <Play className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                {/* Links */}
                <div className="space-y-4">
                    <h4 className="text-white font-semibold text-sm">Navigasi</h4>
                    <ul className="space-y-2.5 text-sm">
                        {[
                            ["#tentang", "Tentang Sekolah"],
                            ["#program", "Program Unggulan"],
                            ["#fasilitas", "Fasilitas"],
                            ["#berita", "Berita & Artikel"],
                            ["/ppdb/info", "Info PPDB"],
                            ["/ppdb/form", "Formulir Pendaftaran"],
                        ].map(([href, label]) => (
                            <li key={href}>
                                <a href={href} className="hover:text-primary transition-colors">{label}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div className="space-y-4">
                    <h4 className="text-white font-semibold text-sm">Kontak</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="flex gap-2.5">
                            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span>{process.env.NEXT_PUBLIC_SCHOOL_CONTACT_ADDRESS}</span>
                        </li>
                        <li className="flex gap-2.5">
                            <Phone className="h-4 w-4 text-primary shrink-0" />
                            <a href={`tel:${process.env.NEXT_PUBLIC_SCHOOL_CONTACT_PHONE}`} className="hover:text-primary transition-colors">
                                {process.env.NEXT_PUBLIC_SCHOOL_CONTACT_PHONE}
                            </a>
                        </li>
                        <li className="flex gap-2.5">
                            <Mail className="h-4 w-4 text-primary shrink-0" />
                            <a href={`mailto:${process.env.NEXT_PUBLIC_SCHOOL_CONTACT_EMAIL}`} className="hover:text-primary transition-colors">
                                {process.env.NEXT_PUBLIC_SCHOOL_CONTACT_EMAIL}
                            </a>
                        </li>
                    </ul>
                    <p className="text-xs text-white/40 pt-2">NPSN: {process.env.NEXT_PUBLIC_SCHOOL_NPSN}</p>
                </div>
            </div>

            <div className="border-t border-white/5 py-5 text-center text-xs text-white/30">
                © {year} SMP Unggulan Hamzanwadi — Hak cipta dilindungi.
            </div>
        </footer>
    );
}
