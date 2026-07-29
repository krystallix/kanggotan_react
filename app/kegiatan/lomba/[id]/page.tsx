import Layout from "@/components/layout/home-layout"
import { getPertandinganByLombaId, getSponsorsByKegiatanId } from "@/lib/supabase/queries-server"
import { createClient } from "@/lib/supabase/server"
import { CalendarDays, Clock, Users, Globe, MapPin } from "lucide-react"
import { notFound } from "next/navigation"
import { MatchPanel } from "./match-panel"
import { ShareButton } from "./share-button"

export const viewport = {
  width: 1280,
  initialScale: 1,
}

const formatDate = (date: string | null) => {
  if (!date) return "TBA"
  return new Date(date + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  })
}

const formatTime = (time: string | null) => `${time?.slice(0, 5) || "TBA"} WIB`
const displayTeam = (team: string) => ["TBD", "TBA"].includes(team.toUpperCase()) ? "Menunggu finalis" : team

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function LombaDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const lombaId = Number(id)

  if (!Number.isFinite(lombaId)) notFound()

  const { data: lomba } = await supabase
    .schema("db_kanggotan2")
    .from("lomba")
    .select("*, kegiatan(title, year)")
    .eq("id", lombaId)
    .single()

  if (!lomba) notFound()

  const [pertandingan, sponsors] = await Promise.all([
    getPertandinganByLombaId(lombaId),
    getSponsorsByKegiatanId(lomba.kegiatan_id)
  ])
  const upcomingMatches = pertandingan.filter((p) => p.status !== "selesai").slice(0, 4)
  const recentMatches = pertandingan.filter((p) => p.status === "selesai").slice(-4).reverse()
  const teams = Array.from(new Set(pertandingan.flatMap((p) => [p.tim_a, p.tim_b])))
    .filter((team) => team && !["TBD", "TBA"].includes(team.toUpperCase()))
  const standings = teams.map((team) => {
    const matches = pertandingan.filter(
      (p) => displayTeam(p.tim_a) === team || displayTeam(p.tim_b) === team
    )

    // Form Guide (W/L)
    const history: Array<"W" | "L"> = []
    
    // Sort matches by date/time ascending to trace form chronologically
    const sortedTeamMatches = [...matches]
      .filter((m) => m.status === "selesai" && m.skor_a !== null && m.skor_b !== null)
      .sort((a, b) => {
        const dateA = a.tanggal ? new Date(a.tanggal + "T" + (a.jam || "00:00:00")) : new Date(0)
        const dateB = b.tanggal ? new Date(b.tanggal + "T" + (b.jam || "00:00:00")) : new Date(0)
        return dateA.getTime() - dateB.getTime()
      })

    sortedTeamMatches.forEach((m) => {
      const isA = displayTeam(m.tim_a) === team
      const skorOwn = isA ? m.skor_a! : m.skor_b!
      const skorOpp = isA ? m.skor_b! : m.skor_a!
      if (skorOwn > skorOpp) {
        history.push("W")
      } else {
        history.push("L")
      }
    })

    const { menang, kalah, main, poin, seri } = matches.reduce(
      (acc, match) => {
        const isA = displayTeam(match.tim_a) === team
        const skorA = isA ? match.skor_a : match.skor_b
        const skorB = isA ? match.skor_b : match.skor_a

        if (skorA !== null && skorB !== null) {
          acc.main += 1
          if (skorA === 3 && skorB < 2) {
            acc.menang += 1
            acc.poin += 3
          } else if (skorA === 3 && skorB === 2) {
            acc.menang += 1
            acc.poin += 2
          } else if (skorA === 2 && skorB === 3) {
            acc.kalah += 1
            acc.poin += 1
          } else if (skorA < 2) {
            acc.kalah += 1
          }
        }
        return acc
      },
      { menang: 0, kalah: 0, main: 0, poin: 0, seri: 0 }
    )

    return {
      team,
      main,
      menang,
      kalah,
      poin,
      seri,
      history: history.slice(-5), // Get last 5 matches
    }
  })

  standings.sort((a, b) =>
    b.poin === a.poin
      ? b.menang === a.menang
        ? headToHead(a.team, b.team, pertandingan)
        : b.menang - a.menang
      : b.poin - a.poin
  )

  function headToHead(teamA: string, teamB: string, matches: Match[]): number {
    const relevantMatches = matches.filter(
      (m) =>
        (displayTeam(m.tim_a) === teamA && displayTeam(m.tim_b) === teamB) ||
        (displayTeam(m.tim_a) === teamB && displayTeam(m.tim_b) === teamA)
    )
    const result = relevantMatches.reduce(
      (acc, match) => {
        if (match.skor_a !== null && match.skor_b !== null) {
          const isATeamA = displayTeam(match.tim_a) === teamA
          const [skorA, skorB] = isATeamA
            ? [match.skor_a, match.skor_b]
            : [match.skor_b, match.skor_a]

          if (skorA > skorB) acc += 1
          else acc -= 1
        }
        return acc
      },
      0
    )
    return result === 0 ? 0 : result > 0 ? -1 : 1
  }


  return (
    <Layout>
      <div id="lomba-content" className="py-10 bg-background px-4 rounded-3xl">
        <section className="mb-8 pb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {lomba.kegiatan?.title}
            </p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{lomba.nama}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {lomba.tanggal && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4 text-primary" />
                  {formatDate(lomba.tanggal)}
                </span>
              )}
              {lomba.jam && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4 text-primary" />
                  {formatTime(lomba.jam)}
                </span>
              )}
              {lomba.pic_nama && (
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-4 text-primary" />
                  {lomba.pic_nama}
                </span>
              )}
            </div>
          </div>
          <div className="no-share-capture">
            <ShareButton title={lomba.nama} />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[7fr_3fr]">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between  px-5 py-4">
              <div>
                <h2 className="font-semibold text-xl">Klasemen</h2>
                <p className="text-xs text-muted-foreground"></p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="w-12 px-4 py-3.5 text-left">#</th>
                    <th className="min-w-44 px-4 py-3.5 text-left">Tim</th>
                    <th className="px-4 py-3.5 text-center">M</th>
                    <th className="px-4 py-3.5 text-center hidden sm:table-cell">W</th>
                    <th className="px-4 py-3.5 text-center hidden sm:table-cell">L</th>
                    <th className="px-4 py-3.5 text-center">Form</th>
                    <th className="px-4 py-3.5 text-center">Poin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {standings.length > 0 ? standings.map((row, index) => {
                    const isTop4 = index < 4;
                    return (
                      <tr 
                        key={row.team} 
                        className={`hover:bg-muted/30 transition-colors ${
                          isTop4 ? "bg-emerald-500/[0.02]" : ""
                        }`}
                      >
                        <td className="px-4 py-4 font-medium text-muted-foreground flex items-center gap-2">
                          <span className={`flex size-5 items-center justify-center rounded text-[10px] font-bold ${
                            isTop4 
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">{row.team}</span>
                            {isTop4 && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium sm:hidden">
                                Zona Semifinal
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center tabular-nums font-medium">{row.main}</td>
                        <td className="px-4 py-4 text-center tabular-nums text-muted-foreground hidden sm:table-cell">{row.menang}</td>
                        <td className="px-4 py-4 text-center tabular-nums text-muted-foreground hidden sm:table-cell">{row.kalah}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-1">
                            {row.history.length > 0 ? (
                              row.history.map((h, i) => (
                                <span
                                  key={i}
                                  className={`flex size-4.5 items-center justify-center rounded-full text-[9px] font-black ${
                                    h === "W"
                                      ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                                      : "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                                  }`}
                                  title={h === "W" ? "Menang" : "Kalah"}
                                >
                                  {h}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground/40 italic">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center font-bold tabular-nums text-foreground">{row.poin}</td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                        Belum ada tim untuk klasemen.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {sponsors.length > 0 && (
              <div className="py-6 lg:py-8 border-t border-border/50 bg-card overflow-hidden mt-10 border-b border-border/50 flex relative select-none">
                <div className="flex w-max animate-marquee">
                  {[...sponsors, ...sponsors].map((sponsor, idx) => {
                    const content = sponsor.logo_url ? (
                      <img
                        src={sponsor.logo_url}
                        alt={sponsor.nama}
                        className="h-8 lg:h-12 w-auto object-contain opacity-50 hover:opacity-100 active:opacity-100 transition-opacity duration-300 cursor-pointer"
                      />
                    ) : (
                      <span className="font-bold text-sm tracking-tight text-foreground opacity-50 hover:opacity-100 active:opacity-100 transition-opacity duration-300 cursor-pointer">{sponsor.nama}</span>
                    )

                    return sponsor.sosmed_url ? (
                      <a
                        key={`${sponsor.id}-${idx}`}
                        href={sponsor.sosmed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex shrink-0 justify-center items-center px-6 lg:px-12 block"
                      >
                        {content}
                      </a>
                    ) : (
                      <div
                        key={`${sponsor.id}-${idx}`}
                        className="flex shrink-0 justify-center items-center px-6 lg:px-12"
                      >
                        {content}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <aside className="grid gap-6">
            <MatchPanel title="Recent Matches" matches={recentMatches} allMatches={pertandingan.filter((p) => p.status === "selesai").reverse()} empty="Belum ada hasil pertandingan." actionLabel="Lihat semua pertandingan" />
            <MatchPanel title="Upcoming Matches" matches={upcomingMatches} allMatches={pertandingan.filter((p) => p.status !== "selesai")} empty="Belum ada pertandingan mendatang." actionLabel="Lihat pertandingan selanjutnya" />
          </aside>
        </section>

        {sponsors.length > 0 && (
          <section className="mt-12 border-t border-border pt-10">
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight">Sponsor Kegiatan</h2>
              <p className="text-sm text-muted-foreground mt-1">Terima kasih kepada para sponsor yang mendukung kesuksesan kegiatan ini.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-all duration-200">
                  {sponsor.logo_url ? (
                    <img src={sponsor.logo_url} alt={sponsor.nama} className="size-12 rounded-xl object-contain bg-muted p-1 border border-border/40 shrink-0" />
                  ) : (
                    <div className="size-12 rounded-xl bg-primary/10 text-primary font-black text-lg flex items-center justify-center shrink-0">
                      {sponsor.nama.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm truncate text-foreground">{sponsor.nama}</h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                      {sponsor.lokasi_url && (
                        <a href={sponsor.lokasi_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                          <MapPin className="size-3 shrink-0" />
                          Maps
                        </a>
                      )}
                      {sponsor.sosmed_url && (
                        <a href={sponsor.sosmed_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                          <Globe className="size-3 shrink-0" />
                          Sosmed
                        </a>
                      )}
                    </div>
                    {sponsor.deskripsi && (
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{sponsor.deskripsi}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  )
}

type Match = Awaited<ReturnType<typeof getPertandinganByLombaId>>[number]
