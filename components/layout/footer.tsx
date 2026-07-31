import Link from "next/link";
import { MapPin, Phone, Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative mt-16 overflow-hidden bg-[oklch(0.457_0.24_277.023)] text-white">
            <div className="absolute inset-0 opacity-18 [background-image:linear-gradient(to_right,rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:42px_42px]" />
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-black/20 blur-3xl" />
            <div className="container relative mx-auto px-4 max-w-6xl">
                <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr] py-12">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="size-7 rounded-lg bg-white flex items-center justify-center shrink-0">
                                <span className="text-[oklch(0.457_0.24_277.023)] font-black text-xs">K</span>
                            </span>
                             <span className="font-bold text-base tracking-tight text-white">Kanggotan</span>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed max-w-[28ch]">
                            Remaja Masjid At-Ta&apos;awun Kanggotan Lor. Aktif dalam kegiatan keagamaan dan sosial masyarakat.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-xs tracking-widest uppercase text-white/55 mb-4">Navigasi</h4>
                        <ul className="space-y-2.5 text-sm">
                            {[
                                { label: "Beranda", href: "/" },
                                { label: "Tentang kami", href: "/tentang-kami" },
                                { label: "Kegiatan", href: "/kegiatan" },
                                { label: "Haul Massal", href: "/haul-massal" },
                                { label: "Blog", href: "/blog" },
                            ].map(({ label, href }) => (
                                <li key={href}>
                                    <Link href={href} className="text-white/70 hover:text-white transition-colors duration-200">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-xs tracking-widest uppercase text-white/55 mb-4">Kontak</h4>
                        <ul className="space-y-2.5 text-sm text-white/70">
                            <li className="flex items-start gap-2">
                                <MapPin className="size-4 mt-0.5 shrink-0 text-white" />
                                <span>Kanggotan Lor, Yogyakarta</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="size-4 shrink-0 text-white" />
                                <a href="https://wa.me/6281354007400" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">
                                    0813-5400-7400
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Instagram className="size-4 shrink-0 text-white" />
                                <a href="https://instagram.com/rismakanggotanlor" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">
                                    @rismakanggotanlor
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/15 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/55">
                    <span>&copy; {new Date().getFullYear()} RISMA Kanggotan Lor</span>
                    <span>Masjid At-Ta&apos;awun · Kanggotan Lor</span>
                </div>
            </div>
        </footer>
    );
}
