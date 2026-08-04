"use client"

import { useRef, useState, type ReactNode } from "react"
import { Check, Loader2, Share2, Trophy } from "lucide-react"
import { toJpeg } from "html-to-image"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Sponsor } from "@/types/kegiatan"

type Standing = {
  team: string
  main: number
  menang: number
  kalah: number
  tw: number
  tl: number
  poin: number
}

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

type ScheduleMode = "nearest" | "all"

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
const slug = (text: string) => text.toLowerCase().replace(/\s+/g, "-")

const getWibStamp = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date())
  const get = (type: string) => parts.find((part) => part.type === type)?.value || "00"
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`
}

const matchStamp = (match: Match) => `${match.tanggal || "9999-12-31"} ${match.jam?.slice(0, 5) || "23:59"}`

function SponsorStrip({ sponsors }: { sponsors: Sponsor[] }) {
  if (sponsors.length === 0) return null

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, borderTop: "1px solid #e5e7eb", paddingTop: 18 }}>
      <span style={{ fontSize: 14, fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: 2 }}>Sponsor</span>
      <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        {sponsors.slice(0, 8).map((sponsor) => (
          <div key={sponsor.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {sponsor.logo_url ? (
              <img src={sponsor.logo_url} alt={sponsor.nama} style={{ height: 30, maxWidth: 90, objectFit: "contain" }} />
            ) : (
              <span style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>{sponsor.nama}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function CaptureFrame({ children, sponsors, label, title, pageUrl, autoHeight = false }: { children: ReactNode; sponsors: Sponsor[]; label: string; title: string; pageUrl: string; autoHeight?: boolean }) {
  return (
    <div style={{ width: 1200, minHeight: 900, height: autoHeight ? "auto" : 900, background: "#ffffff", color: "#111827", padding: 56, fontFamily: "Inter, Arial, sans-serif", display: "flex", flexDirection: "column", overflow: autoHeight ? "visible" : "hidden" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 34 }}>
        <div>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: "oklch(0.457 0.24 277.023)", letterSpacing: 3, textTransform: "uppercase" }}>{label}</p>
          <h1 style={{ margin: "10px 0 0", fontSize: 54, lineHeight: 1, fontWeight: 950, letterSpacing: -2 }}>{title}</h1>
          <p style={{ margin: "14px 0 0", fontSize: 18, lineHeight: 1.45, fontWeight: 700, color: "#6b7280" }}>Lihat klasemen dan jadwal lengkap melalui laman {pageUrl}</p>
        </div>
        <div style={{ width: 82, height: 82, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <img src="/logo-risma.png" alt="RISMA" style={{ width: 78, height: 78, objectFit: "contain" }} />
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
      <SponsorStrip sponsors={sponsors} />
    </div>
  )
}

export function ShareButton({
  title,
  standings,
  matches,
  sponsors,
}: {
  title: string
  standings: Standing[]
  matches: Match[]
  sponsors: Sponsor[]
}) {
  const standingsRef = useRef<HTMLDivElement>(null)
  const scheduleRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState<"standings" | "schedule" | null>(null)
  const [shared, setShared] = useState<"standings" | "schedule" | null>(null)
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>("nearest")
  const [previewType, setPreviewType] = useState<"standings" | "schedule" | null>(null)
  const [pageUrl] = useState(() => typeof window === "undefined" ? "" : window.location.href)

  const nowWib = getWibStamp()
  const upcomingMatches = matches
    .filter((match) => match.status !== "selesai" && matchStamp(match) >= nowWib)
    .sort((a, b) => matchStamp(a).localeCompare(matchStamp(b)))

  const scheduleMatches = scheduleMode === "nearest" ? upcomingMatches.slice(0, 6) : upcomingMatches

  const shareCapture = async (type: "standings" | "schedule") => {
    const element = type === "standings" ? standingsRef.current : scheduleRef.current
    if (!element) {
      toast.error("Gagal menemukan konten untuk di-share")
      return
    }

    setLoading(type)
    try {
      const captureHeight = type === "schedule" && scheduleMode === "all" ? element.scrollHeight : 900
      const dataUrl = await toJpeg(element, {
        quality: 0.95,
        backgroundColor: "#ffffff",
        width: 1200,
        height: captureHeight,
        canvasWidth: 1200,
        canvasHeight: captureHeight,
        pixelRatio: 1,
      })

      const blob = await (await fetch(dataUrl)).blob()
      const fileName = `${slug(title)}-${type === "standings" ? "klasemen" : `jadwal-${scheduleMode}`}.jpg`
      const file = new File([blob], fileName, { type: "image/jpeg" })
      const shareData = {
        files: [file],
        title,
        text: `${type === "standings" ? "Klasemen" : "Jadwal pertandingan"} ${title}. Lihat klasemen dan jadwal lengkap melalui laman ${pageUrl || window.location.href}`,
        url: pageUrl || window.location.href,
      }

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        setShared(type)
        setTimeout(() => setShared(null), 2000)
        toast.success("Berhasil dibagikan!")
      } else {
        const link = document.createElement("a")
        link.download = fileName
        link.href = dataUrl
        link.click()
        await navigator.clipboard.writeText(pageUrl || window.location.href)
        toast.success("Gambar diunduh & tautan disalin ke clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast.error("Gagal membagikan gambar")
    } finally {
      setLoading(null)
    }
  }

  const standingsPreview = (
    <CaptureFrame title={title} label="Klasemen" sponsors={sponsors} pageUrl={pageUrl}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", fontSize: 24 }}>
        <thead>
          <tr style={{ color: "#6b7280", fontSize: 16, textTransform: "uppercase", letterSpacing: 2, borderBottom: "2px solid #e5e7eb" }}>
            <th style={{ width: 60, padding: "14px 10px", textAlign: "left" }}>#</th>
            <th style={{ padding: "14px 10px", textAlign: "left" }}>Tim</th>
            <th style={{ width: 80, padding: "14px 10px", textAlign: "center" }}>M</th>
            <th style={{ width: 80, padding: "14px 10px", textAlign: "center" }}>W</th>
            <th style={{ width: 80, padding: "14px 10px", textAlign: "center" }}>L</th>
            <th style={{ width: 110, padding: "14px 10px", textAlign: "center" }}>TW/TL</th>
            <th style={{ width: 100, padding: "14px 10px", textAlign: "center" }}>Poin</th>
          </tr>
        </thead>
        <tbody>
          {standings.slice(0, 10).map((row, index) => (
            <tr key={row.team} style={{ borderBottom: "1px solid #eef0f3" }}>
              <td style={{ padding: "18px 10px", fontWeight: 950, color: "oklch(0.457 0.24 277.023)" }}>{index + 1}</td>
              <td style={{ padding: "18px 10px", fontWeight: 850, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.team}</td>
              <td style={{ padding: "18px 10px", textAlign: "center", color: "#6b7280" }}>{row.main}</td>
              <td style={{ padding: "18px 10px", textAlign: "center", color: "#16a34a" }}>{row.menang}</td>
              <td style={{ padding: "18px 10px", textAlign: "center", color: "#dc2626" }}>{row.kalah}</td>
              <td style={{ padding: "18px 10px", textAlign: "center", fontWeight: 800 }}>{row.tw}/{row.tl}</td>
              <td style={{ padding: "18px 10px", textAlign: "center", fontWeight: 950, fontSize: 28 }}>{row.poin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CaptureFrame>
  )

  const schedulePreview = (
    <CaptureFrame title={title} label={scheduleMode === "nearest" ? "Jadwal terdekat" : "Semua jadwal"} sponsors={sponsors} pageUrl={pageUrl} autoHeight={scheduleMode === "all"}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {scheduleMatches.map((match) => (
          <div key={match.id} style={{ border: "1px solid #e5e7eb", borderRadius: 24, padding: 22, minHeight: 120 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 18, color: "#6b7280", fontSize: 16, fontWeight: 750 }}>
              <span>{formatDate(match.tanggal)}</span>
              <span>{formatTime(match.jam)}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12, textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 850, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayTeam(match.tim_a)}</p>
              <span style={{ borderRadius: 12, background: "#f3f4f6", padding: "6px 14px", fontSize: 15, fontWeight: 950, color: "#6b7280" }}>VS</span>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 850, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayTeam(match.tim_b)}</p>
            </div>
            {match.babak && (
              <p style={{ margin: "16px 0 0", color: "oklch(0.457 0.24 277.023)", fontSize: 14, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.5 }}>{match.babak}</p>
            )}
          </div>
        ))}
      </div>
    </CaptureFrame>
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => setPreviewType("standings")}
        disabled={loading !== null}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold tracking-tight text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 disabled:opacity-50"
      >
        {shared === "standings" ? <Check className="size-4 text-emerald-500" /> : <Trophy className="size-4" />}
        <span>Bagikan Klasemen</span>
      </button>
      <button
        onClick={() => setPreviewType("schedule")}
        disabled={loading !== null}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold tracking-tight text-background shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
      >
        {shared === "schedule" ? <Check className="size-4 text-emerald-500" /> : <Share2 className="size-4" />}
        <span>Bagikan Jadwal</span>
      </button>

      <Dialog open={previewType !== null} onOpenChange={(open) => !open && setPreviewType(null)}>
        <DialogContent className="max-h-[92vh] max-w-[calc(100vw-1rem)] overflow-y-auto rounded-3xl p-3 sm:max-w-[720px] sm:p-4" showCloseButton={false}>
          <DialogHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <DialogTitle>{previewType === "standings" ? "Preview Klasemen" : "Preview Jadwal"}</DialogTitle>
            {previewType === "schedule" && (
              <select
                value={scheduleMode}
                onChange={(event) => setScheduleMode(event.target.value as ScheduleMode)}
                className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold outline-none"
                disabled={loading !== null}
              >
                <option value="nearest">Jadwal terdekat</option>
                <option value="all">Semua jadwal</option>
              </select>
            )}
          </DialogHeader>
          <div className="overflow-auto">
            <div className="mx-auto w-[1200px] origin-top-left [zoom:0.54] max-sm:[zoom:calc((100vw-2.5rem)/1200)]">
              {previewType === "standings" ? standingsPreview : schedulePreview}
            </div>
          </div>
          <button
            onClick={() => previewType && shareCapture(previewType)}
            disabled={loading !== null}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Share2 className="size-4" />}
            Share gambar
          </button>
        </DialogContent>
      </Dialog>

      <div aria-hidden className="pointer-events-none fixed -left-[9999px] top-0">
        <div ref={standingsRef}>{standingsPreview}</div>
        <div ref={scheduleRef}>{schedulePreview}</div>
      </div>
    </div>
  )
}
