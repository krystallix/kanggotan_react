// hooks/use-mobile-stable.ts
"use client"

import { useState, useEffect, useRef } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const mountedRef = useRef(false)

  useEffect(() => {
    // Set initial value
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      if (!mountedRef.current || mobile !== isMobile) {
        setIsMobile(mobile)
        mountedRef.current = true
      }
    }

    checkMobile()

    // Debounce resize untuk avoid excessive re-renders
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkMobile, 200)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", handleResize)
    }
  }, [isMobile])

  return isMobile
}