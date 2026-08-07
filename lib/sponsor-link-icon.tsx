import { ExternalLink, MapPin } from "lucide-react"
import { FacebookIcon, InstagramIcon, ShopeeIcon, TiktokIcon, WhatsappIcon, YoutubeIcon } from "@/components/brand-icons"

export function sponsorLinkIcon(title: string, url: string, className = "size-4") {
  const text = `${title} ${url}`.toLowerCase()

  if (text.includes("instagram")) return <InstagramIcon className={className} />
  if (text.includes("tiktok")) return <TiktokIcon className={className} />
  if (text.includes("whatsapp") || text.includes("wa.me") || /\bwa\b/.test(text)) return <WhatsappIcon className={className} />
  if (text.includes("shopee")) return <ShopeeIcon className={className} />
  if (text.includes("youtube") || text.includes("youtu.be")) return <YoutubeIcon className={className} />
  if (text.includes("facebook") || text.includes("marketplace") || /\bfb\b/.test(text)) return <FacebookIcon className={className} />
  if (text.includes("lokasi") || text.includes("maps") || text.includes("alamat")) return <MapPin className={className} />

  return <ExternalLink className={className} />
}
