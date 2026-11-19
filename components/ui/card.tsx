"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/** Hairline card with a soft spotlight that follows the cursor. */
export function SpotlightCard({ children, className, ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  const ref = React.useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        el.style.setProperty("--mouse-x", `${e.clientX - r.left}px`)
        el.style.setProperty("--mouse-y", `${e.clientY - r.top}px`)
      }}
      className={cn("group/spot relative", className)}
      {...props}
    >
      {children}
      <div className="spotlight pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100" />
    </div>
  )
}
