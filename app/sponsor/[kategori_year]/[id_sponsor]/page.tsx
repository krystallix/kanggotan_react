import Layout from "@/components/layout/home-layout"
import { getKategoriAll, getSponsorById } from "@/lib/supabase/queries-server"
import { slugify, kategoriYearSegment } from "@/lib/slug"
import { notFound } from "next/navigation"
import { Phone, ChevronLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { FadeIn } from "@/components/motion"
import { PhotoCarousel } from "./photo-carousel"
import { sponsorLinkIcon } from "@/lib/sponsor-link-icon"
import { getSiteUrl } from "@/lib/site"

type PageProps = {
  params: Promise<{ kategori_year: string; id_sponsor: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { kategori_year, id_sponsor } = await params
  const url = await getSiteUrl()
  const sponsor = await getSponsorById(Number(id_sponsor))
  if (!sponsor) return { title: "Sponsor", robots: { index: false } }
  const lastDash = kategori_year.lastIndexOf("-")
  const year = Number(kategori_year.slice(lastDash + 1))
  const slugPart = lastDash > 0 ? kategori_year.slice(0, lastDash) : ""
  const kategoriList = await getKategoriAll()
  const kategori = slugPart ? kategoriList.find((k) => slugify(k.name) === slugPart) : undefined
  return {
    title: sponsor.nama,
    description: sponsor.deskripsi
      ? `${sponsor.nama} — sponsor kegiatan ${kategori?.name ?? ""} ${year}. ${sponsor.deskripsi}`
      : `Sponsor ${kategori?.name ?? ""} ${year} yang mendukung kegiatan RISMA Kanggotan Lor — ${sponsor.nama}.`,
    alternates: { canonical: `${url}/sponsor/${kategori_year}/${id_sponsor}` },
    openGraph: {
      title: `${sponsor.nama} — Sponsor RISMA Kanggotan`,
      description: sponsor.deskripsi ?? `Sponsor kegiatan ${kategori?.name ?? ""} ${year} RISMA Kanggotan Lor.`,
      url: `${url}/sponsor/${kategori_year}/${id_sponsor}`,
      type: "website",
      images: [
        {
          url: `${url}/og/${kategori_year}/${id_sponsor}`,
          width: 1200,
          height: 630,
          alt: sponsor.nama,
        },
      ],
    },
  }
}

export default async function SponsorDetailPage({ params }: PageProps) {
  const { kategori_year, id_sponsor } = await params
  const sponsorId = Number(id_sponsor)
  if (!Number.isFinite(sponsorId)) notFound()

  const lastDash = kategori_year.lastIndexOf("-")
  if (lastDash <= 0) notFound()
  const year = Number(kategori_year.slice(lastDash + 1))
  const slugPart = kategori_year.slice(0, lastDash)
  if (!Number.isFinite(year)) notFound()

  const [kategoriList, sponsor] = await Promise.all([
    getKategoriAll(),
    getSponsorById(sponsorId),
  ])

  if (!sponsor) notFound()
  const kategori = kategoriList.find((k) => slugify(k.name) === slugPart)
  if (!kategori) notFound()

  if (sponsor.year !== year || sponsor.kategori_id !== kategori.id) notFound()

  return (
    <Layout>
      <div className="py-6 sm:py-10">
        <FadeIn className="-mx-3 sm:mx-0 mb-5 px-2 sm:px-0 flex flex-wrap items-center gap-2">
          <Link
            href={`/sponsors/${kategoriYearSegment(kategori.name, year)}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-4 py-2 text-xs font-bold text-foreground shadow-sm transition-all duration-200 hover:border-primary/40 hover:text-primary"
          >
            <ChevronLeft className="size-4" />
            Semua Sponsor
          </Link>
        </FadeIn>

        <FadeIn delay={0.05} className="-mx-6 sm:mx-auto sm:max-w-md">
          <div className="rounded-none sm:rounded-3xl border-0 sm:border border-border/60 bg-card shadow-none sm:shadow-sm overflow-hidden">
            {sponsor.photos.length > 0 && (
              <PhotoCarousel photos={sponsor.photos} nama={sponsor.nama} />
            )}


            <div className="px-5 py-4 sm:px-6 sm:py-5 flex flex-col items-center text-center">
              {sponsor.logo_url ? (
                <div className="size-20 rounded-2xl bg-muted p-2 border border-border/50 flex items-center justify-center overflow-hidden">
                  <img src={sponsor.logo_url} alt={sponsor.nama} className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div className="size-20 rounded-2xl bg-primary/10 text-primary font-black text-3xl flex items-center justify-center">
                  {sponsor.nama.charAt(0).toUpperCase()}
                </div>
              )}

              <h1 className="mt-3 text-2xl font-bold tracking-tight">{sponsor.nama}</h1>

              {/* <div className="mt-2 flex items-center gap-2 flex-wrap justify-center">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-1 rounded-md">
                  {kategori.name}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-muted text-muted-foreground px-2.5 py-1 rounded-md">
                  {year}
                </span>
              </div> */}

              {sponsor.deskripsi && (
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed max-w-sm">{sponsor.deskripsi}</p>
              )}
            </div>

            <div className="px-6 pb-6 space-y-4">
              {sponsor.phone && (
                <a
                  href={`tel:${sponsor.phone.replace(/[^\d+]/g, "")}`}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
                >
                  <Phone className="size-4" />
                  {sponsor.phone}
                </a>
              )}

              {sponsor.links.length > 0 && (
                <div className="space-y-3">
                  {sponsor.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-muted/30 px-5 py-3.5 text-sm font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        {sponsorLinkIcon(link.title, link.url, "size-4 shrink-0 text-muted-foreground")}
                        <span className="truncate">{link.title}</span>
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="mt-6 px-6 sm:px-0 text-center font-bold text-xs text-muted-foreground">
            TERIMA KASIH SUDAH MENDUKUNG KAMI.
          </p>
        </FadeIn>
      </div>
    </Layout>
  )
}
