import Layout from "@/components/layout/home-layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, MoveRight } from "lucide-react";
import { getKategoriAll, getKegiatanTerbaru } from "@/lib/supabase/queries-server";
import { icons as lucideIcons } from "lucide-react";

export default async function Page() {
  const kategoriList = await getKategoriAll()
  const agendaList = await getKegiatanTerbaru(3)

  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="min-h-[calc(100dvh-72px)] flex items-center py-16">
        <div className="w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex flex-col gap-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Remaja Masjid At-Ta&apos;awun · Kanggotan Lor
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              Membangun<br />
              Generasi Muda<br />
              <span className="text-primary">Berakhlak Mulia</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              RISMA Kanggotan Lor aktif dalam kegiatan keagamaan, sosial, dan pemberdayaan pemuda — bersama warga, untuk warga.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" asChild>
                <Link href="/kegiatan">Lihat Kegiatan <MoveRight className="size-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/tentang-kami">Tentang Kami</Link>
              </Button>
            </div>
            <div className="flex gap-10 pt-6 border-t border-border">
              {[
                { n: "30+", label: "Tahun Berdiri" },
                { n: "100+", label: "Anggota Aktif" },
                { n: "10+", label: "Kegiatan / Tahun" },
              ].map(({ n, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold">{n}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:flex items-center justify-center">
            <Image
              src="/people.svg"
              alt="Ilustrasi pemuda RISMA"
              width={480}
              height={360}
              priority
            />
          </div>
        </div>
      </section>

      {/* ── TENTANG ── */}
      <section className="py-20 border-t border-border">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">Tentang Kami</p>
            <h2 className="text-4xl font-bold leading-tight mb-6">
              Remaja Masjid At-Ta&apos;awun
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Didirikan untuk menopang seluruh kegiatan keagamaan di lingkungan Kanggotan Lor, RISMA juga aktif dalam kegiatan sosial dan pemberdayaan pemuda bersama warga.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Bergerak di bawah bimbingan Takmir Masjid At-Ta&apos;awun, kami percaya bahwa pemuda yang kuat iman dan akhlaknya adalah fondasi masyarakat yang sehat.
            </p>
            <Link href="/tentang-kami" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline underline-offset-4 text-sm">
              Selengkapnya <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border">
            {[
              { label: "Visi", text: "Generasi muda yang beriman, berilmu, dan berdaya guna bagi masjid dan masyarakat." },
              { label: "Misi", text: "Pembinaan ibadah, literasi keagamaan, dan kolaborasi sosial bersama warga." },
              { label: "Naungan", text: "Takmir Masjid At-Ta'awun sebagai wadah pembinaan dan pelaksanaan kegiatan." },
              { label: "Wilayah", text: "Aktif melayani masyarakat di lingkungan Kanggotan Lor, Yogyakarta." },
            ].map(({ label, text }) => (
              <div key={label} className="bg-background p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">{label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRAM KEGIATAN ── */}
      <section className="py-20 border-t border-border">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Program</p>
            <h2 className="text-4xl font-bold">Kegiatan Utama</h2>
          </div>
          <Link href="/kegiatan" className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4 shrink-0">
            Semua kegiatan <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border border-border rounded-xl overflow-hidden">
          {kategoriList.map((kat) => {
            const IconComponent = lucideIcons[kat.icon as keyof typeof lucideIcons]
            return (
              <Link
                key={kat.id}
                href={`/kegiatan?kategori=${kat.id}`}
                className="group flex flex-col gap-4 p-8 bg-background hover:bg-muted/40 transition-colors"
              >
                <div className="inline-flex items-center justify-center size-10 rounded-lg border border-border text-primary">
                  {IconComponent ? <IconComponent className="size-5" /> : <CalendarDays className="size-5" />}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{kat.name}</h3>
                  {kat.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{kat.description}</p>
                  )}
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Selengkapnya <ArrowRight className="size-3" />
                </span>
              </Link>
            )
          })}
        </div>
        <div className="mt-5 md:hidden">
          <Link href="/kegiatan" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            Semua kegiatan <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ── AGENDA + BLOG ── */}
      <section className="py-20 border-t border-border">
        <div className="grid lg:grid-cols-[5fr_7fr] gap-10 lg:gap-16">
          {/* Agenda */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Jadwal</p>
            <h2 className="text-3xl font-bold mb-8">Agenda Terbaru</h2>
            <div className="flex flex-col divide-y divide-border border border-border rounded-xl overflow-hidden">
              {agendaList.length === 0 && (
                <p className="text-sm text-muted-foreground px-5 py-4">Belum ada agenda mendatang.</p>
              )}
              {agendaList.map((item) => (
                <Link
                  key={item.id}
                  href={`/kegiatan?year=${item.year}`}
                  className="flex items-start gap-4 px-5 py-4 bg-background hover:bg-muted/40 transition-colors group"
                >
                  <CalendarDays className="size-4 mt-0.5 shrink-0 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(item.date + 'T00:00:00').toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })} · {item.kategori_name}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
                </Link>
              ))}
            </div>
            <Link href={`/kegiatan?year=${new Date().getFullYear()}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4 mt-5">
              Lihat semua agenda <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Blog */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Tulisan</p>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Blog Terbaru</h2>
              <Link href="/blog" className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4 shrink-0">
                Semua <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <div className="rounded-xl overflow-hidden border border-border">
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <Image
                    src="https://picsum.photos/seed/risma-refleksi/600/400"
                    alt="Refleksi Akhir Tahun"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-muted-foreground mb-2">26 Des 2025</p>
                  <h3 className="font-semibold leading-snug mb-1">Refleksi Akhir Tahun RISMA Kanggotan</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Perjalanan setahun penuh, dari kegiatan sosial hingga pembinaan remaja masjid yang terus tumbuh.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center rounded-xl border border-border p-3">
                <div className="relative size-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                  <Image src="https://picsum.photos/seed/risma-kerjabakti/600/400" alt="Kerja Bakti" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">6 Jan 2026</p>
                  <p className="text-sm font-medium leading-snug line-clamp-2">Kerja Bakti: Wujud Nyata Kepedulian Pemuda</p>
                </div>
              </div>
              <div className="flex gap-4 items-center rounded-xl border border-border p-3">
                <div className="relative size-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                  <Image src="https://picsum.photos/seed/risma-haul/600/400" alt="Haul Massal" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">15 Jan 2026</p>
                  <p className="text-sm font-medium leading-snug line-clamp-2">Haul Massal: Tradisi yang Menyatukan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── KONTAK STRIP ── */}
      <section className="py-16 border-t border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-xl border border-border px-8 py-10">
          <div>
            <h2 className="text-2xl font-bold mb-1">Ada pertanyaan atau ingin kolaborasi?</h2>
            <p className="text-muted-foreground text-sm">Hubungi kami — kami terbuka untuk kegiatan bersama di Kanggotan Lor.</p>
          </div>
          <Button size="lg" asChild className="shrink-0">
            <a href="https://wa.me/6281354007400" target="_blank" rel="noopener noreferrer">
              Hubungi via WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
