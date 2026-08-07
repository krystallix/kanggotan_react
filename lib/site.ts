import { headers } from "next/headers"

export const SITE_NAME = "RISMA Kanggotan"
export const SITE_DESCRIPTION =
  "RISMA Kanggotan Lor — Remaja Masjid At-Ta'awun. Aktif dalam kegiatan keagamaan, sosial, dan pemberdayaan pemuda di Kanggotan Lor, Yogyakarta."

export const SITE_URL_FALLBACK = "https://kanggotan.site"

export async function getSiteUrl(): Promise<string> {
  const h = await headers()
  const host = h.get("x-forwarded-host") || h.get("host")
  if (!host) return SITE_URL_FALLBACK
  const proto = h.get("x-forwarded-proto") || "https"
  return `${proto}://${host}`
}
