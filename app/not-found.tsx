import Layout from "@/components/layout/home-layout";
import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <section className="py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-black px-8 py-16 text-white shadow-2xl shadow-black/10 md:px-14">
          <div className="absolute inset-0 opacity-18 [background-image:linear-gradient(to_right,rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[oklch(0.457_0.24_277.023)]/40 blur-3xl" />
          <div className="relative max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/70">
              <SearchX className="size-4" />
              404 Not Found
            </div>
            <h1 className="text-5xl font-black tracking-tight md:text-6xl">Halaman tidak ditemukan</h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/60">
              Alamat yang kamu buka tidak tersedia atau sudah dipindahkan.
            </p>
            <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-black transition-all duration-200 hover:-translate-y-0.5">
              Kembali ke beranda <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
