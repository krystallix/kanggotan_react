import { ImageResponse } from "next/og"
import { getKategoriAll, getSponsorById } from "@/lib/supabase/queries-server"
import { slugify } from "@/lib/slug"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const INDIGO = "#4538c8"
const INDIGO_DARK = "#1e1b4b"
const TEXT = "#ffffff"
const MUTED = "rgba(255,255,255,0.72)"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ kategori_year: string; id_sponsor: string }> }
) {
  const { kategori_year, id_sponsor } = await params
  const sponsor = await getSponsorById(Number(id_sponsor))
  if (!sponsor) {
    return new ImageResponse(<OgShell />, ogOptions)
  }
  const sp = sponsor

  const lastDash = kategori_year.lastIndexOf("-")
  const year = Number(kategori_year.slice(lastDash + 1))
  const slugPart = lastDash > 0 ? kategori_year.slice(0, lastDash) : ""
  const kategoriList = await getKategoriAll()
  const kategori = slugPart ? kategoriList.find((k) => slugify(k.name) === slugPart) : undefined

  return new ImageResponse(<OgShell />, ogOptions)

  function OgShell() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: `linear-gradient(135deg, ${INDIGO} 0%, ${INDIGO_DARK} 100%)`,
          padding: 72,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "#ffffff",
                color: INDIGO,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 900,
              }}
            >
              K
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: MUTED }}>
              RISMA Kanggotan
            </span>
          </div>

          {sp.logo_url ? (
            <div
              style={{
                width: 132,
                height: 132,
                borderRadius: 28,
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                padding: 18,
                marginBottom: 28,
              }}
            >
              <img src={sp.logo_url} alt="" width={96} height={96} style={{ objectFit: "contain" }} />
            </div>
          ) : (
            <div
              style={{
                width: 132,
                height: 132,
                borderRadius: 28,
                background: "rgba(255,255,255,0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 56,
                fontWeight: 900,
                color: TEXT,
                marginBottom: 28,
              }}
            >
              {sp.nama.charAt(0).toUpperCase()}
            </div>
          )}

          <h1
            style={{
              fontSize: 64,
              fontWeight: 950,
              letterSpacing: -2,
              lineHeight: 1,
              margin: 0,
              color: TEXT,
              textAlign: "center",
              maxWidth: 880,
            }}
          >
            {sp.nama}
          </h1>

          <p style={{ fontSize: 26, fontWeight: 800, color: "rgba(255,255,255,0.85)", margin: "20px 0 0" }}>
            {kategori?.name ?? "Sponsor"} · {year}
          </p>

          {sp.deskripsi && (
            <p
              style={{
                fontSize: 24,
                color: MUTED,
                margin: "24px 0 0",
                textAlign: "center",
                maxWidth: 820,
                lineHeight: 1.4,
              }}
            >
              {sp.deskripsi.length > 180 ? `${sp.deskripsi.slice(0, 180)}…` : sp.deskripsi}
            </p>
          )}
        </div>
      </div>
    )
  }
}

const ogOptions = {
  width: 1200,
  height: 630,
}
