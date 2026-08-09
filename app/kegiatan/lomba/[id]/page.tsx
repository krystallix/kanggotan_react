import Layout from "@/components/layout/home-layout"
import { getKategoriAll, getPertandinganByLombaId, getSponsorsByYearKategori } from "@/lib/supabase/queries-server"
import { kategoriYearSegment } from "@/lib/slug"
import { createClient } from "@/lib/supabase/server"
import { CalendarDays, Clock, Info, Users } from "lucide-react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { MatchTabs } from "./match-panel"
import { ShareButton } from "./share-button"
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"
import { getSiteUrl } from "@/lib/site"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const url = await getSiteUrl()
  const supabase = await createClient()
  const { data: lomba } = await supabase
    .schema("db_kanggotan2")
    .from("lomba")
    .select("nama, kegiatan(title)")
    .eq("id", Number(id))
    .single()
  return {
    title: lomba?.nama ? `${lomba.nama} — ${lomba.kegiatan?.[0]?.title ?? "Kegiatan RISMA"}` : "Kegiatan & Klasemen",
    description: lomba?.nama
      ? `Klasemen dan jadwal pertandingan ${lomba.nama} — RISMA Kanggotan Lor.`
      : "Klasemen dan jadwal pertandingan RISMA Kanggotan Lor.",
    alternates: { canonical: `${url}/kegiatan/lomba/${id}` },
  }
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
    .select("*, kegiatan(title, year, kategori_id)")
    .eq("id", lombaId)
    .single()

  if (!lomba) notFound()

  const [pertandingan, sponsors, kategoriList] = await Promise.all([
    lomba.has_pertandingan ? getPertandinganByLombaId(lombaId) : Promise.resolve([]),
    getSponsorsByYearKategori(lomba.kegiatan.year, lomba.kegiatan.kategori_id),
    getKategoriAll()
  ])
  const sponsorKategori = kategoriList.find((k) => k.id === lomba.kegiatan.kategori_id)
  const sponsorSegment = sponsorKategori ? kategoriYearSegment(sponsorKategori.name, lomba.kegiatan.year) : null

  const getMatchTime = (p: typeof pertandingan[number]) => {
    return p.tanggal ? new Date(p.tanggal + "T" + (p.jam || "00:00:00")).getTime() : 0
  }

  const sortedUpcoming = [...pertandingan]
    .filter((p) => p.status !== "selesai")
    .sort((a, b) => getMatchTime(a) - getMatchTime(b))

  const sortedRecent = [...pertandingan]
    .filter((p) => p.status === "selesai")
    .sort((a, b) => getMatchTime(b) - getMatchTime(a))

  const upcomingMatches = sortedUpcoming.slice(0, 4)
  const recentMatches = sortedRecent.slice(0, 4)
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

    const { menang, kalah, main, poin, seri, tw, tl } = matches.reduce(
      (acc, match) => {
        const isA = displayTeam(match.tim_a) === team
        const skorA = isA ? match.skor_a : match.skor_b
        const skorB = isA ? match.skor_b : match.skor_a

        if (skorA !== null && skorB !== null) {
          acc.main += 1
          acc.tw += skorA
          acc.tl += skorB
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
      { menang: 0, kalah: 0, main: 0, poin: 0, seri: 0, tw: 0, tl: 0 }
    )

    return {
      team,
      main,
      menang,
      kalah,
      poin,
      seri,
      tw,
      tl,
      history: history.slice(-5),
    }
  })

  standings.sort((a, b) => {
    if (b.poin !== a.poin) return b.poin - a.poin
    if (b.menang !== a.menang) return b.menang - a.menang

    const h2h = headToHead(a.team, b.team, pertandingan)
    if (h2h !== 0) return h2h

    const setDiffA = a.tw - a.tl
    const setDiffB = b.tw - b.tl
    if (setDiffB !== setDiffA) return setDiffB - setDiffA
    if (b.tw !== a.tw) return b.tw - a.tw
    if (a.tl !== b.tl) return a.tl - b.tl

    return a.team.localeCompare(b.team, "id-ID", { numeric: true })
  })

  function headToHead(teamA: string, teamB: string, matches: Match[]): number {
    const relevantMatches = matches.filter(
      (m) =>
        m.status === "selesai" &&
        m.skor_a !== null &&
        m.skor_b !== null &&
        ((displayTeam(m.tim_a) === teamA && displayTeam(m.tim_b) === teamB) ||
          (displayTeam(m.tim_a) === teamB && displayTeam(m.tim_b) === teamA))
    )

    if (relevantMatches.length === 0) return 0

    const result = relevantMatches.reduce(
      (acc, match) => {
        const isATeamA = displayTeam(match.tim_a) === teamA
        const skorA = isATeamA ? match.skor_a! : match.skor_b!
        const skorB = isATeamA ? match.skor_b! : match.skor_a!

        if (skorA > skorB) acc.match += 1
        else acc.match -= 1

        acc.setDiff += skorA - skorB
        return acc
      },
      { match: 0, setDiff: 0 }
    )

    if (result.match !== 0) return result.match > 0 ? -1 : 1
    if (result.setDiff !== 0) return result.setDiff > 0 ? -1 : 1
    return 0
  }


  return (
    <Layout>
      <div id="lomba-content" className="py-10 bg-background sm:px-4 rounded-3xl">
        {/* Header */}
        <FadeIn className="mb-8 pb-6 flex flex-wrap items-end justify-between gap-4 px-4 sm:px-0">
          <div>
            <p className="mb-2 text-xs font-medium tracking-widest uppercase text-primary/70">
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
          {lomba.has_pertandingan && (
            <div className="no-share-capture">
              <ShareButton title={lomba.nama} standings={standings} matches={pertandingan} sponsors={sponsors} />
            </div>
          )}
        </FadeIn>

        {lomba.has_pertandingan && (
          <section className="grid gap-6 lg:grid-cols-[3fr_2fr] px-0 sm:px-0">
          <FadeIn delay={0.1}>
            <div className="rounded-none sm:rounded-2xl border-y sm:border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <h2 className="font-bold text-base">Klasemen</h2>
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button" className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                      <Info className="size-3.5" />
                      Tie breaker
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 rounded-2xl p-4" align="end" sideOffset={10}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Syarat tie breaker</p>
                    <div className="mt-3 divide-y divide-border text-sm leading-relaxed text-foreground">
                      {[
                        "Poin tertinggi.",
                        "Jumlah menang terbanyak.",
                        "Head-to-head: hasil pertemuan langsung antar tim yang poin dan menangnya sama.",
                        "Jika head-to-head imbang karena 2 kali bertemu dan saling mengalahkan, pakai selisih set pada pertemuan langsung.",
                        "Jika masih sama atau belum saling bertemu, pakai selisih set total: TW dikurangi TL.",
                        "Jika masih sama, pakai total set menang terbanyak.",
                        "Jika masih sama, pakai total set kalah paling sedikit.",
                      ].map((item, index) => (
                        <div key={item} className="flex gap-3 py-2 first:pt-0 last:pb-0">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                            {index + 1}
                          </span>
                          <p>{item}</p>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="sm:hidden">
                <table className="w-full table-fixed text-[11px]">
                  <thead className="bg-muted/40 text-[9px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="w-7 px-1.5 py-2 text-left">#</th>
                      <th className="px-1.5 py-2 text-left">Tim</th>
                      <th className="w-7 px-1 py-2 text-center">M</th>
                      <th className="w-7 px-1 py-2 text-center">W</th>
                      <th className="w-7 px-1 py-2 text-center">L</th>
                      <th className="w-10 px-1 py-2 text-center">TW</th>
                      <th className="w-10 px-1 py-2 text-center">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {standings.length > 0 ? standings.map((row, index) => (
                      <tr key={row.team}>
                        <td className="px-1.5 py-2 font-black text-primary">{index + 1}</td>
                        <td className="min-w-0 px-1.5 py-2">
                          <span className="block truncate font-semibold text-foreground">{row.team}</span>
                        </td>
                        <td className="px-1 py-2 text-center tabular-nums text-muted-foreground">{row.main}</td>
                        <td className="px-1 py-2 text-center tabular-nums text-emerald-600">{row.menang}</td>
                        <td className="px-1 py-2 text-center tabular-nums text-red-500">{row.kalah}</td>
                        <td className="px-1 py-2 text-center tabular-nums font-medium">{row.tw}/{row.tl}</td>
                        <td className="px-1 py-2 text-center font-black tabular-nums text-foreground">{row.poin}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">Belum ada tim untuk klasemen.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="w-12 px-4 py-3 text-left">#</th>
                      <th className="min-w-44 px-4 py-3 text-left">Tim</th>
                      <th className="px-4 py-3 text-center">M</th>
                      <th className="px-4 py-3 text-center">W</th>
                      <th className="px-4 py-3 text-center">L</th>
                      <th className="px-4 py-3 text-center">TW/TL</th>
                      <th className="px-4 py-3 text-center">Form</th>
                      <th className="px-4 py-3 text-center">Poin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {standings.length > 0 ? standings.map((row, index) => {
                      const isTop4 = index < 4;
                      const medal = index === 0 ? "text-amber-500" : index === 1 ? "text-zinc-400" : index === 2 ? "text-amber-700" : null
                      return (
                        <tr
                          key={row.team}
                          className={`hover:bg-muted/30 transition-colors duration-150 ${isTop4 ? "bg-emerald-500/[0.015]" : ""}`}
                        >
                          <td className="px-4 py-3.5 font-medium text-muted-foreground">
                            <span className={`flex size-5 items-center justify-center rounded text-[10px] font-black ${
                              medal
                                ? `${medal} bg-current/10`
                                : isTop4
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : "bg-muted text-muted-foreground"
                            }`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-semibold text-foreground">{row.team}</span>
                          </td>
                          <td className="px-4 py-3.5 text-center tabular-nums font-medium text-muted-foreground">{row.main}</td>
                          <td className="px-4 py-3.5 text-center tabular-nums text-muted-foreground">{row.menang}</td>
                          <td className="px-4 py-3.5 text-center tabular-nums text-muted-foreground">{row.kalah}</td>
                          <td className="px-4 py-3.5 text-center tabular-nums font-medium">
                            <span className="text-emerald-600 dark:text-emerald-400">{row.tw}</span>
                            <span className="text-muted-foreground mx-0.5">/</span>
                            <span className="text-red-500">{row.tl}</span>
                          </td>
                          <td className="px-4 py-3.5">
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
                          <td className="px-4 py-3.5 text-center font-black tabular-nums text-foreground text-base">{row.poin}</td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground text-sm">
                          Belum ada tim untuk klasemen.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>

          <StaggerChildren stagger={0.1} delay={0.15} className="grid gap-6 px-4 sm:px-0">
            <StaggerItem>
              <MatchTabs
                recentMatches={recentMatches}
                allRecentMatches={sortedRecent}
                upcomingMatches={upcomingMatches}
                allUpcomingMatches={sortedUpcoming}
              />
            </StaggerItem>
          </StaggerChildren>
        </section>
        )}

        {sponsors.length > 0 && (
          <FadeIn delay={0.2}>
            <section className="mt-12 border-t border-border pt-10">
              <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight">Sponsor kegiatan</h2>
                <p className="text-sm text-muted-foreground mt-1">Terima kasih kepada para sponsor yang mendukung kesuksesan kegiatan ini.</p>
              </div>

              {(() => {
                const split = sponsors.length > 5
                const rows = split
                  ? [
                      { items: sponsors.slice(0, Math.ceil(sponsors.length / 2)), reverse: false },
                      { items: sponsors.slice(Math.ceil(sponsors.length / 2)), reverse: true },
                    ]
                  : [{ items: sponsors, reverse: false }]

                return rows.map(({ items, reverse }, rowIndex) => (
                  <div key={rowIndex} className={`relative left-1/2 flex w-screen -translate-x-1/2 overflow-hidden border-y border-border/50 py-7 select-none ${rowIndex !== 0 ? "border-t-0" : ""}`}>
                    <div className={`${reverse ? "animate-marquee-reverse" : "animate-marquee"} items-center`}>
                      {[...items, ...items].map((sponsor, idx) => {
                        const content = sponsor.logo_url ? (
                          <img
                            src={sponsor.logo_url}
                            alt={sponsor.nama}
                            className="h-10 w-auto object-contain opacity-60 transition-opacity duration-300 hover:opacity-100 active:opacity-100 lg:h-14"
                          />
                        ) : (
                          <span className="text-sm font-bold tracking-tight text-foreground/60 transition-colors duration-300 hover:text-foreground active:text-foreground">{sponsor.nama}</span>
                        )

                        return sponsorSegment ? (
                          <Link
                            key={`${sponsor.id}-${rowIndex}-${idx}`}
                            href={`/sponsor/${sponsorSegment}/${sponsor.id}`}
                            className="flex shrink-0 items-center justify-center px-8 lg:px-14"
                          >
                            {content}
                          </Link>
                        ) : (
                          <div key={`${sponsor.id}-${rowIndex}-${idx}`} className="flex shrink-0 items-center justify-center px-8 lg:px-14">
                            {content}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              })()}
            </section>
          </FadeIn>
        )}
      </div>
    </Layout>
  )
}

type Match = Awaited<ReturnType<typeof getPertandinganByLombaId>>[number]
