import Layout from "@/components/layout/home-layout"
import { getPertandinganByLombaId } from "@/lib/supabase/queries-server"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, Users, ArrowRight } from "lucide-react"
import { notFound } from "next/navigation"
import { MatchPanel } from "./match-panel"

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

  const pertandingan = await getPertandinganByLombaId(lombaId)
  const upcomingMatches = pertandingan.filter((p) => p.status !== "selesai").slice(0, 4)
  const recentMatches = pertandingan.filter((p) => p.status === "selesai").slice(-4).reverse()
  const teams = Array.from(new Set(pertandingan.flatMap((p) => [p.tim_a, p.tim_b])))
    .filter((team) => team && !["TBD", "TBA"].includes(team.toUpperCase()))
  const standings = teams.map((team) => {
    const matches = pertandingan.filter(
      (p) => displayTeam(p.tim_a) === team || displayTeam(p.tim_b) === team
    )

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
      <div className="py-10">
        <section className="mb-8 border-b border-border pb-6">
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
        </section>

        <section className="grid gap-6 lg:grid-cols-[7fr_3fr]">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="font-semibold">Klasemen</h2>
                <p className="text-xs text-muted-foreground"></p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="w-12 px-4 py-3 text-left">#</th>
                    <th className="min-w-44 px-4 py-3 text-left">Tim</th>
                    <th className="px-4 py-3 text-center">M</th>
                    <th className="px-4 py-3 text-center">W</th>
                    <th className="px-4 py-3 text-center">D</th>
                    <th className="px-4 py-3 text-center">L</th>
                    <th className="px-4 py-3 text-center">Poin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {standings.length > 0 ? standings.map((row, index) => (
                    <tr key={row.team} className="hover:bg-muted/30">
                      <td className="px-4 py-4 font-medium text-muted-foreground">{index + 1}</td>
                      <td className="px-4 py-4 font-semibold">{row.team}</td>
                      <td className="px-4 py-4 text-center tabular-nums">{row.main}</td>
                      <td className="px-4 py-4 text-center tabular-nums">{row.menang}</td>
                      <td className="px-4 py-4 text-center tabular-nums">{row.seri}</td>
                      <td className="px-4 py-4 text-center tabular-nums">{row.kalah}</td>
                      <td className="px-4 py-4 text-center font-bold tabular-nums">{row.poin}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                        Belum ada tim untuk klasemen.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="grid gap-6">
            <MatchPanel title="Recent Matches" matches={recentMatches} allMatches={pertandingan.filter((p) => p.status === "selesai").reverse()} empty="Belum ada hasil pertandingan." actionLabel="Lihat semua pertandingan" />
            <MatchPanel title="Upcoming Matches" matches={upcomingMatches} allMatches={pertandingan.filter((p) => p.status !== "selesai")} empty="Belum ada pertandingan mendatang." actionLabel="Lihat pertandingan selanjutnya" />
          </aside>
        </section>
      </div>
    </Layout>
  )
}

type Match = Awaited<ReturnType<typeof getPertandinganByLombaId>>[number]
