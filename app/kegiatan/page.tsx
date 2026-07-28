import Layout from "@/components/layout/home-layout";
import { getKategoriAll, getKegiatanWithLombaByYear } from "@/lib/supabase/queries-server";
import { CalendarDays, Clock, User, ArrowRight } from "lucide-react";
import Link from "next/link";

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
      <div className="py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Kegiatan</p>
          <h1 className="text-4xl font-bold">Kegiatan RISMA</h1>
          <p className="text-muted-foreground mt-2">Jadwal dan dokumentasi kegiatan remaja masjid At-Ta&apos;awun.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {/* Year filter */}
          <div className="flex gap-1.5">
            {years.map((y) => (
              <Link
                key={y}
                href={KATEGORI ? `?year=${y}&kategori=${KATEGORI}` : `?year=${y}`}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${y === YEAR ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                {y}
              </Link>
            ))}
          </div>

          {/* Kategori filter */}
          <div className="flex gap-1.5 flex-wrap">
            <Link
              href={`?year=${YEAR}`}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${!KATEGORI ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              Semua
            </Link>
            {kategoriList.map((k) => (
              <Link
                key={k.id}
                href={`?year=${YEAR}&kategori=${k.id}`}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${KATEGORI === k.id ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                {k.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Kegiatan List */}
        <div className="grid gap-6">
          {filtered.length === 0 && (
            <p className="text-muted-foreground text-center py-12">Belum ada kegiatan untuk tahun ini.</p>
          )}

          {filtered.map((kegiatan) => (
            <div key={kegiatan.id} className="border border-border rounded-xl p-6 bg-card">
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold leading-tight">{kegiatan.title}</h2>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full shrink-0">
                    {kegiatan.kategori_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <CalendarDays className="size-4" />
                    <span>
                      {new Date(kegiatan.date + 'T00:00:00').toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </span>
                </div>
              </div>

              {kegiatan.description && (
                <p className="text-sm text-muted-foreground mb-4">{kegiatan.description}</p>
              )}

              {/* Lomba */}
              {kegiatan.lomba && kegiatan.lomba.length > 0 && (
                <div className="mt-4 space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Lomba</h3>
                  {kegiatan.lomba.map((lomba) => {
                    const nextMatch = lomba.pertandingan?.[0]
                    return (
                      <Link
                        key={lomba.id}
                        href={`/kegiatan/lomba/${lomba.id}`}
                        className="group block rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:border-primary/50 hover:bg-muted/50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold group-hover:text-primary">{lomba.nama}</h4>
                              {lomba.has_pertandingan && (
                                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full shrink-0">
                                  Turnamen
                                </span>
                              )}
                            </div>
                            {lomba.deskripsi && (
                              <p className="text-xs text-muted-foreground mt-1">{lomba.deskripsi}</p>
                            )}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                              {lomba.tanggal && (
                                <span className="flex items-center gap-1">
                                  <CalendarDays className="size-3" />
                                  {new Date(lomba.tanggal + 'T00:00:00').toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'long'
                                  })}
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
                                  PIC: {lomba.pic_nama}
                                </span>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                        </div>

                        {nextMatch && (
                          <div className="mt-4 rounded-lg border border-dashed border-border bg-background/70 p-3">
                            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground mb-3">
                              <span>Jadwal terdekat</span>
                              <span>{lomba.pertandingan.length} pertandingan</span>
                            </div>
                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
                              <span className="text-sm font-bold text-foreground text-right">{nextMatch.tim_a}</span>
                              <div>
                                <span className="block rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">{nextMatch.babak}</span>
                                <span className="mt-1 block text-xs font-medium text-muted-foreground">{nextMatch.jam?.slice(0, 5) || 'TBA'}</span>
                              </div>
                              <span className="text-sm font-bold text-foreground text-left">{nextMatch.tim_b}</span>
                            </div>
                          </div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
