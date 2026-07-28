"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

type Match = {
  id: number
  tanggal: string | null
  jam: string | null
  tim_a: string
  tim_b: string
  skor_a: number | null
  skor_b: number | null
  status: string
  babak: string | null
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

export function MatchPanel({
  title,
  matches,
  allMatches,
  empty,
  actionLabel,
}: {
  title: string
  matches: Match[]
  allMatches: Match[]
  empty: string
  actionLabel: string
}) {
  const [showAll, setShowAll] = useState(false)
  const currentMatches = showAll ? allMatches : matches

  return (
    <section className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="font-semibold text-sm">{title}</h2>
        {allMatches.length > matches.length && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="h-7 text-xs px-2.5 flex items-center gap-1 hover:bg-muted/50 hover:text-primary transition-all duration-200"
          >
            {showAll ? "Tampilkan lebih sedikit" : actionLabel}
            <ArrowRight className={`size-3 transition-transform duration-200 ${showAll ? "rotate-90" : ""}`} />
          </Button>
        )}
      </div>
      <div className="divide-y divide-border transition-all duration-300 ease-in-out">
        {currentMatches.length > 0 ? (
          currentMatches.map((match) => (
            <article
              key={match.id}
              className="p-4 transition-all duration-300 hover:bg-muted/10"
            >
              <div className="mb-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>{formatDate(match.tanggal)}</span>
                <span>{formatTime(match.jam)}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
                <p className="truncate text-left font-semibold">{displayTeam(match.tim_a)}</p>
                <div className="min-w-14 rounded-md border border-border px-2 py-1 text-xs font-bold tabular-nums">
                  {match.skor_a === null || match.skor_b === null ? "VS" : `${match.skor_a}–${match.skor_b}`}
                </div>
                <p className="truncate text-right font-semibold">{displayTeam(match.tim_b)}</p>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">{match.babak}</span>
              </div>
            </article>
          ))
        ) : (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">{empty}</p>
        )}
      </div>
    </section>
  )
}
