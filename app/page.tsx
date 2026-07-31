import Layout from "@/components/layout/home-layout";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MoveRight } from "lucide-react";
import { getKategoriAll } from "@/lib/supabase/queries-server";
import { icons as lucideIcons } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion";

export default async function Page() {
  const kategoriList = await getKategoriAll()

  return (
    <Layout>
      <section className="relative py-16 lg:py-20">
        <div className="absolute inset-x-[-24px] top-0 bottom-10 -z-10 bg-[#F3F3F3]" />
        <FadeIn y={24}>
          <div className="relative rounded-[2rem] bg-white p-4 shadow-2xl shadow-black/10 ring-1 ring-black/5">
            <div className="relative min-h-[560px] overflow-hidden rounded-[1.5rem] bg-[oklch(0.457_0.24_277.023)] px-8 py-10 lg:px-14 lg:py-16">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(255,255,255,0.55),transparent_30%),radial-gradient(circle_at_85%_90%,rgba(0,0,0,0.08),transparent_22%)]" />
              <div className="relative z-10 max-w-2xl">
                <div className="mb-16 flex items-center gap-2 text-xs font-semibold text-white/70">
                  <span>RISMA Kanggotan</span>
                  <span className="size-4 rounded-full bg-black text-[9px] text-white grid place-items-center">+</span>
                </div>
                <h1 className="text-6xl sm:text-7xl lg:text-[6rem] font-black leading-[0.9] tracking-tighter text-white mb-8">
                  Membangun<br />
                  Generasi<br />
                  Berakhlak
                </h1>
                <p className="max-w-sm text-sm leading-relaxed text-white/70 mb-8">
                  RISMA Kanggotan Lor aktif dalam kegiatan keagamaan, sosial, dan pemberdayaan pemuda bersama warga.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/kegiatan" className="inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-3 text-sm font-bold text-white shadow-xl shadow-black/20 transition-all duration-200 hover:-translate-y-0.5">
                    Lihat kegiatan <MoveRight className="size-4" />
                  </Link>
                  <Link href="/tentang-kami" className="inline-flex items-center gap-2 rounded-2xl bg-white/70 px-6 py-3 text-sm font-bold text-black backdrop-blur transition-all duration-200 hover:-translate-y-0.5">
                    Tentang kami <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </FadeIn>
      </section>

      <section className="py-14">
        <FadeIn className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-black/40 mb-3">Program</p>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-black">Kegiatan utama</h2>
          </div>
          <Link
            href="/kegiatan"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-black/40 hover:text-black transition-colors duration-200 shrink-0"
          >
            Semua kegiatan <ArrowRight className="size-4" />
          </Link>
        </FadeIn>

        <StaggerChildren stagger={0.08} className="grid md:grid-cols-3 gap-5">
          {kategoriList.map((kat) => {
            const IconComponent = lucideIcons[kat.icon as keyof typeof lucideIcons]
            return (
              <StaggerItem key={kat.id}>
                <Link
                  href={`/kegiatan?kategori=${kat.id}`}
                  className="group relative flex min-h-44 flex-col justify-between gap-6 overflow-hidden rounded-3xl bg-[#F5F5F5] p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-[#EFEFEF] hover:shadow-lg hover:shadow-black/5"
                >
                  <div className="absolute -bottom-10 -right-8 h-28 w-24 rotate-12 rounded-[2rem] bg-[oklch(0.457_0.24_277.023)]" />
                  <div className="absolute -bottom-8 right-14 h-16 w-12 rotate-12 rounded-t-full bg-black" />
                  <div className="relative z-10 max-w-[15rem]">
                    <h3 className="font-semibold mb-2 text-black">{kat.name}</h3>
                    {kat.description && (
                      <p className="text-sm text-black/50 leading-relaxed line-clamp-2">{kat.description}</p>
                    )}
                  </div>
                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-black">
                      Selengkapnya <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                    <div className="inline-flex items-center justify-center size-10 rounded-2xl bg-white/70">
                      {IconComponent
                        ? <IconComponent className="size-5 text-black" />
                        : <CalendarDays className="size-5 text-black" />}
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            )
          })}
        </StaggerChildren>

        <div className="mt-5 md:hidden">
          <Link href="/kegiatan" className="inline-flex items-center gap-1.5 text-sm font-semibold text-black">
            Semua kegiatan <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <FadeIn>
            <p className="text-xs font-medium tracking-widest uppercase text-black/40 mb-4">Tentang kami</p>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-6 text-black">
              Remaja Masjid<br />At-Ta&apos;awun
            </h2>
            <p className="text-black/50 leading-relaxed mb-4 max-w-[55ch]">
              Didirikan untuk menopang seluruh kegiatan keagamaan di lingkungan Kanggotan Lor, RISMA juga aktif dalam kegiatan sosial dan pemberdayaan pemuda bersama warga.
            </p>
            <p className="text-black/50 leading-relaxed mb-8 max-w-[55ch]">
              Bergerak di bawah bimbingan Takmir Masjid At-Ta&apos;awun, kami percaya bahwa pemuda yang kuat iman dan akhlaknya adalah fondasi masyarakat yang sehat.
            </p>
            <Link
              href="/tentang-kami"
              className="inline-flex items-center gap-2 font-semibold text-sm text-black hover:gap-3 transition-all duration-200"
            >
              Selengkapnya <ArrowRight className="size-4" />
            </Link>
          </FadeIn>

          <StaggerChildren stagger={0.07} className="grid grid-cols-2 gap-3">
            {[
              { label: "Visi", text: "Generasi muda yang beriman, berilmu, dan berdaya guna bagi masjid dan masyarakat." },
              { label: "Misi", text: "Pembinaan ibadah, literasi keagamaan, dan kolaborasi sosial bersama warga." },
              { label: "Naungan", text: "Takmir Masjid At-Ta'awun sebagai wadah pembinaan dan pelaksanaan kegiatan." },
              { label: "Wilayah", text: "Aktif melayani masyarakat di lingkungan Kanggotan Lor, Yogyakarta." },
            ].map(({ label, text }) => (
              <StaggerItem key={label}>
                <div className="bg-[#F5F5F5] rounded-2xl p-6 hover:bg-[#EFEFEF] transition-colors duration-200 h-full">
                  <p
                    className="text-xs font-bold tracking-widest uppercase mb-2"
                    style={{ color: "#111" }}
                  >
                    {label}
                  </p>
                  <p className="text-sm text-black/50 leading-relaxed">{text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <section className="py-20 border-t border-black/8">
        <FadeIn>
          <p className="text-xs font-medium tracking-widest uppercase text-black/40 mb-3">Tulisan</p>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-black">Blog terbaru</h2>
            <Link href="/blog" className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-black/40 hover:text-black transition-colors duration-200 shrink-0">
              Semua <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl overflow-hidden border border-black/8 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/8 transition-all duration-300 group lg:col-span-3">
              <div className="relative h-64 lg:h-80 w-full overflow-hidden bg-[#F5F5F5]">
                <Image
                  src="https://picsum.photos/seed/risma-refleksi/1200/600"
                  alt="Refleksi akhir tahun"
                  fill
                  sizes="(min-width: 1024px) 1200px, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 lg:p-8 bg-white">
                <p className="text-xs text-black/40 mb-2">26 Des 2025</p>
                <h3 className="text-2xl font-semibold leading-snug mb-2 text-black">Refleksi akhir tahun RISMA Kanggotan</h3>
                <p className="text-sm text-black/50 max-w-3xl">
                  Perjalanan setahun penuh, dari kegiatan sosial hingga pembinaan remaja masjid yang terus tumbuh.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="py-16">
        <FadeIn>
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-12 md:px-14"
            style={{ background: "#111111" }}
          >
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-30"
              style={{ background: "oklch(0.457 0.24 277.023)", filter: "blur(60px)" }}
            />
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-white">Ada pertanyaan atau ingin kolaborasi?</h2>
                <p className="text-white/40 text-sm">Hubungi kami — terbuka untuk kegiatan bersama di Kanggotan Lor.</p>
              </div>
              <a
                href="https://wa.me/6281354007400"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                style={{ background: "oklch(0.457 0.24 277.023)" }}
              >
                Hubungi via WhatsApp <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </FadeIn>
      </section>
    </Layout>
  );
}
