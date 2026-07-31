"use client"

import { motion, useInView, animate, cubicBezier } from "framer-motion"
import { useRef, useEffect, useState } from "react"

const easeOut = cubicBezier(0.25, 0.1, 0.25, 1)

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
  y = 16,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerChildren({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  stagger?: number
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  y = 20,
}: {
  children: React.ReactNode
  className?: string
  y?: number
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function CountUp({
  value,
  suffix = "",
  prefix = "",
  className,
  duration = 1.4,
}: {
  value: number
  suffix?: string
  prefix?: string
  className?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  )
}
