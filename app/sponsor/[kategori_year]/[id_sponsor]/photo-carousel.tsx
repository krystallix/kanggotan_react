"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

export function PhotoCarousel({ photos, nama }: { photos: string[]; nama: string }) {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [paused, setPaused] = useState(false)
  const total = photos.length
  const cardThumbRefs = useRef<(HTMLButtonElement | null)[]>([])
  const overlayThumbRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (paused || open || total <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % total), 3500)
    return () => clearInterval(t)
  }, [paused, open, total])

  useEffect(() => {
    cardThumbRefs.current[index]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    overlayThumbRefs.current[index]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }, [index])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + total) % total)
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % total)
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [open, total])

  const go = (next: number) => setIndex(((next % total) + total) % total)

  return (
    <>
      <div
        className="relative w-full overflow-hidden bg-black"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <img
          src={photos[index]}
          alt={`${nama} foto ${index + 1}`}
          className="aspect-[4/3] w-full cursor-zoom-in object-cover"
          onClick={() => setOpen(true)}
        />
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                go(index - 1)
              }}
              aria-label="Foto sebelumnya"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 text-white p-2 backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                go(index + 1)
              }}
              aria-label="Foto berikutnya"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 text-white p-2 backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
              {index + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 py-3">
          {photos.map((photo, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              ref={(el) => {
                cardThumbRefs.current[i] = el
              }}
              className={`shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === index ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={photo} alt={`${nama} thumbnail ${i + 1}`} loading="lazy" className="size-14 object-cover" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/85 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">
              {nama}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup"
              className="rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-4">
            {total > 1 && (
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Foto sebelumnya"
                className="absolute left-3 z-10 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/25 sm:left-6"
              >
                <ChevronLeft className="size-6" />
              </button>
            )}
            <img
              src={photos[index]}
              alt={`${nama} foto ${index + 1}`}
              className="max-h-[70vh] max-w-[88vw] rounded-2xl object-contain"
            />
            {total > 1 && (
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Foto berikutnya"
                className="absolute right-3 z-10 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/25 sm:right-6"
              >
                <ChevronRight className="size-6" />
              </button>
            )}
          </div>

          {total > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-6">
              {photos.map((photo, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  ref={(el) => {
                    overlayThumbRefs.current[i] = el
                  }}
                  className={`shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    i === index ? "border-white" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={photo} alt={`${nama} thumbnail ${i + 1}`} loading="lazy" className="size-16 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
