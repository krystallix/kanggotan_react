import DashLayout from "@/components/layout/dash-layout";
import Link from "next/link";
import { Activity, ArrowRight, CalendarDays, DatabaseZap, Ghost, Trophy } from "lucide-react";

const cards = [
    {
        title: "Kegiatan",
        description: "Kelola agenda, kategori, lomba, pertandingan, dan sponsor kegiatan.",
        href: "/dashboard/kegiatan",
        icon: Activity,
    },
    {
        title: "Lomba",
        description: "Atur lomba, jadwal pertandingan, skor, dan klasemen.",
        href: "/dashboard/kegiatan/lomba",
        icon: Trophy,
    },
    {
        title: "Haul",
        description: "Input dan arsip data arwah untuk haul massal.",
        href: "/dashboard/haul/data",
        icon: Ghost,
    },
    {
        title: "Data",
        description: "Pusat pengelolaan data pendukung RISMA Kanggotan Lor.",
        href: "/dashboard/data",
        icon: DatabaseZap,
    },
]

export default function DashboardPage() {
    return (
        <DashLayout>
            <div className="space-y-6">
                <section className="relative overflow-hidden rounded-[2rem] bg-[oklch(0.457_0.24_277.023)] p-8 text-white shadow-2xl shadow-black/10 md:p-10">
                    <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,0.24)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.24)_1px,transparent_1px)] [background-size:42px_42px]" />
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
                    <div className="relative max-w-3xl">
                        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/70">
                            <CalendarDays className="size-4" />
                            Dashboard RISMA
                        </p>
                        <h1 className="text-4xl font-black tracking-tight md:text-6xl">Kelola kegiatan Kanggotan dari satu tempat</h1>
                        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70">
                            Panel admin untuk publikasi kegiatan, data haul, lomba, pertandingan, sponsor, dan klasemen.
                        </p>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {cards.map(({ title, description, href, icon: Icon }) => (
                        <Link
                            key={title}
                            href={href}
                            className="group relative min-h-48 overflow-hidden rounded-2xl bg-white p-6 shadow-none border border-black/8 transition-all duration-300 hover:-translate-y-1 hover:border-black/20"
                        >
                            <div className="absolute -bottom-10 -right-8 h-28 w-24 rotate-12 rounded-[2rem] bg-[oklch(0.457_0.24_277.023)]" />
                            <div className="absolute -bottom-8 right-14 h-16 w-12 rotate-12 rounded-t-full bg-black" />
                            <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                                <div>
                                    <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[oklch(0.457_0.24_277.023)]/10 text-[oklch(0.457_0.24_277.023)]">
                                        <Icon className="size-6" />
                                    </div>
                                    <h2 className="text-lg font-bold tracking-tight text-black">{title}</h2>
                                    <p className="mt-2 text-sm leading-relaxed text-black/50">{description}</p>
                                </div>
                                <span className="inline-flex items-center gap-2 text-xs font-bold text-black">
                                    Buka <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-1" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </section>
            </div>
        </DashLayout>
    );
}
