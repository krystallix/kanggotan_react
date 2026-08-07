import { ImageResponse } from "next/og"
import { SITE_NAME } from "@/lib/site"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const INDIGO = "#4538c8"
const INDIGO_DARK = "#1e1b4b"
const TEXT = "#ffffff"
const MUTED = "rgba(255,255,255,0.72)"

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${INDIGO} 0%, ${INDIGO_DARK} 100%)`,
        padding: 72,
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: 32,
          background: "#ffffff",
          color: INDIGO,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          fontWeight: 900,
          marginBottom: 40,
        }}
      >
        K
      </div>
      <h1 style={{ fontSize: 72, fontWeight: 950, letterSpacing: -2, margin: 0, color: TEXT }}>
        {SITE_NAME}
      </h1>
      <p style={{ fontSize: 28, color: MUTED, margin: "24px 0 0", textAlign: "center", maxWidth: 760, lineHeight: 1.4 }}>
        Remaja Masjid At-Ta&apos;awun Kanggotan Lor — kegiatan keagamaan, sosial, dan pemberdayaan pemuda.
      </p>
      <span
        style={{
          marginTop: 44,
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)",
        }}
      >
        rismakanggotan
      </span>
    </div>,
    { width: 1200, height: 630 }
  )
}
