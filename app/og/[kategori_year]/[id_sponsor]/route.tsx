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

  const linksCount = sponsor.links?.length ?? 0
  const photosCount = sponsor.photos?.length ?? 0
  const metas = [
    `${kategori?.name ?? "Sponsor"}`,
    String(year),
    sponsor.phone ? `Telp ${sponsor.phone}` : null,
    linksCount > 0 ? `${linksCount} link` : null,
    photosCount > 0 ? `${photosCount} foto` : null,
  ].filter(Boolean)

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

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28 }}>
            {metas.map((m) => (
              <span
                key={m}
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "rgba(255,255,255,0.92)",
                  background: "rgba(255,255,255,0.14)",
                  borderRadius: 999,
                  padding: "10px 22px",
                }}
              >
                {m}
              </span>
            ))}
          </div>

          {sp.deskripsi && (
            <p
              style={{
                fontSize: 24,
                color: MUTED,
                margin: "28px 0 0",
                textAlign: "center",
                maxWidth: 760,
                lineHeight: 1.4,
              }}
            >
              {sp.deskripsi.length > 160 ? `${sp.deskripsi.slice(0, 160)}…` : sp.deskripsi}
            </p>
          )}

          <div style={{ position: "absolute", bottom: 44, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: MUTED, letterSpacing: 1 }}>
              TERIMA KASIH SUDAH MENDUKUNG KAMI
            </span>
          </div>
        </div>
      </div>
    )
  }
}

const ogOptions = {
  width: 1200,
  height: 630,
}
