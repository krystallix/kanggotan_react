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

type Tab = "upcoming" | "recent"
type BabakFilter = "penyisihan" | "semifinal" | "final" | "juara 3"

function getFilteredByBabak(source: Match[], filter: BabakFilter) {
  return source.filter((m) => {
    const babak = (m.babak || "").toLowerCase()
    if (filter === "final") return babak === "final"
    if (filter === "semifinal") return babak === "semifinal"
    if (filter === "juara 3") return babak === "juara 3"
    return babak === "" || babak.includes("penyisihan")
  })
}

function countByBabak(source: Match[], filter: BabakFilter) {
  return getFilteredByBabak(source, filter).length
}

function MatchList({
  matches,
  allMatches,
  empty,
  actionLabel,
}: {
  matches: Match[]
  allMatches: Match[]
  empty: string
  actionLabel: string
}) {
  const [showAll, setShowAll] = useState(false)
  const [activeFilter, setActiveFilter] = useState<BabakFilter>("penyisihan")

  const base = showAll ? allMatches : matches
  const filtered = getFilteredByBabak(base, activeFilter)

  const availableFilters = (["penyisihan", "semifinal", "final", "juara 3"] as const).filter(
    (f) => countByBabak(base, f) > 0
  )

  return (
    <div>
      {availableFilters.length > 1 && (
        <div className="flex items-center gap-1.5 px-4 pb-3 overflow-x-auto no-scrollbar">
          {availableFilters.map((filter) => (
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
          ))}
        </div>
      )}

      <div className="divide-y divide-border">
        {filtered.length > 0 ? (
          filtered.map((match) => {
            const isLive = match.status === "berlangsung"
            return (
              <article key={match.id} className="p-4 hover:bg-muted/10 transition-colors duration-150">
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
                <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-center">
                  <p className="min-w-0 truncate text-left font-semibold text-foreground text-sm">{displayTeam(match.tim_a)}</p>
                  {match.status === "selesai" || (match.skor_a !== null && match.skor_b !== null) ? (
                    <div className="rounded-lg bg-muted px-2 py-0.5 text-sm font-black tabular-nums text-foreground sm:bg-transparent sm:px-3 sm:py-0 sm:text-lg">
                      {match.skor_a} - {match.skor_b}
                    </div>
                  ) : (
                    <div className="min-w-10 rounded-lg bg-muted border border-border px-2 py-0.5 text-center text-[10px] font-bold tabular-nums text-muted-foreground">
                      VS
                    </div>
                  )}
                  <p className="min-w-0 truncate text-right font-semibold text-foreground text-sm">{displayTeam(match.tim_b)}</p>
                </div>
                {match.babak && ["final", "semifinal"].includes(match.babak.toLowerCase()) && (
                  <div className="mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/40 px-2 py-0.5 rounded">
                      {match.babak}
                    </span>
                  </div>
                )}
              </article>
            )
          })
        ) : (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">{empty}</p>
        )}
      </div>

      {allMatches.length > matches.length && (
        <div className="border-t border-border px-4 py-2.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="h-7 text-xs px-2.5 flex items-center gap-1 hover:bg-muted/50 hover:text-primary transition-all duration-200"
          >
            {showAll ? "Tampilkan lebih sedikit" : actionLabel}
            <ArrowRight className={`size-3 transition-transform duration-200 ${showAll ? "rotate-90" : ""}`} />
          </Button>
        </div>
      )}
    </div>
  )
}

export function MatchTabs({
  recentMatches,
  allRecentMatches,
  upcomingMatches,
  allUpcomingMatches,
}: {
  recentMatches: Match[]
  allRecentMatches: Match[]
  upcomingMatches: Match[]
  allUpcomingMatches: Match[]
}) {
  const [activeTab, setActiveTab] = useState<Tab>(upcomingMatches.length > 0 ? "upcoming" : "recent")

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "upcoming", label: "Upcoming", count: allUpcomingMatches.length },
    { key: "recent", label: "Recent", count: allRecentMatches.length },
  ]

  return (
    <section className="rounded-none sm:rounded-2xl border-y sm:border border-border bg-card overflow-hidden shadow-sm">
      {/* Tab header */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200 relative ${
              activeTab === tab.key
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "upcoming" && (
        <MatchList
          matches={upcomingMatches}
          allMatches={allUpcomingMatches}
          empty="Belum ada pertandingan mendatang."
          actionLabel="Lihat pertandingan selanjutnya"
        />
      )}
      {activeTab === "recent" && (
        <MatchList
          matches={recentMatches}
          allMatches={allRecentMatches}
          empty="Belum ada hasil pertandingan."
          actionLabel="Lihat semua pertandingan"
        />
      )}
    </section>
  )
}
