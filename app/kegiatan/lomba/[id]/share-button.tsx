"use client"

import { useState } from "react"
import { Share2, Loader2, Check } from "lucide-react"
import { toJpeg } from "html-to-image"
import { toast } from "sonner"

export function ShareButton({ title }: { title: string }) {
  const [loading, setLoading] = useState(false)
  const [shared, setShared] = useState(false)

  const handleShare = async () => {
    const element = document.getElementById("lomba-content")
    if (!element) {
      toast.error("Gagal menemukan konten lomba untuk di-share")
      return
    }

    setLoading(true)
    try {
      // Tunggu render selesai
      const dataUrl = await toJpeg(element, {
        quality: 0.95,
        backgroundColor: "#09090b", // Background zinc-950 biar pas
        style: {
          background: "#09090b", // Paksakan background style agar tidak transparan/hitam
          transform: "scale(1)",
          transformOrigin: "top left",
          width: element.offsetWidth + "px",
          height: element.offsetHeight + "px",
        },
        filter: (node) => {
          return !(node instanceof HTMLElement && node.classList.contains("no-share-capture"))
        },
      })

      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], `${title.toLowerCase().replace(/\s+/g, "-")}-klasemen.jpg`, {
        type: "image/jpeg",
      })

      const shareData = {
        files: [file],
        title: title,
        text: `Klasemen dan Jadwal Pertandingan ${title}. Cek selengkapnya di sini!`,
        url: window.location.href,
      }

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
        toast.success("Berhasil dibagikan!")
      } else {
        // Fallback: download gambar + copy url
        const link = document.createElement("a")
        link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-klasemen.jpg`
        link.href = dataUrl
        link.click()

        await navigator.clipboard.writeText(window.location.href)
        toast.success("Gambar klasemen diunduh & tautan disalin ke clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast.error("Gagal membagikan klasemen")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold tracking-tight text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : shared ? (
        <Check className="size-4 text-emerald-500" />
      ) : (
        <Share2 className="size-4" />
      )}
      <span>Bagikan Klasemen</span>
    </button>
  )
}
