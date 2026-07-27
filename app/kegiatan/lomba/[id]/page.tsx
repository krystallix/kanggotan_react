import Layout from "@/components/layout/home-layout"
import { getPertandinganByLombaId } from "@/lib/supabase/queries-server"
import { createClient } from "@/lib/supabase/server"
import { CalendarDays, Clock, Users } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

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
  const today = new Date().toISOString().split("T")[0]
  const grouped = pertandingan.reduce<Record<string, typeof pertandingan>>((acc, item) => {
    const key = item.tanggal || "Tanpa tanggal"
    acc[key] = [...(acc[key] || []), item]
    return acc
  }, {})

  return (
    <Layout>
      <div className="min-h-screen bg-white">

        {/* ── HERO HEADER – compact, no card ──────────────────── */}
        <div className="max-w-5xl mx-auto px-4 pt-8 pb-6">
          {/* Sub-label */}
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-red-600 mb-1">
            {lomba.kegiatan?.title}
          </p>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-gray-900 mb-3">
            {lomba.nama}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-500">
            {lomba.tanggal && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5 text-red-600" />
                {new Date(lomba.tanggal + "T00:00:00").toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
            {lomba.jam && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5 text-red-600" />
                {lomba.jam.slice(0, 5)} WIB
              </span>
            )}
            {lomba.pic_nama && (
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3.5 text-red-600" />
                {lomba.pic_nama}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="mt-5 h-px bg-gray-200" />
        </div>

        {/* ── SCHEDULE SECTION ────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 pt-6 pb-16">
          {pertandingan.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Object.entries(grouped).map(([tanggal, items]) => {
                const isToday = tanggal === today
                const dateLabel =
                  tanggal === "Tanpa tanggal"
                    ? "Tanpa tanggal"
                    : new Date(tanggal + "T00:00:00").toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })

                return (
                  <section
                    key={tanggal}
                    className={[
                      "overflow-hidden rounded-lg border bg-white",
                      isToday
                        ? "border-red-500 shadow-[0_8px_24px_-6px_rgba(220,38,38,0.2)]"
                        : "border-gray-200 shadow-sm",
                    ].join(" ")}
                  >
                    {/* Date header */}
                    <div
                      className={[
                        "px-4 py-2.5 text-center",
                        isToday ? "bg-red-600" : "bg-gray-200",
                      ].join(" ")}
                    >
                      <p
                        className={[
                          "text-[11px] font-black uppercase tracking-[0.2em]",
                          isToday ? "text-white" : "text-gray-600",
                        ].join(" ")}
                      >
                        {dateLabel}
                      </p>
                    </div>

                    {/* Match rows */}
                    <div className="px-4 pb-4 pt-3 space-y-2.5">
                      {items.map((p) => (
                        <article
                          key={p.id}
                          className="grid items-center gap-2"
                          style={{ gridTemplateColumns: "minmax(0,1fr) 4.5rem minmax(0,1fr)" }}
                        >
                          {/* Team A */}
                          <p className="truncate text-base font-black leading-none text-gray-900 tracking-tight">
                            {p.tim_a}
                          </p>

                          {/* VS / Score column */}
                          <div className="flex flex-col items-center gap-0">
                            <span className="text-[9px] font-semibold text-gray-800 uppercase tracking-wider">
                              {p.jam?.slice(0, 5) || "TBA"}
                            </span>
                            <strong className="text-lg font-black leading-none text-red-600 tabular-nums tracking-tight">
                              {p.skor_a === null ? "VS" : `${p.skor_a}–${p.skor_b}`}
                            </strong>
                            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
                              {p.babak}
                            </span>
                          </div>

                          {/* Team B */}
                          <p className="truncate text-base font-black leading-none text-right text-gray-900 tracking-tight">
                            {p.tim_b}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-lg bg-gray-100">
                <span className="text-2xl text-gray-300">🏆</span>
              </div>
              <p className="font-medium text-gray-400">Belum ada jadwal pertandingan.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
