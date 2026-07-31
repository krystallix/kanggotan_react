"use client"

import { useEffect, useState } from "react"
import { Nav } from "@/components/nav-menu"
import NextTopLoader from "nextjs-toploader"
import Link from "next/link"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Footer } from "@/components/layout/footer"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NextTopLoader color="oklch(0.457 0.24 277.023)" showSpinner={false} height={2} />
      <SpeedInsights />
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-black/8 shadow-sm"
          : "bg-transparent"
          }`}
      >
        <div className="container mx-auto px-6 py-4 max-w-6xl">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="size-8 rounded-xl bg-[oklch(0.457_0.24_277.023)] flex items-center justify-center font-black text-sm text-white">
                K
              </span>
              <span className="text-base font-bold tracking-tight text-foreground">Kanggotan</span>
            </Link>
            <Nav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-2 flex-1 max-w-6xl">
        {children}
      </main>

      <Footer />
    </div>
  )
}
