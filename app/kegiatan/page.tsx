import Layout from "@/components/layout/home-layout";
import { getKategoriAll, getKegiatanWithLombaByYear } from "@/lib/supabase/queries-server";
import { CalendarDays, Clock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function KegiatanPage({ searchParams }: PageProps) {
  const params = await searchParams
  const YEAR = params.year ? Number(params.year) : new Date().getFullYear()
  const KATEGORI = params.kategori ? Number(params.kategori) : undefined

  const kategoriList = await getKategoriAll()
  const kegiatanList = await getKegiatanWithLombaByYear(YEAR)

  let filtered = kegiatanList
  if (KATEGORI) {
    filtered = filtered.filter((k) => k.kategori_id === KATEGORI)
  }

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  return (
    <Layout>
      <div className="py-12">
        {/* Header */}
        <FadeIn className="mb-10">
          <p className="text-xs font-medium tracking-widest uppercase text-primary/70 mb-3">Kegiatan</p>
          <h1 className="text-5xl font-bold tracking-tight">Kegiatan RISMA</h1>
          <p className="text-muted-foreground mt-2 max-w-md">Jadwal dan dokumentasi kegiatan remaja masjid At-Ta&apos;awun.</p>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={0.1} className="flex flex-wrap gap-4 mb-10 pb-8 border-b border-border">
          {/* Year filter */}
          <div className="flex gap-1.5 flex-wrap">
            {years.map((y) => (
              <Link
                key={y}
                href={KATEGORI ? `?year=${y}&kategori=${KATEGORI}` : `?year=${y}`}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  y === YEAR
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {y}
              </Link>
            ))}
          </div>

          <div className="w-px bg-border hidden sm:block" />

          {/* Kategori filter */}
          <div className="flex gap-1.5 flex-wrap">
            <Link
              href={`?year=${YEAR}`}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                !KATEGORI
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Semua
            </Link>
            {kategoriList.map((k) => (
              <Link
                key={k.id}
                href={`?year=${YEAR}&kategori=${k.id}`}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  KATEGORI === k.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {k.name}
              </Link>
            ))}
          </div>
        </FadeIn>

        {/* Kegiatan List */}
        {filtered.length === 0 && (
          <p className="text-muted-foreground text-center py-16">Belum ada kegiatan untuk tahun ini.</p>
        )}

        <StaggerChildren stagger={0.06} className="flex flex-col">
          {filtered.map((kegiatan, i) => (
            <StaggerItem key={kegiatan.id}>
              <div className={`py-8 ${i !== 0 ? "border-t border-border" : ""}`}>
                {/* Header */}
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-medium tracking-widest uppercase text-primary/70 bg-primary/8 px-2.5 py-0.5 rounded-md">
                        {kegiatan.kategori_name}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold leading-tight text-foreground">{kegiatan.title}</h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0 mt-0.5">
                    <CalendarDays className="size-4 text-primary" />
                    <span>
                      {new Date(kegiatan.date + "T00:00:00").toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric"
                      })}
                    </span>
                  </div>
                </div>

                {kegiatan.description && (
                  <p className="text-sm text-muted-foreground mb-5 max-w-2xl leading-relaxed">{kegiatan.description}</p>
                )}

                {/* Lomba */}
                {kegiatan.lomba && kegiatan.lomba.length > 0 && (
                  <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {kegiatan.lomba.map((lomba) => {
                      const nextMatch = lomba.pertandingan?.[0]
                      return (
                        <Link
                          key={lomba.id}
                          href={`/kegiatan/lomba/${lomba.id}`}
                          className="group block rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/[0.05]"
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-200">{lomba.nama}</h4>
                                {lomba.has_pertandingan && (
                                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md shrink-0">
                                    Turnamen
                                  </span>
                                )}
                              </div>
                              {lomba.deskripsi && (
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{lomba.deskripsi}</p>
                              )}
                            </div>
                            <ArrowRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 mt-0.5" />
                          </div>

                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            {lomba.tanggal && (
                              <span className="flex items-center gap-1">
                                <CalendarDays className="size-3" />
                                {new Date(lomba.tanggal + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                              </span>
                            )}
                            {lomba.jam && (
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {lomba.jam.slice(0, 5)}
                              </span>
                            )}
                            {lomba.pic_nama && (
                              <span className="flex items-center gap-1">
                                <User className="size-3" />
                                {lomba.pic_nama}
                              </span>
                            )}
                          </div>

                          {nextMatch && (
                            <div className="mt-3 rounded-xl border border-dashed border-border bg-muted/40 p-3">
                              <p className="text-[10px] text-muted-foreground mb-2 font-medium">Jadwal terdekat</p>
                              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
                                <span className="text-xs font-bold text-foreground text-right truncate">{nextMatch.tim_a}</span>
                                <div>
                                  <span className="block rounded-md bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground">{nextMatch.babak}</span>
                                  <span className="mt-0.5 block text-[10px] text-muted-foreground">{nextMatch.jam?.slice(0, 5) || "TBA"}</span>
                                </div>
                                <span className="text-xs font-bold text-foreground text-left truncate">{nextMatch.tim_b}</span>
                              </div>
                            </div>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </Layout>
  );
}
