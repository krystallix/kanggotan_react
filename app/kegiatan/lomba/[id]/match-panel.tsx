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
  const [activeFilter, setActiveFilter] = useState<"semua" | "penyisihan" | "semifinal" | "final" | "juara 3">("semua")

  const getFilteredMatches = (source: Match[]) => {
    if (activeFilter === "semua") return source
    return source.filter((m) => {
      const babak = (m.babak || "").toLowerCase()
      if (activeFilter === "final") return babak === "final"
      if (activeFilter === "semifinal") return babak === "semifinal"
      if (activeFilter === "juara 3") return babak === "juara 3"
      // Default to penyisihan if babak is empty or contains "penyisihan"
      return babak === "" || babak.includes("penyisihan")
    })
  }

  const baseMatches = showAll ? allMatches : matches
  const filtered = getFilteredMatches(baseMatches)

  return (
    <section className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 shadow-sm">
      <div className="flex flex-col border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
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

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 px-4 pb-2.5 overflow-x-auto no-scrollbar">
          {(["semua", "penyisihan", "semifinal", "final", "juara 3"] as const).map((filter) => {
            const count = getFilteredMatches(baseMatches).filter((m) => {
              if (filter === "semua") return true
              const babak = (m.babak || "").toLowerCase()
              if (filter === "final") return babak === "final"
              if (filter === "semifinal") return babak === "semifinal"
              if (filter === "juara 3") return babak === "juara 3"
              return babak === "" || babak.includes("penyisihan")
            }).length;

            if (count === 0 && filter !== "semua") return null;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all shrink-0 capitalize ${
                  activeFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {filter}
              </button>
            )
          })}
        </div>
      </div>
      
      <div className="divide-y divide-border transition-all duration-300 ease-in-out">
        {filtered.length > 0 ? (
          filtered.map((match) => {
            const isLive = match.status === "berlangsung" // "live" state check
            return (
              <article
                key={match.id}
                className="p-4 transition-all duration-300 hover:bg-muted/10"
              >
                <div className="mb-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    {formatDate(match.tanggal)}
                    {isLive && (
                      <span className="inline-flex items-center gap-1 bg-red-500/10 px-1.5 py-0.5 rounded text-[9px] font-black text-red-600 animate-pulse">
                        <span className="size-1.5 rounded-full bg-red-600" />
                        LIVE
                      </span>
                    )}
                  </span>
                  <span>{formatTime(match.jam)}</span>
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
                  <p className="truncate text-left font-semibold text-foreground">{displayTeam(match.tim_a)}</p>
                  {match.status === "selesai" || (match.skor_a !== null && match.skor_b !== null) ? (
                    <div className="text-base md:text-lg font-black tabular-nums px-3 text-foreground">
                      {match.skor_a} - {match.skor_b}
                    </div>
                  ) : (
                    <div className="min-w-12 rounded-lg bg-muted border border-border px-2 py-0.5 text-[10px] font-bold tabular-nums text-muted-foreground">
                      VS
                    </div>
                  )}
                  <p className="truncate text-right font-semibold text-foreground">{displayTeam(match.tim_b)}</p>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/40 px-2 py-0.5 rounded">
                    {match.babak || "Penyisihan"}
                  </span>
                </div>
              </article>
            )
          })
        ) : (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">{empty}</p>
        )}
      </div>
    </section>
  )
}
