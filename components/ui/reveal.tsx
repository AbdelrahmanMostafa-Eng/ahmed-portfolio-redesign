"use client"

import * as React from "react"
import { motion, type Variants } from "motion/react"

const EASE = [0.16, 1, 0.3, 1] as const

/** Fades, lifts and un-blurs its children the first time they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
  as?: "div" | "section" | "li"
}) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </M>
  )
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={item} layout>
      {children}
    </motion.div>
  )
}
