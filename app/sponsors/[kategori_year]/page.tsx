import Layout from "@/components/layout/home-layout"
import { getKategoriAll, getSponsorsByYearKategori } from "@/lib/supabase/queries-server"
import { slugify, kategoriYearSegment } from "@/lib/slug"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion"

type PageProps = {
  params: Promise<{ kategori_year: string }>
}

export default async function SponsorListPage({ params }: PageProps) {
  const { kategori_year } = await params

  const lastDash = kategori_year.lastIndexOf("-")
  if (lastDash <= 0) notFound()
  const year = Number(kategori_year.slice(lastDash + 1))
  const slugPart = kategori_year.slice(0, lastDash)
  if (!Number.isFinite(year)) notFound()

  const kategoriList = await getKategoriAll()
  const kategori = kategoriList.find((k) => slugify(k.name) === slugPart)
  if (!kategori) notFound()

  const sponsorList = await getSponsorsByYearKategori(year, kategori.id)
  const segment = kategoriYearSegment(kategori.name, year)

  return (
    <Layout>
      <div className="py-10">
        <FadeIn className="mb-10">
          <p className="text-xs font-medium tracking-widest uppercase text-primary/70 mb-3">Sponsor</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{kategori.name} {year}</h1>
          <p className="text-muted-foreground mt-2 max-w-md">
            Terima kasih kepada para sponsor yang mendukung kesuksesan kegiatan RISMA tahun {year}.
          </p>
        </FadeIn>

        {sponsorList.length === 0 ? (
          <FadeIn delay={0.1}>
            <p className="text-center py-16 text-muted-foreground">
              Belum ada sponsor untuk kategori ini.
            </p>
          </FadeIn>
        ) : (
          <StaggerChildren stagger={0.05} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sponsorList.map((sponsor) => (
              <StaggerItem key={sponsor.id}>
                <Link
                  href={`/sponsor/${segment}/${sponsor.id}`}
                  className="group block h-full rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/[0.05]"
                >
                  <div className="flex items-center gap-4">
                    {sponsor.logo_url ? (
                      <div className="size-16 shrink-0 rounded-xl bg-muted p-1.5 border border-border/50 flex items-center justify-center overflow-hidden">
                        <img src={sponsor.logo_url} alt={sponsor.nama} className="max-h-full max-w-full object-contain" />
                      </div>
                    ) : (
                      <div className="size-16 shrink-0 rounded-xl bg-primary/10 text-primary font-black text-xl flex items-center justify-center">
                        {sponsor.nama.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                        {sponsor.nama}
                      </h3>
                      {sponsor.deskripsi && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{sponsor.deskripsi}</p>
                      )}
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        )}
      </div>
    </Layout>
  )
}
