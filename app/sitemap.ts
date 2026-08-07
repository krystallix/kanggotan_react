import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site"
import { getKategoriAll, getSponsorsByYearKategori } from "@/lib/supabase/queries-server"
import { createClient } from "@/lib/supabase/server"
import { kategoriYearSegment } from "@/lib/slug"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = await getSiteUrl()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/kegiatan`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/tentang-kami`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/haul-massal`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/galeri`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/blog`, changeFrequency: "monthly", priority: 0.4 },
  ]

  const kategoriList = await getKategoriAll()

  const supabase = await createClient()
  const { data: yearRows } = await supabase
    .schema("db_kanggotan2")
    .from("kegiatan")
    .select("year")
    .eq("is_published", true)
    .not("year", "is", null)
  const years = Array.from(
    new Set((yearRows || []).map((r) => Number((r as { year: number }).year)))
  )

  const sponsorRoutes: MetadataRoute.Sitemap = []
  for (const kategori of kategoriList) {
    for (const year of years) {
      const segment = kategoriYearSegment(kategori.name, year)
      sponsorRoutes.push({
        url: `${base}/sponsors/${segment}`,
        changeFrequency: "weekly",
        priority: 0.7,
      })
      const sponsors = await getSponsorsByYearKategori(year, kategori.id)
      for (const s of sponsors) {
        sponsorRoutes.push({
          url: `${base}/sponsor/${segment}/${s.id}`,
          changeFrequency: "monthly",
          priority: 0.6,
        })
      }
    }
  }

  return [...staticRoutes, ...sponsorRoutes]
}
