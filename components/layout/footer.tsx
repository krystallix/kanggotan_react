import Link from "next/link";
import { MapPin, Phone, Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/30 mt-8">
            <div className="container mx-auto px-4 py-10">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Identitas */}
                    <div>
                        <h3 className="font-bold text-lg mb-2">RISMA Kanggotan</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Organisasi Remaja Masjid At-Ta&apos;awun Kanggotan Lor. Aktif dalam kegiatan keagamaan dan sosial masyarakat.
                        </p>
                    </div>

                    {/* Navigasi */}
                    <div>
                        <h4 className="font-semibold text-sm mb-3">Navigasi</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {[
                                { label: "Beranda", href: "/" },
                                { label: "Tentang Kami", href: "/tentang-kami" },
                                { label: "Kegiatan", href: "/kegiatan" },
                                { label: "Haul Massal", href: "/haul-massal" },
                                { label: "Blog", href: "/blog" },
                            ].map(({ label, href }) => (
                                <li key={href}>
                                    <Link href={href} className="hover:text-primary transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kontak */}
                    <div>
                        <h4 className="font-semibold text-sm mb-3">Kontak</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <MapPin className="size-4 mt-0.5 shrink-0 text-primary" />
                                <span>Masjid At-Ta&apos;awun, Kanggotan Lor, Yogyakarta</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="size-4 shrink-0 text-primary" />
                                <a href="https://wa.me/6281354007400" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                    0813-5400-7400
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Instagram className="size-4 shrink-0 text-primary" />
                                <a href="https://instagram.com/rismakanggotanlor" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                    @rismakanggotanlor
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="size-4 shrink-0 text-primary fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                                </svg>
                                <a href="https://tiktok.com/@rismakanggotanlor" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                    @rismakanggotanlor
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} RISMA Kanggotan Lor. Semua hak dilindungi.
                </div>
            </div>
        </footer>
    );
}
